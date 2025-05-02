
/**
 * Validates a Uruguayan ID (Cédula de Identidad)
 * Format: 8 digits
 */
export const validateUruguayanId = (id: string): boolean => {
  // Remove any spaces or dashes
  const cleanId = id.replace(/[\s-]/g, '');
  // Check if it's 8 digits
  return /^\d{8}$/.test(cleanId);
};

/**
 * Validates a Uruguayan mobile phone number
 * Format: 09X XXX XXX
 */
export const validateUruguayanPhone = (phone: string): boolean => {
  // Remove any spaces or dashes
  const cleanPhone = phone.replace(/[\s-]/g, '');
  // Check if it starts with 09 and has 9 digits total
  return /^09\d{7}$/.test(cleanPhone);
};

/**
 * Formats a phone number for display
 * Converts 09XXXXXXX to 09X XXX XXX
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/[\s-]/g, '');
  
  if (cleanPhone.length !== 9) return phone;
  
  // Format as 09X XXX XXX
  return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
};

/**
 * Masks a phone number for privacy
 * Example: 098 123 456 -> 098 *** 456
 */
export const maskPhoneNumber = (phone: string): string => {
  const parts = phone.split(' ');
  if (parts.length !== 3) return phone;
  
  return `${parts[0]} *** ${parts[2]}`;
};

/**
 * Validates a verification code
 * Must be 6 digits
 */
export const validateVerificationCode = (code: string): boolean => {
  return /^\d{6}$/.test(code);
};
