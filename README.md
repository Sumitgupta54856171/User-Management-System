# User Management System

A comprehensive web-based user management system with role-based access control, built with React.js frontend and Node.js/Express backend.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [User Roles & Permissions](#user-roles--permissions)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Functionality
- **User Authentication**: Secure login/logout with JWT tokens
- **Role-Based Access Control**: Admin, Manager, and User roles with different permissions
- **User Management**: Create, read, update, and delete users
- **Profile Management**: Users can update their own profile information
- **Activity Logging**: Track system activities and user actions
- **Responsive Design**: Mobile-friendly interface with adaptive layouts

### Advanced Features
- **Real-time Notifications**: Success/error messages with auto-dismiss
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Data Validation**: Client and server-side validation
- **Email Notifications**: Welcome emails for new users
- **Security**: Password hashing, JWT authentication, role-based permissions

## Technology Stack

### Frontend
- **React.js** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **React Hook Form** - Form handling
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email service

## Architecture

```
User Management System Architecture
==================================

Frontend (React.js)
    |
    | HTTP Requests (REST API)
    |
Backend (Node.js/Express)
    |
    | Authentication & Authorization
    |
Database (MongoDB)
```

### System Flow Diagram

```
+-------------------+     +-------------------+     +-------------------+
|                   |     |                   |     |                   |
|   Frontend        |     |   Backend         |     |   Database        |
|   (React.js)      |<--->|   (Express.js)    |<--->|   (MongoDB)       |
|                   |     |                   |     |                   |
+-------------------+     +-------------------+     +-------------------+
        |                       |                       |
        |                       |                       |
        v                       v                       v
+-------------------+     +-------------------+     +-------------------+
|                   |     |                   |     |                   |
| User Interface    |     | API Endpoints     |     | User Data         |
| - Dashboard       |     | - Authentication  |     | - Users           |
| - User Management |     | - CRUD Operations |     | - Roles           |
| - Profile         |     | - Profile Update  |     | - Activities      |
| - Activity Log    |     | - Activity Logging|     |                   |
+-------------------+     +-------------------+     +-------------------+
```

### Component Architecture

```
App.jsx
    |
    |--- Navbar.jsx (Desktop Navigation)
    |--- MobileNavigation.jsx (Mobile Navigation)
    |
    |--- Routes
        |
        |--- /users -> UserDashboard.jsx
        |       |
        |       |--- AddUserForm.jsx
        |       |--- UpdateUserForm.jsx
        |       |--- ReusableTable.jsx
        |
        |--- /profile -> Profile.jsx
        |
        |--- /activity -> ActivityLog.jsx
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Clone the repository
```bash
git clone <repository-url>
cd managment_system
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Configure environment variables (see below)

5. Start the backend server
```bash
npm start
```

### Frontend Setup

1. Install frontend dependencies
```bash
cd frontend
npm install
```

2. Start the frontend development server
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Environment Variables

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/user_management

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server
PORT=3001
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001
```

## API Documentation

### Authentication Endpoints

#### POST /login
Login user and return JWT token
```javascript
Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "User"
  }
}
```

### User Management Endpoints

#### GET /users
Get all users (Admin/Manager only)
```javascript
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "User",
      "status": "active"
    }
  ]
}
```

#### POST /users/add
Create new user (Admin only)
```javascript
Headers: Authorization: Bearer <token>

Request Body:
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "User",
  "status": "active"
}
```

#### PUT /users/:id
Update user (Admin/Manager only)
```javascript
Headers: Authorization: Bearer <token>

Request Body:
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "Manager"
}
```

#### DELETE /users/:id
Delete user (Admin/Manager only)
```javascript
Headers: Authorization: Bearer <token>
```

### Profile Endpoints

#### PUT /users/profile
Update own profile (All authenticated users)
```javascript
Headers: Authorization: Bearer <token>

Request Body:
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

## User Roles & Permissions

### Admin
- Full access to all features
- Create, read, update, delete any user
- Assign any role (Admin, Manager, User)
- View activity logs
- Update own profile

### Manager
- Create, read, update, delete regular users
- Cannot modify or delete Admin users
- Cannot assign Admin role
- View activity logs
- Update own profile

### User
- View and update own profile only
- Cannot access user management features
- Cannot view activity logs

## Project Structure

```
managment_system/
|
|--- backend/
|    |
|    |--- config/
|    |    |--- mongodb.js
|    |
|    |--- controller/
|    |    |--- AdminController.js
|    |    |--- LoginController.js
|    |    |--- UserController.js
|    |
|    |--- middleware/
|    |    |--- authMiddleware.js
|    |    |--- rolecheckMiddleware.js
|    |
|    |--- model/
|    |    |--- usermodel.js
|    |
|    |--- router/
|    |    |--- router.js
|    |
|    |--- utils/
|    |    |--- email.js
|    |
|    |--- .env
|    |--- server.js
|    |--- package.json
|
|--- frontend/
|    |
|    |--- public/
|    |--- src/
|    |    |
|    |    |--- components/
|    |    |    |--- AdminDashboard/
|    |    |    |    |--- UserDashboard.jsx
|    |    |    |    |--- Listpage.jsx
|    |    |    |    |
|    |    |    |--- ActivityLog/
|    |    |    |    |--- ActivityLog.jsx
|    |    |    |    |
|    |    |    |--- Navbar/
|    |    |    |    |--- Navbar.jsx
|    |    |    |    |
|    |    |    |--- common/
|    |    |    |    |--- MobileNavigation.jsx
|    |    |    |    |--- Notification.jsx
|    |    |    |    |
|    |    |    |--- forms/
|    |    |    |    |--- AddUserForm.jsx
|    |    |    |    |--- UpdateUserForm.jsx
|    |    |    |    |
|    |    |    |--- login/
|    |    |    |    |--- Loginpage.jsx
|    |    |    |    |
|    |    |    |--- Profile.jsx
|    |    |    |
|    |    |--- hooks/
|    |    |    |--- useNotification.js
|    |    |    |
|    |    |--- store/
|    |    |    |--- api.js
|    |    |    |--- authSlice.js
|    |    |    |
|    |    |--- styles/
|    |    |    |--- mobile.css
|    |    |    |
|    |    |--- App.jsx
|    |    |--- index.css
|    |    |--- main.jsx
|    |
|    |--- package.json
|
|--- README.md
```

## Key Features Implementation

### 1. Responsive Design
- Mobile-first approach with Tailwind CSS
- Hamburger menu for mobile navigation
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements

### 2. Role-Based Access Control
- JWT-based authentication
- Middleware for role checking
- Permission-based UI rendering
- Secure API endpoints

### 3. User Experience
- Real-time notifications
- Loading states and spinners
- Form validation with error messages
- Smooth transitions and animations

### 4. Data Management
- Redux Toolkit for state management
- RTK Query for API calls
- Optimistic updates
- Caching and synchronization

## Security Features

- **Authentication**: JWT tokens with expiration
- **Authorization**: Role-based access control
- **Password Security**: bcrypt hashing
- **Input Validation**: Client and server-side validation
- **CORS**: Cross-origin resource sharing configuration
- **Environment Variables**: Secure configuration management

## Development Workflow

1. **Backend Development**: API endpoints, business logic, database models
2. **Frontend Development**: React components, state management, UI/UX
3. **Integration**: API integration, error handling, testing
4. **Deployment**: Production configuration, environment setup

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the development team or create an issue in the repository.

---

**Note**: This is a comprehensive user management system designed for educational and demonstration purposes. Always ensure proper security measures in production environments.
