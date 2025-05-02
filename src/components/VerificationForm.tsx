
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  validateUruguayanId, 
  validateUruguayanPhone, 
  formatPhoneNumber,
  maskPhoneNumber 
} from '@/utils/validation';
import CodeVerification from './CodeVerification';

enum VerificationMethod {
  ID = 'id',
  PHONE = 'phone'
}

const VerificationForm: React.FC = () => {
  const [method, setMethod] = useState<VerificationMethod>(VerificationMethod.ID);
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [retrievedPhone, setRetrievedPhone] = useState('');
  const [showCodeVerification, setShowCodeVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear any previous errors
    setError(null);
    // Only allow digits
    const value = e.target.value.replace(/\D/g, '');
    setIdNumber(value.substring(0, 8));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear any previous errors
    setError(null);
    // Only allow digits and format as 09X XXX XXX
    let value = e.target.value.replace(/\D/g, '');
    
    // Always ensure the phone starts with 09
    if (!value.startsWith('09') && value.length > 0) {
      value = '09' + value.substring(value.startsWith('0') ? 1 : 0);
    }
    
    value = value.substring(0, 9);
    setPhoneNumber(formatPhoneNumber(value));
  };

  const mockRetrievePhoneByID = (id: string): string | null => {
    // In a real application, this would call an API to retrieve the phone number
    // Mock some IDs that don't have numbers
    if (id === '12345678') {
      return null;
    }
    return '098 765 432'; // Mocked phone number for other IDs
  };

  const handleSendCode = () => {
    if (method === VerificationMethod.ID) {
      if (!validateUruguayanId(idNumber)) {
        toast({
          title: 'Error de validación',
          description: 'La cédula de identidad debe tener 8 dígitos.',
          variant: 'destructive',
        });
        return;
      }
      
      // In a real app, this would make an API call to get the phone number
      const phone = mockRetrievePhoneByID(idNumber);
      
      if (!phone) {
        setError('No encontramos un número de teléfono asociado a esta cédula. Por favor, verifique el número o utilice la opción de ingresar celular.');
        return;
      }
      
      setRetrievedPhone(phone);
      setError(null);
      
      toast({
        title: 'Código enviado',
        description: `Se ha enviado un código de verificación al número ${maskPhoneNumber(phone)}`,
      });
      
      setShowCodeVerification(true);
    } else {
      if (!validateUruguayanPhone(phoneNumber)) {
        toast({
          title: 'Error de validación',
          description: 'El número de celular debe tener el formato 09X XXX XXX.',
          variant: 'destructive',
        });
        return;
      }
      
      setRetrievedPhone(phoneNumber);
      setError(null);
      
      toast({
        title: 'Código enviado',
        description: `Se ha enviado un código de verificación al número ${maskPhoneNumber(phoneNumber)}`,
      });
      
      setShowCodeVerification(true);
    }
  };

  const handleVerificationComplete = () => {
    toast({
      title: 'Verificación completada',
      description: 'Su número ha sido verificado correctamente.',
    });
    // In a real app, this would redirect to the next step
  };

  if (showCodeVerification) {
    return (
      <CodeVerification 
        phoneNumber={maskPhoneNumber(retrievedPhone)}
        onVerificationComplete={handleVerificationComplete}
        onBack={() => setShowCodeVerification(false)}
      />
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <RadioGroup 
        value={method} 
        onValueChange={(value) => {
          setMethod(value as VerificationMethod);
          setError(null);
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className={`flex items-start space-x-4 rounded-md border border-gray-200 p-6 ${method === VerificationMethod.ID ? 'bg-primary/5 border-primary/30' : ''}`}>
          <RadioGroupItem value={VerificationMethod.ID} id="id-option" className="mt-1" />
          <div className="flex-1">
            <div className="flex items-center">
              <Label htmlFor="id-option" className="font-medium flex items-center gap-2 text-lg">
                <FileText size={24} className="text-primary" />
                <span>Ingresar cédula de identidad</span>
              </Label>
            </div>
            {method === VerificationMethod.ID && (
              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="id-input" className="text-base">
                    Cédula de identidad
                  </Label>
                  <Input 
                    id="id-input"
                    type="text" 
                    inputMode="numeric"
                    placeholder="Ingrese los 8 dígitos de su cédula"
                    value={idNumber}
                    onChange={handleIdChange}
                    className="text-base"
                  />
                </div>

                {idNumber && validateUruguayanId(idNumber) && (
                  <div className="space-y-2 animate-fade-in">
                    <Label className="text-base">
                      Número de celular asociado
                    </Label>
                    <Input
                      type="text"
                      value={mockRetrievePhoneByID(idNumber) || 'No encontrado'}
                      readOnly
                      disabled
                      className={`bg-gray-50 text-base ${!mockRetrievePhoneByID(idNumber) ? 'text-red-500' : ''}`}
                    />
                    <p className="text-sm text-gray-500">
                      Este número está asociado con su cédula de identidad
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={`flex items-start space-x-4 rounded-md border border-gray-200 p-6 ${method === VerificationMethod.PHONE ? 'bg-primary/5 border-primary/30' : ''}`}>
          <RadioGroupItem value={VerificationMethod.PHONE} id="phone-option" className="mt-1" />
          <div className="flex-1">
            <div className="flex items-center">
              <Label htmlFor="phone-option" className="font-medium flex items-center gap-2 text-lg">
                <Phone size={24} className="text-primary" />
                <span>Ingresar celular</span>
              </Label>
            </div>
            {method === VerificationMethod.PHONE && (
              <div className="mt-6 space-y-2">
                <Label htmlFor="phone-input" className="text-base">
                  Número de celular
                </Label>
                <Input 
                  id="phone-input"
                  type="tel" 
                  placeholder="09X XXX XXX"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="text-base"
                />
              </div>
            )}
          </div>
        </div>
      </RadioGroup>

      <Button 
        onClick={handleSendCode}
        className="w-full mt-8 py-6 text-lg"
        disabled={(method === VerificationMethod.ID && !validateUruguayanId(idNumber)) || 
                (method === VerificationMethod.PHONE && !validateUruguayanPhone(phoneNumber))}
      >
        Enviar código de verificación
      </Button>
    </div>
  );
};

export default VerificationForm;
