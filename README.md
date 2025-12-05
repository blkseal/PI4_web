# PI4_web
Projeto Integrado 4 - Web

## Project Overview

This project consists of a VITE + React frontend application configured to work with an Express Node.js backend.

## Project Structure

```
PI4_web/
├── frontend/            # React + Vite frontend application
│   ├── src/
│   │   ├── assets/     # Images, fonts, and other assets
│   │   ├── components/ # Reusable React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API and external service integrations
│   │   └── utils/      # Helper functions and utilities
│   └── ...
└── README.md           # This file
```

## Frontend Setup

The frontend is a modern React application built with Vite.

### Features
- ⚡️ Fast development with Vite
- ⚛️ React 19 with latest features
- 🎨 Clean, minimal CSS setup
- 📁 Organized folder structure
- 🔌 Axios configured for backend communication
- 🔄 Proxy configuration for API requests
- 📦 Production-ready build setup

### Getting Started

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

For more details, see [frontend/README.md](frontend/README.md)

## Backend Integration

The frontend is configured to communicate with an Express backend:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000` (expected)
- API proxy: `/api/*` requests are forwarded to the backend

## Technologies

### Frontend
- React 19
- Vite 7
- Axios
- ESLint

### Backend (to be implemented)
- Express.js (Node.js)
- Expected on port 5000

