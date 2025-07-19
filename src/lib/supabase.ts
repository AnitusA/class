import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export function createClientComponentClient() {
  return createBrowserClient(supabaseUrl, supabaseKey)
}

export interface DatabaseUser {
  id: string
  register_number: string
  name: string
  email: string
  password: string
  date_of_birth: string | null
  role: string
  created_at: string
  updated_at: string
}

export interface DatabaseSeminar {
  id: string
  title: string
  description: string | null
  speaker: string
  date: string
  time: string
  venue: string
  registration_required: boolean
  max_participants: number | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface DatabaseHomework {
  id: string
  subject: string
  description: string
  date: string
  subject_url: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface DatabaseAssignment {
  id: string
  title: string
  description: string
  due_date: string
  subject: string
  created_at: string
  updated_at: string
}

export interface DatabaseTest {
  id: string
  title: string
  subject: string
  test_date: string
  type: string
  description: string
  syllabus: string
  marks: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface DatabaseTodo {
  id: string
  title: string
  description: string
  priority: string
  due_date: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface DatabaseNote {
  id: string
  title: string
  content: string
  subject: string
  tags: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: DatabaseUser
        Insert: Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'>>
      }
      seminars: {
        Row: DatabaseSeminar
        Insert: Omit<DatabaseSeminar, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<DatabaseSeminar, 'id' | 'created_at' | 'updated_at'>>
      }
      homework: {
        Row: DatabaseHomework
        Insert: Omit<DatabaseHomework, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<DatabaseHomework, 'id' | 'created_at' | 'updated_at'>>
      }
      assignments: {
        Row: DatabaseAssignment
        Insert: Omit<DatabaseAssignment, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<DatabaseAssignment, 'id' | 'created_at' | 'updated_at'>>
      }
      tests: {
        Row: DatabaseTest
        Insert: Omit<DatabaseTest, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<DatabaseTest, 'id' | 'created_at' | 'updated_at'>>
      }
      todos: {
        Row: DatabaseTodo
        Insert: Omit<DatabaseTodo, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<DatabaseTodo, 'id' | 'created_at' | 'updated_at'>>
      }
      notes: {
        Row: DatabaseNote
        Insert: Omit<DatabaseNote, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<DatabaseNote, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
