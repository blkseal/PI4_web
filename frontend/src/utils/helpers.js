// Example utility function
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

// Example validation utility
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
