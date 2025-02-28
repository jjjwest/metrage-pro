export const formatDate = (date) => {
    if (!date) {
      return '';
    }
  
    try {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
  
      return `${day}.${month}.${year}`;
    } catch (error) {
      console.error("Invalid date format:", date);
      return '';
    }
  };
  
  export const formatDateTime = (date) => {
    if (!date) return '';
  
    try {
      const d = new Date(date);
      const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      return `${formatDate(date)} ${time}`;
    } catch (error) {
      console.error("Invalid datetime format:", date);
      return '';
    }
  };