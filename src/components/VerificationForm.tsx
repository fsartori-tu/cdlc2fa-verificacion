
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { IdCard, Phone } from 'lucide-react';
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
  const { toast } = useToast();

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const value = e.target.value.replace(/\D/g, '');
    setIdNumber(value.substring(0, 8));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and format as 09X XXX XXX
    let value = e.target.value.replace(/\D/g, '');
    
    // Always ensure the phone starts with 09
    if (!value.startsWith('09') && value.length > 0) {
      value = '09' + value.substring(value.startsWith('0') ? 1 : 0);
    }
    
    value = value.substring(0, 9);
    setPhoneNumber(formatPhoneNumber(value));
  };

  const mockRetrievePhoneByID = (id: string): string => {
    // In a real application, this would call an API to retrieve the phone number
    return '098 765 432'; // Mocked phone number
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
      setRetrievedPhone(phone);
      
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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Verificación de identidad</h2>
        <p className="text-gray-600 text-sm">
          Seleccione un método de verificación para continuar
        </p>
      </div>

      <RadioGroup 
        value={method} 
        onValueChange={(value) => setMethod(value as VerificationMethod)}
        className="flex flex-col space-y-4"
      >
        <div className={`flex items-start space-x-3 rounded-md border border-gray-200 p-4 ${method === VerificationMethod.ID ? 'bg-primary/5 border-primary/30' : ''}`}>
          <RadioGroupItem value={VerificationMethod.ID} id="id-option" className="mt-1" />
          <div className="flex-1">
            <div className="flex items-center">
              <Label htmlFor="id-option" className="font-medium flex items-center gap-1">
                <IdCard size={18} className="text-primary" />
                <span>🆔 Ingresar cédula de identidad</span>
              </Label>
            </div>
            {method === VerificationMethod.ID && (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id-input" className="text-sm">
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
                  <div className="space-y-2">
                    <Label className="text-sm">
                      Número de celular asociado
                    </Label>
                    <Input
                      type="text"
                      value={mockRetrievePhoneByID(idNumber)}
                      readOnly
                      disabled
                      className="bg-gray-50 text-base"
                    />
                    <p className="text-xs text-gray-500">
                      Este número está asociado con su cédula de identidad
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={`flex items-start space-x-3 rounded-md border border-gray-200 p-4 ${method === VerificationMethod.PHONE ? 'bg-primary/5 border-primary/30' : ''}`}>
          <RadioGroupItem value={VerificationMethod.PHONE} id="phone-option" className="mt-1" />
          <div className="flex-1">
            <div className="flex items-center">
              <Label htmlFor="phone-option" className="font-medium flex items-center gap-1">
                <Phone size={18} className="text-primary" />
                <span>📱 Ingresar celular</span>
              </Label>
            </div>
            {method === VerificationMethod.PHONE && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="phone-input" className="text-sm">
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
        className="w-full mt-6"
        disabled={(method === VerificationMethod.ID && !validateUruguayanId(idNumber)) || 
                (method === VerificationMethod.PHONE && !validateUruguayanPhone(phoneNumber))}
      >
        Enviar código de verificación
      </Button>
    </div>
  );
};

export default VerificationForm;
