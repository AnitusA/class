# Class Management System

A comprehensive web application for managing class activities, assignments, seminars, and more. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

### 🎓 Student Features
- **Secure Login**: Authentication using registration number and password
- **Dashboard Overview**: View all upcoming assignments, seminars, and important dates
- **Seminars**: Browse and register for upcoming seminars and events
- **Assignments**: Track assignment due dates and requirements
- **Homework**: Access homework assignments and related materials
- **Tests**: View test schedules and syllabi
- **Notes**: Access study notes and materials
- **To-dos**: Personal task management

### 👨‍💼 Admin Features
- **Admin Dashboard**: Comprehensive overview of system statistics
- **User Management**: Add, edit, and manage student accounts
- **Content Management**: Create and manage seminars, assignments, tests, and homework
- **System Settings**: Configure application settings and database connections
- **Analytics**: View system usage and user engagement metrics

### 🔒 Security Features
- **Dual Authentication**: Separate login systems for students and admins
- **JWT Token-based Authentication**: Secure session management
- **Role-based Access Control**: Different permissions for students and admins
- **Password Hashing**: Bcrypt encryption for secure password storage
- **Protected Routes**: Middleware-based route protection

### 📱 Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Perfect layout for tablet viewing
- **Desktop Responsive**: Full-featured desktop experience
- **Modern UI**: Clean, intuitive interface using Tailwind CSS

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom JWT implementation
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **Supabase account** (for database)

## Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone <your-repository-url>
cd class-management-system
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Set Up Supabase Database

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Run Database Setup**:
   - Open the Supabase SQL Editor
   - Copy and paste the contents of \`database/setup.sql\`
   - Execute the script to create all tables and sample data

### 4. Configure Environment Variables

Create a \`.env.local\` file in the root directory and add:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin passkey for admin login
ADMIN_PASSKEY=admin123

# JWT Secret for token signing
JWT_SECRET=your_jwt_secret_key_here
\`\`\`

**Important**: Replace the placeholder values with your actual Supabase credentials and choose a strong JWT secret.

### 5. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Default Login Credentials

After running the database setup script, you can use these default credentials:

### Admin Login
- **Passkey**: \`admin123\`

### Student Login
- **Registration Number**: \`STU001\`, \`STU002\`, or \`STU003\`
- **Password**: \`admin123\` (for demo purposes)

## Project Structure

\`\`\`
class-management-system/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   └── auth/          # Authentication endpoints
│   │   ├── dashboard/         # Student dashboard
│   │   ├── admin/             # Admin dashboard
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home/login page
│   ├── components/            # Reusable components
│   │   └── auth/              # Authentication components
│   ├── contexts/              # React contexts
│   │   └── AuthContext.tsx    # Authentication context
│   └── lib/                   # Utility functions
│       ├── auth.ts            # Authentication utilities
│       └── supabase.ts        # Supabase client
├── database/
│   └── setup.sql              # Database setup script
├── middleware.ts              # Route protection middleware
└── package.json
\`\`\`

## API Routes

- \`POST /api/auth/student\` - Student authentication
- \`POST /api/auth/admin\` - Admin authentication
- \`POST /api/auth/logout\` - Logout
- \`GET /api/auth/me\` - Get current user info

## Database Schema

The application uses the following main tables:
- **users** - Student and admin accounts
- **seminars** - Seminar information and scheduling
- **assignments** - Assignment details and due dates
- **homework** - Homework assignments
- **tests** - Test schedules and information
- **todos** - Task management
- **notes** - Study notes and materials
- **syllabus** - Course syllabi

## Customization

### Adding New Features
1. Create new database tables in Supabase
2. Update the TypeScript interfaces in \`src/lib/supabase.ts\`
3. Add new API routes in \`src/app/api/\`
4. Create new components and pages as needed

### Styling
- Modify Tailwind classes in components
- Add custom CSS in \`src/app/globals.css\`
- Configure Tailwind in \`tailwind.config.js\`

### Authentication
- Modify auth logic in \`src/lib/auth.ts\`
- Update middleware rules in \`middleware.ts\`
- Customize login forms in \`src/components/auth/\`

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Security Considerations

- **Environment Variables**: Never commit \`.env\` files to version control
- **JWT Secret**: Use a strong, random JWT secret in production
- **Admin Passkey**: Change the default admin passkey before deployment
- **HTTPS**: Always use HTTPS in production
- **CORS**: Configure CORS properly for your domain

## Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/class-management-system/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend-as-a-service platform
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icons
