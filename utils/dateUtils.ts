export const getCurrentDateFormatted = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`; // Changed to YYYY-MM-DD
};