import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export interface User {
  id: string
  register_number: string
  name: string
  email: string
  role: string
  date_of_birth?: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  error?: string
}

export async function authenticateStudent(registerNumber: string, password: string): Promise<AuthResponse> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('register_number', registerNumber)
      .eq('role', 'student')
      .single()

    if (error || !user) {
      return { success: false, error: 'Invalid registration number or user not found' }
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return { success: false, error: 'Invalid password' }
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        registerNumber: user.register_number, 
        role: user.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    )

    const userResponse: User = {
      id: user.id,
      register_number: user.register_number,
      name: user.name,
      email: user.email,
      role: user.role,
      date_of_birth: user.date_of_birth
    }

    return { success: true, user: userResponse, token }
  } catch (error) {
    console.error('Authentication error:', error)
    return { success: false, error: 'Authentication failed' }
  }
}

export async function authenticateAdmin(passkey: string): Promise<AuthResponse> {
  try {
    if (passkey !== process.env.ADMIN_PASSKEY) {
      return { success: false, error: 'Invalid admin passkey' }
    }

    // Get admin user from database
    const { data: admin, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'admin')
      .single()

    if (error || !admin) {
      return { success: false, error: 'Admin user not found' }
    }

    const token = jwt.sign(
      { 
        userId: admin.id, 
        registerNumber: admin.register_number, 
        role: admin.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    )

    const userResponse: User = {
      id: admin.id,
      register_number: admin.register_number,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      date_of_birth: admin.date_of_birth
    }

    return { success: true, user: userResponse, token }
  } catch (error) {
    console.error('Admin authentication error:', error)
    return { success: false, error: 'Admin authentication failed' }
  }
}

export function verifyToken(token: string): { valid: boolean; payload?: Record<string, unknown> } {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!)
    return { valid: true, payload: payload as Record<string, unknown> }
  } catch {
    return { valid: false }
  }
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}
