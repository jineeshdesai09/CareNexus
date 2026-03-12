/**
 * Standardizes date formatting to DD/MM/YYYY
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "--/--/----";
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return "--/--/----";

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Standardizes time formatting to HH:MM AM/PM
 */
export function formatTime(date: Date | string | null | undefined): string {
  if (!date) return "--:--";
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return "--:--";

  return d.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
}