export const maskCardNumber = (cardNumber: string): string => {
  if (!cardNumber || cardNumber.length < 4) return cardNumber;
  
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length !== 16) {
    const lastFourNonStandard = cleaned.slice(-4) || cardNumber.slice(-4);
    return `**** **** **** ${lastFourNonStandard}`;
  }
  
  const lastFour = cleaned.slice(-4);
  return `**** **** **** ${lastFour}`;
};
