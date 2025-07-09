# Min Lara React Frontend

The frontend application for the Min Lara React project, built with React, TypeScript, and Vite. This modern single-page application (SPA) provides a responsive interface for user and organization management.

## 🚀 Features

- Modern React with TypeScript
- Redux for state management
- Vite for lightning-fast development
- Responsive layouts
- Organization management interface
- User management dashboard
- Protected routes with authentication
- Type-safe development with TypeScript

## 🛠️ Tech Stack

- React 18+
- TypeScript 5.8+
- Redux Toolkit for state management
- React Router v6
- Axios for API communication
- ESLint with TypeScript support
- Path aliases with `@/*`

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components (.tsx)
├── store/             # Redux store, actions, and reducers
│   ├── auth.ts        # Authentication state management
│   ├── notification.ts # Notification state management
│   └── index.ts       # Root reducer and store configuration
├── utils/             # Helper functions (.ts)
└── views/             # Page components (.tsx)
```

## 🔧 Development Setup

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
   Server will start at `http://localhost:3000`

4. Type checking:
   ```bash
   npm run type-check
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## 🔐 Security Features

- Axios scoped to trusted baseURL via environment variables
- CSRF protection with Laravel Sanctum handshake
- Cookies auto-managed with `withCredentials`
- Relative request paths to avoid SSRF risks
- Protected routes with authentication guards
- Type-safe API requests and responses

## 📦 Dependencies

Key dependencies include:
- `react` and `react-dom` - Core React library
- `@reduxjs/toolkit` - Modern Redux with simplified state management
- `react-redux` - React bindings for Redux
- `react-router-dom` - Routing
- `axios` - HTTP client
- `typescript` - TypeScript language support
- `@types/*` - TypeScript type definitions

## 🔍 Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production (includes type checking)
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint with TypeScript support
- `npm run type-check` - Run TypeScript compiler checks

## 🔧 TypeScript Configuration

Key TypeScript features enabled:
- Strict type checking
- Path aliases (`@/*` for `src/*`)
- React JSX support
- Modern ES2020 features
- Unused code checks
- Module resolution with bundler support