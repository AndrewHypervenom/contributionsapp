function getLastYearRange() {
  const end = new Date();
  const start = new Date();
  start.setFullYear(end.getFullYear() - 1);
  return {
    startStr: start.toISOString(),
    endStr: end.toISOString(),
  };
}

function buildQuery(login, from, to) {
  return `
    query {
      user(login: "${login}") {
        contributionsCollection(from: "${from}", to: "${to}") {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                weekday
              }
            }
          }
        }
      }
    }
  `;
}

export async function fetchContributions(login, token) {
  const { startStr, endStr } = getLastYearRange();
  const queryBody = buildQuery(login, startStr, endStr);

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: queryBody }),
  });

  const data = await response.json();
  if (!data.data || !data.data.user) {
    throw new Error("No se pudieron obtener datos de contribuciones.");
  }

  const { weeks } = data.data.user.contributionsCollection.contributionCalendar;
  // Aplanamos las contribuciones de todas las semanas
  const allDays = weeks.flatMap((week) => week.contributionDays);
  // allDays => [{ date, contributionCount, weekday }, ...]

  return allDays;
}