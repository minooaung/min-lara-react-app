# Min Lara React Frontend

The frontend application for the Min Lara React project, built with React and Vite. This modern single-page application (SPA) provides a responsive interface for user and organization management.

## Features

- Modern React with Hooks
- Redux for state management
- Vite for lightning-fast development
- Responsive layouts
- Organization management interface
- User management dashboard
- Protected routes with authentication

## Tech Stack

- React 18+
- Vite
- Redux for global state management
- React Router v6
- Axios for API communication

## Project Structure

```
src/
├── components/         # Reusable UI components
├── store/             # Redux store, actions, and reducers
│   ├── auth.js        # Authentication state management
│   ├── notification.js # Notification state management
│   └── index.js       # Root reducer and store configuration
├── utils/             # Helper functions
└── views/             # Page components
```

## Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` file in the frontend root:

   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Security Features

- Axios scoped to trusted baseURL via environment variables
- CSRF protection with Laravel Sanctum handshake
- Cookies auto-managed with `withCredentials`
- Relative request paths to avoid SSRF risks
- Protected routes with authentication

## Dependencies

Key dependencies include:

- `react` and `react-dom` - Core React library
- `@reduxjs/toolkit` - Modern Redux with simplified state management
- `react-redux` - React bindings for Redux
- `react-router-dom` - Routing
- `axios` - HTTP client
- `@vitejs/plugin-react` - Vite React plugin

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
