
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

export function showUTCDatetime(isoString: string) {
  // let d1= "2024-03-02T23:59:00.000Z"
  const d0 = Date.parse(isoString);
  const d = new Date(d0)
  const mo = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]
  return `${d.getUTCDate()} ${mo[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${d.getUTCHours()}:${d.getUTCMinutes()}`;
}
