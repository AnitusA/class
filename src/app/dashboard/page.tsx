'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Users, 
  Clock,
  LogOut,
  Home,
  PenTool,
  Bookmark
} from 'lucide-react'

import { 
  DatabaseSeminar, 
  DatabaseHomework, 
  DatabaseAssignment, 
  DatabaseTest, 
  DatabaseTodo, 
  DatabaseNote 
} from '@/lib/supabase'

interface DashboardData {
  seminars: DatabaseSeminar[]
  homework: DatabaseHomework[]
  assignments: DatabaseAssignment[]
  tests: DatabaseTest[]
  todos: DatabaseTodo[]
  notes: DatabaseNote[]
}

export default function StudentDashboard() {
  const { user, logout, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    seminars: [],
    homework: [],
    assignments: [],
    tests: [],
    todos: [],
    notes: []
  })
  const [activeSection, setActiveSection] = useState('overview')
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/')
    } else if (user && user.role !== 'student') {
      router.push('/admin/dashboard')
    }
  }, [isAuthenticated, loading, user, router])

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setDataLoading(true)
      
      // Fetch all data in parallel
      const [seminarsRes, homeworkRes, assignmentsRes, testsRes, todosRes, notesRes] = await Promise.all([
        supabase.from('seminars').select('*').order('date', { ascending: true }),
        supabase.from('homework').select('*').order('date', { ascending: true }),
        supabase.from('assignments').select('*').order('due_date', { ascending: true }),
        supabase.from('tests').select('*').order('test_date', { ascending: true }),
        supabase.from('todos').select('*').order('due_date', { ascending: true }),
        supabase.from('notes').select('*').order('created_at', { ascending: false })
      ])

      setDashboardData({
        seminars: seminarsRes.data || [],
        homework: homeworkRes.data || [],
        assignments: assignmentsRes.data || [],
        tests: testsRes.data || [],
        todos: todosRes.data || [],
        notes: notesRes.data || []
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setDataLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'seminars', label: 'Seminars', icon: Users },
    { id: 'homework', label: 'Homework', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'tests', label: 'Tests', icon: PenTool },
    { id: 'todos', label: 'To-dos', icon: CheckSquare },
    { id: 'notes', label: 'Notes', icon: Bookmark }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-emerald-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-600">Welcome, </span>
                <span className="font-medium text-gray-900">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeSection === item.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {dataLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {activeSection === 'overview' && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Overview</h2>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                          <Users className="h-8 w-8 text-blue-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Seminars</p>
                            <p className="text-2xl font-bold text-gray-900">{dashboardData.seminars.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                          <FileText className="h-8 w-8 text-green-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Assignments</p>
                            <p className="text-2xl font-bold text-gray-900">{dashboardData.assignments.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                          <PenTool className="h-8 w-8 text-purple-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tests</p>
                            <p className="text-2xl font-bold text-gray-900">{dashboardData.tests.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                          <CheckSquare className="h-8 w-8 text-orange-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">To-dos</p>
                            <p className="text-2xl font-bold text-gray-900">{dashboardData.todos.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Seminars</h3>
                          <div className="space-y-3">
                            {dashboardData.seminars.slice(0, 3).map((seminar) => (
                              <div key={seminar.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                <div>
                                  <p className="font-medium text-gray-900">{seminar.title}</p>
                                  <p className="text-sm text-gray-600">{seminar.speaker}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-blue-600">{new Date(seminar.date).toLocaleDateString()}</p>
                                  <p className="text-sm text-gray-600">{seminar.time}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Assignments</h3>
                          <div className="space-y-3">
                            {dashboardData.assignments.slice(0, 3).map((assignment) => (
                              <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                <div>
                                  <p className="font-medium text-gray-900">{assignment.title}</p>
                                  <p className="text-sm text-gray-600">{assignment.subject}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-red-600">Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'seminars' && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Seminars</h2>
                    <div className="space-y-4">
                      {dashboardData.seminars.map((seminar) => (
                        <div key={seminar.id} className="bg-white rounded-lg shadow p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{seminar.title}</h3>
                              <p className="text-gray-600 mb-4">{seminar.description}</p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                                  <span><strong>Speaker:</strong> {seminar.speaker}</span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                  <span><strong>Date:</strong> {new Date(seminar.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                  <span><strong>Time:</strong> {seminar.time}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add similar sections for other menu items */}
                {activeSection === 'homework' && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Homework</h2>
                    <div className="space-y-4">
                      {dashboardData.homework.map((hw) => (
                        <div key={hw.id} className="bg-white rounded-lg shadow p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{hw.subject}</h3>
                          <p className="text-gray-600 mb-4">{hw.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Date: {new Date(hw.date).toLocaleDateString()}</span>
                            {hw.subject_url && (
                              <a 
                                href={hw.subject_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                View Details →
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'assignments' && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Assignments</h2>
                    <div className="space-y-4">
                      {dashboardData.assignments.map((assignment) => (
                        <div key={assignment.id} className="bg-white rounded-lg shadow p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                          <p className="text-gray-600 mb-4">{assignment.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Subject: {assignment.subject}</span>
                            <span className="text-sm font-medium text-red-600">Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'tests' && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Tests</h2>
                    <div className="space-y-4">
                      {dashboardData.tests.map((test) => (
                        <div key={test.id} className="bg-white rounded-lg shadow p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{test.title}</h3>
                          <p className="text-gray-600 mb-4">{test.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div><strong>Subject:</strong> {test.subject}</div>
                            <div><strong>Type:</strong> {test.type}</div>
                            <div><strong>Date:</strong> {new Date(test.test_date).toLocaleDateString()}</div>
                            <div><strong>Marks:</strong> {test.marks}</div>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-gray-700"><strong>Syllabus:</strong> {test.syllabus}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'todos' && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">To-dos</h2>
                    <div className="space-y-4">
                      {dashboardData.todos.map((todo) => (
                        <div key={todo.id} className="bg-white rounded-lg shadow p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{todo.title}</h3>
                          <p className="text-gray-600 mb-4">{todo.description}</p>
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                              todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {todo.priority} priority
                            </span>
                            <span className="text-sm text-gray-500">Due: {new Date(todo.due_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'notes' && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Notes</h2>
                    <div className="space-y-4">
                      {dashboardData.notes.map((note) => (
                        <div key={note.id} className="bg-white rounded-lg shadow p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{note.title}</h3>
                          <p className="text-gray-600 mb-4">{note.content.substring(0, 200)}...</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Subject: {note.subject}</span>
                            <span className="text-sm text-gray-500">{new Date(note.created_at).toLocaleDateString()}</span>
                          </div>
                          {note.tags && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-1">
                                {note.tags.split(',').map((tag: string, index: number) => (
                                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    #{tag.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
