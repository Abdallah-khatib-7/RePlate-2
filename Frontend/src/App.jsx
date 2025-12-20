import React, { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRouter from './router/AppRouter';
import './styles/globals.css';

function Layout() {
  const location = useLocation();

  // Routes where navbar should be hidden
  const hideNavbarRoutes = ['/claim-food'];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!hideNavbar && <Navbar />}
      
      <main className="flex-grow">
        <AppRouter />
      </main>

      {!hideNavbar && <Footer />}
    </div>
  );
}

function App() {
  useEffect(() => {
    const img = new Image();
    img.src = '/logo.png'; // optional preload
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}

export default App;
