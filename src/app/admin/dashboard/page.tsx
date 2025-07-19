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
  Bookmark,
  Plus,
  Edit,
  Trash2,
  Settings,
  Save,
  X
} from 'lucide-react'

import { 
  DatabaseSeminar, 
  DatabaseHomework, 
  DatabaseAssignment, 
  DatabaseTest, 
  DatabaseTodo, 
  DatabaseNote
} from '@/lib/supabase'

interface UserSummary {
  id: string
  register_number: string
  name: string
  email: string
  role: string
  created_at: string
}

interface DashboardData {
  seminars: DatabaseSeminar[]
  homework: DatabaseHomework[]
  assignments: DatabaseAssignment[]
  tests: DatabaseTest[]
  todos: DatabaseTodo[]
  notes: DatabaseNote[]
  users: UserSummary[]
}

interface FormData {
  [key: string]: any
}

export default function AdminDashboard() {
  const { user, logout, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    seminars: [],
    homework: [],
    assignments: [],
    tests: [],
    todos: [],
    notes: [],
    users: []
  })
  const [activeSection, setActiveSection] = useState('overview')
  const [dataLoading, setDataLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'add' | 'edit'>('add')
  const [editingItem, setEditingItem] = useState<any>(null)
  const [currentEntityType, setCurrentEntityType] = useState<string>('')
  const [formData, setFormData] = useState<FormData>({})

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/')
    } else if (user && user.role !== 'admin') {
      router.push('/dashboard')
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
      const [seminarsRes, homeworkRes, assignmentsRes, testsRes, todosRes, notesRes, usersRes] = await Promise.all([
        supabase.from('seminars').select('*').order('created_at', { ascending: false }),
        supabase.from('homework').select('*').order('created_at', { ascending: false }),
        supabase.from('assignments').select('*').order('created_at', { ascending: false }),
        supabase.from('tests').select('*').order('created_at', { ascending: false }),
        supabase.from('todos').select('*').order('created_at', { ascending: false }),
        supabase.from('notes').select('*').order('created_at', { ascending: false }),
        supabase.from('users').select('id, register_number, name, email, role, created_at').order('created_at', { ascending: false })
      ])

      setDashboardData({
        seminars: seminarsRes.data || [],
        homework: homeworkRes.data || [],
        assignments: assignmentsRes.data || [],
        tests: testsRes.data || [],
        todos: todosRes.data || [],
        notes: notesRes.data || [],
        users: usersRes.data || []
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setDataLoading(false)
    }
  }

  // CRUD Functions
  const openAddModal = (entityType: string) => {
    setCurrentEntityType(entityType)
    setModalType('add')
    setEditingItem(null)
    setFormData({})
    setIsModalOpen(true)
  }

  const openEditModal = (entityType: string, item: any) => {
    setCurrentEntityType(entityType)
    setModalType('edit')
    setEditingItem(item)
    setFormData({ ...item })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setFormData({})
    setCurrentEntityType('')
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      if (modalType === 'add') {
        const { error } = await supabase.from(currentEntityType).insert([formData])
        if (error) throw error
      } else {
        const { error } = await supabase.from(currentEntityType).update(formData).eq('id', editingItem.id)
        if (error) throw error
      }
      await fetchDashboardData()
      closeModal()
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  const handleDelete = async (entityType: string, id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const { error } = await supabase.from(entityType).delete().eq('id', id)
        if (error) throw error
        await fetchDashboardData()
      } catch (error) {
        console.error('Error deleting:', error)
      }
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
    { id: 'users', label: 'Users', icon: Users },
    { id: 'seminars', label: 'Seminars', icon: Users },
    { id: 'homework', label: 'Homework', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'tests', label: 'Tests', icon: PenTool },
    { id: 'todos', label: 'To-dos', icon: CheckSquare },
    { id: 'notes', label: 'Notes', icon: Bookmark },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-emerald-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-600">Welcome, </span>
                <span className="font-medium text-gray-900">{user.name}</span>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  Admin
                </span>
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
                            ? 'bg-emerald-100 text-emerald-700'
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {activeSection === 'overview' && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Admin Overview</h2>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                          <Users className="h-8 w-8 text-cyan-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{dashboardData.users.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                          <Users className="h-8 w-8 text-emerald-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Seminars</p>
                            <p className="text-2xl font-bold text-gray-900">{dashboardData.seminars.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                          <FileText className="h-8 w-8 text-teal-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Assignments</p>
                            <p className="text-2xl font-bold text-gray-900">{dashboardData.assignments.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                          <PenTool className="h-8 w-8 text-cyan-500" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tests</p>
                            <p className="text-2xl font-bold text-gray-900">{dashboardData.tests.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
                          <div className="space-y-3">
                            {dashboardData.users.slice(0, 5).map((user) => (
                              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                <div>
                                  <p className="font-medium text-gray-900">{user.name}</p>
                                  <p className="text-sm text-gray-600">{user.register_number}</p>
                                </div>
                                <div className="text-right">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    user.role === 'admin' ? 'bg-emerald-100 text-emerald-800' : 'bg-cyan-100 text-cyan-800'
                                  }`}>
                                    {user.role}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Content</h3>
                          <div className="space-y-3">
                            {[
                              ...dashboardData.seminars.slice(0, 2).map(item => ({ ...item, type: 'Seminar' })),
                              ...dashboardData.assignments.slice(0, 2).map(item => ({ ...item, type: 'Assignment' })),
                              ...dashboardData.tests.slice(0, 1).map(item => ({ ...item, type: 'Test' }))
                            ].slice(0, 5).map((item, index) => (
                              <div key={`${item.type}-${item.id}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                <div>
                                  <p className="font-medium text-gray-900">{item.title}</p>
                                  <p className="text-sm text-gray-600">{item.type}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'users' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-3xl font-bold text-gray-900">Users Management</h2>
                      <button 
                        onClick={() => openAddModal('users')}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {dashboardData.users.map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {user.register_number}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.role === 'admin' ? 'bg-emerald-100 text-emerald-800' : 'bg-cyan-100 text-cyan-800'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(user.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button 
                                  onClick={() => openEditModal('users', user)}
                                  className="text-emerald-600 hover:text-emerald-900 mr-3"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleDelete('users', user.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeSection === 'seminars' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-3xl font-bold text-gray-900">Seminars Management</h2>
                      <button 
                        onClick={() => openAddModal('seminars')}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Seminar
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {dashboardData.seminars.map((seminar) => (
                        <div key={seminar.id} className="bg-white rounded-lg shadow p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{seminar.title}</h3>
                              <p className="text-gray-600 mb-4">{seminar.description}</p>
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
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
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                                  <span><strong>Venue:</strong> {seminar.venue}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button 
                                onClick={() => openEditModal('seminars', seminar)}
                                className="text-emerald-600 hover:text-emerald-900"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button 
                                onClick={() => handleDelete('seminars', seminar.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Similar sections for other management areas would go here */}
                {activeSection === 'assignments' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-3xl font-bold text-gray-900">Assignments Management</h2>
                      <button 
                        onClick={() => openAddModal('assignments')}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Assignment
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {dashboardData.assignments.map((assignment) => (
                        <div key={assignment.id} className="bg-white rounded-lg shadow p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                              <p className="text-gray-600 mb-4">{assignment.description}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div><strong>Subject:</strong> {assignment.subject}</div>
                                <div><strong>Due Date:</strong> {new Date(assignment.due_date).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button 
                                onClick={() => openEditModal('assignments', assignment)}
                                className="text-emerald-600 hover:text-emerald-900"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button 
                                onClick={() => handleDelete('assignments', assignment.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'homework' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-3xl font-bold text-gray-900">Homework Management</h2>
                      <button 
                        onClick={() => openAddModal('homework')}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Homework
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {dashboardData.homework.map((hw) => (
                        <div key={hw.id} className="bg-white rounded-lg shadow p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{hw.title}</h3>
                              <p className="text-gray-600 mb-4">{hw.description}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div><strong>Subject:</strong> {hw.subject}</div>
                                <div><strong>Due Date:</strong> {new Date(hw.due_date).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button 
                                onClick={() => openEditModal('homework', hw)}
                                className="text-emerald-600 hover:text-emerald-900"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button 
                                onClick={() => handleDelete('homework', hw.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'tests' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-3xl font-bold text-gray-900">Tests Management</h2>
                      <button 
                        onClick={() => openAddModal('tests')}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Test
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {dashboardData.tests.map((test) => (
                        <div key={test.id} className="bg-white rounded-lg shadow p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{test.title}</h3>
                              <p className="text-gray-600 mb-4">{test.description}</p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div><strong>Subject:</strong> {test.subject}</div>
                                <div><strong>Date:</strong> {new Date(test.date).toLocaleDateString()}</div>
                                <div><strong>Duration:</strong> {test.duration} minutes</div>
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button 
                                onClick={() => openEditModal('tests', test)}
                                className="text-emerald-600 hover:text-emerald-900"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button 
                                onClick={() => handleDelete('tests', test.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'todos' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-3xl font-bold text-gray-900">To-dos Management</h2>
                      <button 
                        onClick={() => openAddModal('todos')}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add To-do
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {dashboardData.todos.map((todo) => (
                        <div key={todo.id} className="bg-white rounded-lg shadow p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{todo.title}</h3>
                              <p className="text-gray-600 mb-4">{todo.description}</p>
                              <div className="flex items-center space-x-4 text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  todo.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {todo.completed ? 'Completed' : 'Pending'}
                                </span>
                                <div><strong>Priority:</strong> {todo.priority}</div>
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button 
                                onClick={() => openEditModal('todos', todo)}
                                className="text-emerald-600 hover:text-emerald-900"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button 
                                onClick={() => handleDelete('todos', todo.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'notes' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-3xl font-bold text-gray-900">Notes Management</h2>
                      <button 
                        onClick={() => openAddModal('notes')}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Note
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {dashboardData.notes.map((note) => (
                        <div key={note.id} className="bg-white rounded-lg shadow p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{note.title}</h3>
                              <p className="text-gray-600 mb-4">{note.content}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div><strong>Subject:</strong> {note.subject}</div>
                                <div><strong>Created:</strong> {new Date(note.created_at).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button 
                                onClick={() => openEditModal('notes', note)}
                                className="text-emerald-600 hover:text-emerald-900"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button 
                                onClick={() => handleDelete('notes', note.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'settings' && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">System Settings</h2>
                    
                    <div className="space-y-6">
                      <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Configuration</h3>
                        <p className="text-gray-600 mb-4">Manage your Supabase database settings and connection.</p>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Supabase URL</label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="https://your-project.supabase.co"
                              readOnly
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Admin Passkey</label>
                            <input 
                              type="password" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="Enter new admin passkey"
                            />
                          </div>
                          
                          <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors">
                            Update Settings
                          </button>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div><strong>Application Version:</strong> 1.0.0</div>
                          <div><strong>Database:</strong> Supabase PostgreSQL</div>
                          <div><strong>Framework:</strong> Next.js 15</div>
                          <div><strong>Authentication:</strong> Custom JWT</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {modalType === 'add' ? 'Add' : 'Edit'} {currentEntityType.slice(0, -1)}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {currentEntityType === 'users' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Register Number</label>
                      <input
                        type="text"
                        value={formData.register_number || ''}
                        onChange={(e) => handleInputChange('register_number', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select
                        value={formData.role || 'student'}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    {modalType === 'add' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                          type="password"
                          value={formData.password || ''}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    )}
                  </>
                )}

                {(currentEntityType === 'seminars' || currentEntityType === 'homework' || currentEntityType === 'assignments' || currentEntityType === 'tests' || currentEntityType === 'todos' || currentEntityType === 'notes') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {currentEntityType === 'notes' ? 'Content' : 'Description'}
                      </label>
                      <textarea
                        value={currentEntityType === 'notes' ? (formData.content || '') : (formData.description || '')}
                        onChange={(e) => handleInputChange(currentEntityType === 'notes' ? 'content' : 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {currentEntityType === 'seminars' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Speaker</label>
                          <input
                            type="text"
                            value={formData.speaker || ''}
                            onChange={(e) => handleInputChange('speaker', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="date"
                            value={formData.date || ''}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                          <input
                            type="time"
                            value={formData.time || ''}
                            onChange={(e) => handleInputChange('time', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                          <input
                            type="text"
                            value={formData.venue || ''}
                            onChange={(e) => handleInputChange('venue', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </>
                    )}

                    {(currentEntityType === 'homework' || currentEntityType === 'assignments' || currentEntityType === 'tests' || currentEntityType === 'notes') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input
                          type="text"
                          value={formData.subject || ''}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    )}

                    {(currentEntityType === 'homework' || currentEntityType === 'assignments') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input
                          type="date"
                          value={formData.due_date || ''}
                          onChange={(e) => handleInputChange('due_date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    )}

                    {currentEntityType === 'tests' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="date"
                            value={formData.date || ''}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                          <input
                            type="number"
                            value={formData.duration || ''}
                            onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </>
                    )}

                    {currentEntityType === 'todos' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                          <select
                            value={formData.priority || 'medium'}
                            onChange={(e) => handleInputChange('priority', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        <div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.completed || false}
                              onChange={(e) => handleInputChange('completed', e.target.checked)}
                              className="mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700">Completed</span>
                          </label>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {modalType === 'add' ? 'Add' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
