
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Hardcoded credentials
    if (username === 'admin' && password === 'Test.1234') {
      toast({
        title: 'Acceso exitoso',
        description: 'Bienvenido al sistema'
      });
      onLoginSuccess();
    } else {
      setError('Usuario o contraseña inválido, intente nuevamente');
    }
  };

  const handleForgotPassword = () => {
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Iniciar sesión</h2>
        <p className="text-gray-600 text-sm">
          Ingrese sus credenciales para acceder
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm">
            Usuario
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="Ingrese su usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value.slice(0, 30))}
            maxLength={30}
            className="text-base"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm">
            Contraseña
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value.slice(0, 30))}
            maxLength={30}
            className="text-base"
            required
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full mt-6">
          Iniciar sesión
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm text-primary hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recuperar contraseña</DialogTitle>
            <DialogDescription>
              Por favor, comunicate con el administrador para recuperar tu acceso.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginForm;
