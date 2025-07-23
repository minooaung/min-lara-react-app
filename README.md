# Min Lara React App

A full-stack web application built with Laravel backend API and React frontend that provides user authentication, organization management, user management capabilities, an interactive dashboard, and a comprehensive reporting system.

## Architecture

```
min-lara-react-app/
├── backend/           # Laravel REST API
│   └── README.md     # Detailed API documentation
└── frontend/         # React SPA
    └── README.md     # Frontend documentation
```

## Features

### Core Features
- User Authentication (Login/Signup)
- Organization Management
- User Management
- Role-based Access Control (Admin/Employee)
- Interactive Dashboard with Real-time Metrics
- Modern React Frontend with TanStack Query and Redux
- RESTful Laravel API Backend
- MySQL Database

### Dashboard Features
- Real-time Statistics and Metrics
- Interactive Charts and Visualizations
  - Organization Growth Chart
  - User Role Distribution Chart
- Quick Action Shortcuts
- Key Performance Indicators (KPIs)
  - Total Users Count
  - Total Organizations Count
  - Recent Activity Metrics
  - User Role Distribution Stats

### Organization Management
- CRUD Operations for Organizations
- User-Organization Relationships
- Track User Assignments
- Search and Filter Capabilities
- Pagination Support

### User Management
- CRUD Operations for Users
- Role-based Access (Admin/Employee)
- Admin User Limit Controls
- Search Users by ID, Name, or Email
- Pagination Support

### Reporting System
- Multiple Output Formats:
  - PDF - For professional document presentation
  - Excel - For data analysis
  - CSV - For raw data export
  - JSON - For data interchange
  - HTML - For web viewing
- Customizable Field Rendering
- Interactive Report Generation Interface
- Real-time HTML Preview
- Direct File Downloads

## Technical Stack

### Frontend
- React 18+
- Vite for Build Tooling
- TanStack Query v5 for Server State
- Redux for UI State
- Tailwind CSS for Styling
- Chart.js for Data Visualization
- React Router v6
- Axios for API Communication

### Backend
- Laravel 10.x
- MySQL/MariaDB
- Laravel Sanctum for Authentication
- PHP 8.x

## Prerequisites

Before you begin, ensure you have the following installed:

- PHP >= 8.0
- Composer
- Node.js >= 16
- MySQL/MariaDB
- Git

## Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/minooaung/min-lara-react-app.git
   cd min-lara-react-app
   ```

2. **Start Backend**

   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   # Configure your database in .env file
   php artisan migrate
   php artisan db:seed
   php artisan serve
   ```

   Backend will be available at `http://localhost:8000`

3. **Start Frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Configure VITE_API_BASE_URL in .env
   npm run dev
   ```
   Frontend will be available at `http://localhost:3000`

## Documentation

- [Backend API Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)

## Security Features

- Role-based Access Control
- CSRF Protection
- Secure Session Management
- Input Validation and Sanitization
- Protected Routes with Authentication
- Secure Password Hashing
- Database Transaction Safety
- Input Sanitization Middleware
