// Script to check existing students in database
// Run with: node check-students.js

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkExistingStudents() {
  console.log('Checking existing students in database...\n')
  
  try {
    const { data: students, error } = await supabase
      .from('users')
      .select('register_number, name, email, role, created_at')
      .eq('role', 'student')
      .order('register_number')
    
    if (error) {
      console.log('❌ Error fetching students:', error.message)
      return
    }
    
    if (students.length === 0) {
      console.log('📝 No students found in database.')
      console.log('💡 Use the add-students.js script or admin dashboard to add students.')
    } else {
      console.log(`📊 Found ${students.length} student(s):\n`)
      students.forEach((student, index) => {
        console.log(`${index + 1}. Registration: ${student.register_number}`)
        console.log(`   Name: ${student.name}`)
        console.log(`   Email: ${student.email}`)
        console.log(`   Added: ${new Date(student.created_at).toLocaleDateString()}`)
        console.log('')
      })
    }
    
    // Also check admin users
    const { data: admins, error: adminError } = await supabase
      .from('users')
      .select('register_number, name, email, role')
      .eq('role', 'admin')
    
    if (!adminError && admins.length > 0) {
      console.log('👨‍💼 Admin users:')
      admins.forEach(admin => {
        console.log(`- ${admin.name} (${admin.register_number})`)
      })
    }
    
  } catch (err) {
    console.log('❌ Error:', err.message)
  }
}

// Run the script
checkExistingStudents()
