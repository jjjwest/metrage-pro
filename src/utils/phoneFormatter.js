export const formatPhone = (phone) => {
    if (!phone) {
      return '';
    }
  
    const numbers = phone.replace(/\D/g, '');
    const match = numbers.match(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
  
    if (!match) {
      return '';
    }
  
    return [
      '+',
      match[1] ? (match[1] === '7' || match[1] === '8' ? '7' : match[1]) : '',
      ' (', match[2], ') ',
      match[3], '-', match[4], '-', match[5]
    ].filter(Boolean).join('').trim();
  };
  
  export const normalizePhone = (phone) => {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
  };
  
  export const validatePhone = (phone) => {
    const normalized = normalizePhone(phone);
    return /^[78]\d{10}$/.test(normalized);
  };