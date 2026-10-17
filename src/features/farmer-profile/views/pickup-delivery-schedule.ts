export function getRequestDays(now: Date) {
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + index
    );
    const value = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
    const weekday =
      index === 0
        ? 'Today'
        : day.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      value,
      label: `${weekday} ${day.getMonth() + 1}/${day.getDate()}`,
      slots: Array.from({ length: 5 }, (_, offset) => {
        const hour = 12 + offset;
        const start = new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate(),
          hour
        );
        return {
          value: String(hour),
          label: `${hour === 12 ? 12 : hour - 12}-${hour + 1 - 12} p.m.`,
          start,
        };
      }).filter((slot) => slot.start > now),
    };
  });
}
