export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = ((hours + 11) % 12 + 1); // Convertir a formato de 12 horas
  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};