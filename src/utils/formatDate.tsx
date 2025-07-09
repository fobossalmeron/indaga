export const formatDate = (
  date: string | null | undefined,
  fullDate: boolean = false,
): string => {
  // Validar entrada
  if (!date || typeof date !== "string" || date.trim() === "") {
    return fullDate ? "Fecha no disponible" : "Fecha no disponible";
  }

  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "America/Monterrey",
      weekday: "long",
      day: "numeric",
      month: "2-digit",
      year: "numeric",
    };

    // Intentar parsear la fecha
    let transformedDate: Date;

    // Si viene en formato YYYY-MM-DD (formato esperado)
    if (date.includes("-") && date.split("-").length === 3) {
      const [year, month, day] = date.split("-").map(Number);

      // Validar que los valores sean números válidos
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error("Invalid date components");
      }

      transformedDate = new Date(year, month - 1, day);
    } else {
      // Intentar parsear directamente
      transformedDate = new Date(date);
    }

    // Validar que la fecha sea válida
    if (isNaN(transformedDate.getTime())) {
      throw new Error("Invalid date");
    }

    const formatter = new Intl.DateTimeFormat("es-ES", options);
    const formattedDate = formatter.format(transformedDate);

    const [weekday, dayMonth] = formattedDate.split(", ");
    const [formattedDay, formattedMonth] = dayMonth.split("/");

    return fullDate
      ? `${formattedDay}.${formattedMonth}.${transformedDate.getFullYear()}`
      : `${weekday} ${formattedDay}.${formattedMonth}`;
  } catch (error) {
    // En caso de cualquier error, retornar un valor por defecto
    console.warn(`Error formatting date: ${date}`, error);
    return fullDate ? "Fecha no disponible" : "Fecha no disponible";
  }
};
