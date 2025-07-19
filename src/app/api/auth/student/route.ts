import { NextRequest, NextResponse } from 'next/server'
import { authenticateStudent } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { registerNumber, password } = await request.json()

    if (!registerNumber || !password) {
      return NextResponse.json(
        { error: 'Registration number and password are required' },
        { status: 400 }
      )
    }

    const result = await authenticateStudent(registerNumber, password)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      success: true,
      user: result.user
    })

    // Set HTTP-only cookie for the token
    response.cookies.set('auth-token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return response
  } catch (error) {
    console.error('Student login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
