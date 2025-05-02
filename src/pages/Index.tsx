
import React from 'react';
import Logo from '@/components/Logo';
import VerificationForm from '@/components/VerificationForm';

const Index = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with logo */}
      <header className="w-full py-6 px-8 flex justify-center border-b">
        <Logo />
      </header>
      
      {/* Main content - centered with more space for desktop */}
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="w-full max-w-2xl bg-white rounded-lg p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Verificación de identidad</h1>
          <p className="text-center text-gray-600 mb-8">
            Para continuar con Crédito de la Casa, necesitamos verificar su identidad.
          </p>
          <VerificationForm />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-6 px-8 text-center text-gray-500">
        <p>© 2025 Crédito de la Casa. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Index;
