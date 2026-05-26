import  { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext.jsx'; // Global State Module
import Login from './views/Login';
import Dashboard from './views/Dashboard'; // Real Dashboard Component

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    // 1. Wrap the entire Router tree inside our centralized Chat Context Layer
    <ChatProvider>
      <Router>
        <Routes>
          
          {/* Unauthenticated Gateway Route */}
          <Route 
            path="/" 
            element={<Login setIsAuthenticated={setIsAuthenticated} />} 
          />

          {/* Protected Workspace Routing Node 
            Changed URL path from '/views/Dashboard' to '/dashboard' 
            to cleanly match your login navigation script and clean-URL standards.
          */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" replace />} 
          />

          {/* Fallback Catch-all: Automatically redirects unmapped paths back home */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </Router>
    </ChatProvider>
  );
}