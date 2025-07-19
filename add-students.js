// Script to add students to the database
// Run with: node add-students.js

const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')

// Load environment variables
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Your student data - MODIFY THIS ARRAY WITH YOUR STUDENTS
const studentsToAdd = [
  {
    register_number: 'CSEB34',
    name: 'Student CSEB34',
    email: 'cseb34@college.edu',
    password: 'password123'
  },
  {
    register_number: '21CSE001',
    name: 'Student One',
    email: 'student1@college.edu',
    password: 'password123'
  },
  {
    register_number: '21CSE002', 
    name: 'Student Two',
    email: 'student2@college.edu',
    password: 'password123'
  }
  // Add more students here as needed
]

async function addStudents() {
  console.log('Adding students to database...')
  
  for (const student of studentsToAdd) {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(student.password, 12)
      
      // Insert student into database
      const { data, error } = await supabase
        .from('users')
        .insert([{
          register_number: student.register_number,
          name: student.name,
          email: student.email,
          password: hashedPassword,
          role: 'student'
        }])
      
      if (error) {
        if (error.code === '23505') { // Duplicate key error
          console.log(`❌ Student ${student.register_number} already exists`)
        } else {
          console.log(`❌ Error adding ${student.register_number}:`, error.message)
        }
      } else {
        console.log(`✅ Added student: ${student.register_number} - ${student.name}`)
      }
    } catch (err) {
      console.log(`❌ Error adding ${student.register_number}:`, err.message)
    }
  }
  
  console.log('\n🎉 Finished adding students!')
  console.log('\nYou can now login with:')
  studentsToAdd.forEach(student => {
    console.log(`- Registration: ${student.register_number}, Password: ${student.password}`)
  })
}

// Run the script
addStudents()
