export const sanitizeCardNumber = (num: string): string => {
  return num.replace(/\s+/g, '');
};

export const isValidCardNumber = (num: string): boolean => {
  const sanitized = sanitizeCardNumber(num);

  if (!/^\d{13,19}$/.test(sanitized)) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized[i], 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

export const isValidExpiry = (expiry: string): boolean => {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10) + 2000; 

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const expiryDate = new Date(year, month); 

  return expiryDate > now;
};

export const isValidCvv = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};

export const validateCardForm = ({
  cardNumber,
  expiry,
  cvc,
}: {
  cardNumber: string;
  expiry: string;
  cvc: string;
}) => {
  if (!isValidCardNumber(cardNumber)) {
    return { valid: false, message: 'เลขบัตรไม่ถูกต้อง' };
  }

  if (!isValidExpiry(expiry)) {
    return { valid: false, message: 'วันหมดอายุไม่ถูกต้อง' };
  }

  if (!isValidCvv(cvc)) {
    return { valid: false, message: 'CVV ไม่ถูกต้อง' };
  }

  return { valid: true, message: '' };
};
