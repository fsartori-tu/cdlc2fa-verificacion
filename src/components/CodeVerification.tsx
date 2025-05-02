
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateVerificationCode } from '@/utils/validation';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw } from 'lucide-react';

interface CodeVerificationProps {
  phoneNumber: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

const CodeVerification: React.FC<CodeVerificationProps> = ({ 
  phoneNumber, 
  onVerificationComplete,
  onBack
}) => {
  const [code, setCode] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeRemaining > 0 && !canResend) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setCanResend(true);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeRemaining, canResend]);

  const handleVerify = () => {
    if (!validateVerificationCode(code)) {
      toast({
        title: 'Error de validación',
        description: 'El código debe tener 6 dígitos',
        variant: 'destructive',
      });
      return;
    }
    
    // Mock verification - in a real app, this would call an API
    if (code === '123456') {
      toast({
        title: 'Verificación exitosa',
        description: 'Su número ha sido verificado correctamente',
      });
      onVerificationComplete();
    } else {
      toast({
        title: 'Código incorrecto',
        description: 'El código ingresado no es válido. Intente nuevamente.',
        variant: 'destructive',
      });
    }
  };

  const handleResend = () => {
    setTimeRemaining(120);
    setCanResend(false);
    toast({
      title: 'Código reenviado',
      description: 'Se ha enviado un nuevo código de verificación a su número',
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Verificación de código</h2>
        <p className="text-gray-600 text-sm">
          Hemos enviado un código de verificación al número {phoneNumber}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="code" className="text-sm font-medium">
            Código de verificación
          </label>
          <Input 
            id="code"
            type="text" 
            inputMode="numeric"
            placeholder="Ingrese el código de 6 dígitos"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button 
            onClick={handleVerify} 
            className="w-full"
          >
            Verificar
          </Button>

          <div className="flex items-center justify-between">
            <button 
              type="button" 
              onClick={onBack}
              className="text-sm text-primary hover:underline"
            >
              Volver
            </button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleResend}
              disabled={!canResend}
              className="text-xs flex items-center gap-1"
            >
              <RefreshCw size={14} className={!canResend ? "animate-spin" : ""} />
              {canResend ? 'Reenviar código' : `Reenviar en ${formatTime(timeRemaining)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeVerification;
