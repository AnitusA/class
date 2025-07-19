import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { passkey } = await request.json()

    if (!passkey) {
      return NextResponse.json(
        { error: 'Admin passkey is required' },
        { status: 400 }
      )
    }

    const result = await authenticateAdmin(passkey)

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
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
