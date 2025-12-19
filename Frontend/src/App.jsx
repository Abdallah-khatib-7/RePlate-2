import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';   
import Navbar from './components/Navbar';                  
import Footer from './components/Footer';                
import AppRouter from './router/AppRouter';      
import MainDashboard from './pages/MainDashboard';
import  './styles/globals.css';
import { LogoWithText } from './components/logo';
import { useEffect } from 'react';
       

function App() {
  
  useEffect(() => {
    // Preload logo
    const img = new Image();
    img.src = LogoWithText;
  }, []);
  
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            
            <AppRouter />
          
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;