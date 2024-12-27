export function parseToWeeklyData(allDays) {
  // Ordenamos por fecha para evitar desorden
  const sorted = [...allDays].sort((a, b) => new Date(a.date) - new Date(b.date));

  let currentWeekIndex = 0;
  let previousWeekday = null;

  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    const day = sorted[i];

    // Cuando 'weekday' salta de 6 a 0, avanzamos de semana
    if (previousWeekday !== null && day.weekday < previousWeekday) {
      currentWeekIndex++;
    }
    previousWeekday = day.weekday;

    result.push({
      date: day.date,
      contributions: day.contributionCount,
      dayOfWeek: day.weekday,
      week: currentWeekIndex,
    });
  }

  return result;
}