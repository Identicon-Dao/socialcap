
export function prettyDate(utc: string): string {
  if (!utc) return "-";
  const ts = (new Date(utc)).getTime();
  const s = new Date(ts);
  const mo = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]
  return `${s.getDate()} ${mo[s.getMonth()]} ${s.getFullYear()}`;
}

export function prettyDateFull(date: string): string {
  if (!date) return "-";
  const ts = (new Date(date)).getTime();
  const s = new Date(ts);
  const mo = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]
  return `${s.getDate()} ${mo[s.getMonth()]} ${s.getFullYear()}, ${s.getHours()}:${s.getMinutes()}`;
}