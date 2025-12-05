# Frontend - PI4 Web Application

This is a VITE + React frontend application configured to work with an Express Node.js backend.

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, and other assets
│   ├── components/     # Reusable React components
│   │   └── Button.jsx  # Example button component
│   ├── pages/          # Page components
│   │   └── Home.jsx    # Example home page
│   ├── services/       # API and external service integrations
│   │   └── api.js      # Axios configuration for backend communication
│   ├── utils/          # Helper functions and utilities
│   │   └── helpers.js  # Example utility functions
│   ├── App.jsx         # Main App component
│   ├── App.css         # App styles
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Backend Communication

The application is configured to proxy API requests to a backend server:
- Frontend runs on: `http://localhost:3000`
- Backend expected on: `http://localhost:5000`
- API requests to `/api/*` are automatically proxied to the backend

### Using the API Service

```javascript
import api from './services/api';

// GET request
const response = await api.get('/endpoint');

// POST request
const response = await api.post('/endpoint', { data: 'value' });
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser at `http://localhost:3000`

## Technologies

- **React** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API requests
- **ESLint** - Code linting
