export const formatDate = (date: string): string => {
    const transformedDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric' };
    const formattedDate: string = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(transformedDate);
    const day: number = transformedDate.getDate();
    const month: string = String(transformedDate.getMonth() + 1).padStart(2, '0'); // Mes en formato 2 dígitos
    return `${formattedDate} ${day}.${month}`;
  };