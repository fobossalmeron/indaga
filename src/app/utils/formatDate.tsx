export const formatDate = (date: string, fullDate: boolean = false): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/Monterrey",
    weekday: "long",
    day: "numeric",
    month: "2-digit",
    year: "numeric",
  };

  const [year, month, day] = date.split("-").map(Number);
  const transformedDate = new Date(year, month - 1, day);

  const formatter = new Intl.DateTimeFormat("es-ES", options);
  const formattedDate = formatter.format(transformedDate);

  const [weekday, dayMonth] = formattedDate.split(", ");
  const [formattedDay, formattedMonth] = dayMonth.split("/");

  return fullDate
    ? `${formattedDay}.${formattedMonth}.${year}`
    : `${weekday} ${formattedDay}.${formattedMonth}`;
};
