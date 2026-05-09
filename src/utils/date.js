export function formatDate(date) {
  return date.toISOString().slice(0, 10)
}

export function getToday() {
  return formatDate(new Date())
}

export function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return { firstDay, daysInMonth }
}
