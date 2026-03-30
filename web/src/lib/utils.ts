/** Formatea fecha relativa en español: "Hoy, 09:30" / "Ayer, 18:45" / "Lunes, 10:15" */
export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  const time = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

  if (diffDays === 0) return `Hoy, ${time}`;
  if (diffDays === 1) return `Ayer, ${time}`;

  const dayName = date.toLocaleDateString('es-AR', { weekday: 'long' });
  return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${time}`;
}

/** Capitaliza la primera letra */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
