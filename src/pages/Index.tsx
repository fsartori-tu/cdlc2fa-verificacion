import React, { useState } from 'react';
import Logo from '@/components/Logo';
import VerificationForm from '@/components/VerificationForm';
import LoginForm from '@/components/LoginForm';
import TopBar from '@/components/TopBar';
const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  return <div className="min-h-screen bg-white flex flex-col">
      {/* Header with logo */}
      <header className="w-full py-6 px-4 flex justify-center border-b">
        <Logo />
      </header>
      
      {/* Top bar - only show when logged in */}
      {isLoggedIn && <TopBar username="admin" onLogout={handleLogout} />}
      
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-lg p-8 shadow-sm bg-stone-50">
          {isLoggedIn ? <VerificationForm /> : <LoginForm onLoginSuccess={handleLoginSuccess} />}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-4 px-6 text-center text-sm text-gray-500">
        <p>© 2025 Crédito de la Casa. Todos los derechos reservados.</p>
      </footer>
    </div>;
};
export default Index;