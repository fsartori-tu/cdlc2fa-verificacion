
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateVerificationCode } from '@/utils/validation';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw, ArrowLeft } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);
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
      setError('El código debe tener 6 dígitos');
      return;
    }
    
    setError(null);
    
    // Mock verification - in a real app, this would call an API
    if (code === '123456') {
      toast({
        title: 'Verificación exitosa',
        description: 'Su número ha sido verificado correctamente',
      });
      onVerificationComplete();
    } else {
      setError('El código ingresado no es válido. Intente nuevamente.');
    }
  };

  const handleResend = () => {
    setTimeRemaining(120);
    setCanResend(false);
    setError(null);
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
    <div className="space-y-8 max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Verificación de código</h2>
        <p className="text-gray-600">
          Hemos enviado un código de verificación al número {phoneNumber}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="code" className="text-base font-medium block text-center">
            Código de verificación
          </label>
          <Input 
            id="code"
            type="text" 
            inputMode="numeric"
            placeholder="Ingrese el código de 6 dígitos"
            value={code}
            onChange={(e) => {
              setError(null);
              setCode(e.target.value.replace(/\D/g, '').substring(0, 6));
            }}
            maxLength={6}
            className="text-center text-2xl tracking-widest py-6"
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button 
            onClick={handleVerify} 
            className="w-full py-6 text-lg"
            disabled={code.length !== 6}
          >
            Verificar
          </Button>

          <div className="flex items-center justify-between mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-base flex items-center gap-2 hover:bg-transparent hover:text-primary"
            >
              <ArrowLeft size={18} />
              Volver
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleResend}
              disabled={!canResend}
              className="text-base flex items-center gap-2"
            >
              <RefreshCw size={18} className={!canResend ? "animate-spin" : ""} />
              {canResend ? 'Reenviar código' : `Reenviar en ${formatTime(timeRemaining)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeVerification;
