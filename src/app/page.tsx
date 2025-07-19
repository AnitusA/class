'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import StudentLoginForm from '@/components/auth/StudentLoginForm'
import AdminLoginForm from '@/components/auth/AdminLoginForm'
import { BookOpen, Users, Shield } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student')
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (isAdmin) {
        router.push('/admin/dashboard')
      } else {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, isAdmin, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <BookOpen className="h-12 w-12 text-emerald-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Class Management System
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive platform for managing class activities, assignments, seminars, and more.
            Designed for both students and administrators.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <BookOpen className="h-8 w-8 text-emerald-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Course Management</h3>
            <p className="text-gray-600">Access syllabus, assignments, and study materials all in one place.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <Users className="h-8 w-8 text-teal-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Seminars & Events</h3>
            <p className="text-gray-600">Stay updated with upcoming seminars and register for events.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <Shield className="h-8 w-8 text-cyan-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
            <p className="text-gray-600">Role-based access with separate login systems for students and admins.</p>
          </div>
        </div>

        {/* Login Section */}
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tab Headers */}
          <div className="flex">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'student'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users className="h-5 w-5 inline mr-2" />
              Student
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'admin'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Shield className="h-5 w-5 inline mr-2" />
              Admin
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'student' ? (
              <StudentLoginForm />
            ) : (
              <AdminLoginForm />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p>&copy; 2025 Class Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
