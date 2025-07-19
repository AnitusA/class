# Copilot Instructions for Class Management System

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a class management system with dual authentication:
- **Student Login**: Registration number + password
- **Admin Login**: Passkey only

## Key Features
- Responsive design for mobile and desktop
- Student dashboard with access to seminars, homework, assignments, syllabus, todos, and tests
- Admin dashboard for managing all content
- Database integration with PostgreSQL/MySQL
- Modern UI with Tailwind CSS and Framer Motion

## Technology Stack
- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API routes
- **Database**: Prisma ORM
- **Authentication**: JWT tokens with bcryptjs

## Database Schema
The application integrates with existing database tables:
- users (admin authentication)
- students (student data and authentication)
- seminars, homework, assignments, syllabus, todos, tests (content management)

## Code Guidelines
- Use TypeScript for type safety
- Follow Next.js 14 App Router conventions
- Implement responsive design patterns
- Use server components when possible
- Apply proper authentication middleware
- Maintain clean component architecture
