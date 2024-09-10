export const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric' };
    const formattedDate: string = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date);
    const day: number = date.getDate();
    const month: string = String(date.getMonth() + 1).padStart(2, '0'); // Mes en formato 2 dígitos
    return `${formattedDate} ${day}.${month}`;
  };