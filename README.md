# Min Lara React App

A full-stack web application built with Laravel backend API and React frontend that provides user authentication, organization management, and user management capabilities.

## Architecture

```
min-lara-react-app/
├── backend/           # Laravel REST API
│   └── README.md     # Detailed API documentation
└── frontend/         # React SPA
    └── README.md     # Frontend documentation
```

## Features

- User Authentication (Login/Signup)
- Organization Management
- User Management
- Role-based Access Control (Admin/Employee)
- Modern React Frontend with Redux
- RESTful Laravel API Backend
- MySQL Database

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
