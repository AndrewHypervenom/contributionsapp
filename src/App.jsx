import React, { useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import ContributionsForm from './components/ContributionsForm';

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

async function fetchContributions(login, token) {
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
  return weeks.flatMap((week) => week.contributionDays);
}

function parseToWeeklyData(allDays) {
  const sorted = [...allDays].sort((a, b) => new Date(a.date) - new Date(b.date));
  let currentWeekIndex = 0;
  let previousWeekday = null;

  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    const day = sorted[i];
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

// Datos simulados por defecto
const generateDefaultData = () => {
  const days = [];
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  
  let currentWeek = 0;
  let prevWeekday = null;
  
  for (let i = 0; i < 365; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const weekday = currentDate.getDay();
    
    // Cambiar de semana cuando el día vuelve a 0 (domingo)
    if (prevWeekday !== null && weekday < prevWeekday) {
      currentWeek++;
    }
    prevWeekday = weekday;
    
    // Generar contribuciones aleatorias con más probabilidad de valores bajos
    const rand = Math.random();
    let contributions;
    if (rand < 0.5) {
      contributions = Math.floor(Math.random() * 3);
    } else if (rand < 0.8) {
      contributions = Math.floor(Math.random() * 7) + 3;
    } else {
      contributions = Math.floor(Math.random() * 15) + 10;
    }
    
    days.push({
      date: currentDate.toISOString().split('T')[0],
      contributions,
      dayOfWeek: weekday,
      week: currentWeek
    });
  }
  return days;
};

function DayCube({ dayData, colorScale, heightScale }) {
  const { contributions } = dayData;
  const height = heightScale(contributions);
  const color = colorScale(contributions);

  return (
    <mesh position={[0, height / 2, 0]}>
      <boxGeometry args={[0.9, height, 0.9]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Contributions3D({ data }) {
  const weeks = useMemo(() => {
    const grouped = {};
    data.forEach((d) => {
      if (!grouped[d.week]) grouped[d.week] = [];
      grouped[d.week].push(d);
    });
    return Object.keys(grouped).map((wk) => grouped[wk]);
  }, [data]);

  const maxContributionsValue = useMemo(() => {
    return max(data, (d) => d.contributions) || 1;
  }, [data]);

  const colorScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, maxContributionsValue])
        .range(["#9be9a8", "#216e39"]),
    [maxContributionsValue]
  );
  
  const heightScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, maxContributionsValue])
        .range([0.1, 3]),
    [maxContributionsValue]
  );

  const offsetX = 0.95;
  const offsetZ = 0.95;

  return (
    <>
      {weeks.map((weekArr) =>
        weekArr.map((dayData) => {
          const { dayOfWeek, week, date } = dayData;
          const xPos = week * offsetX;
          const zPos = dayOfWeek * offsetZ;
          return (
            <group key={date} position={[xPos, 0, zPos]}>
              <DayCube
                dayData={dayData}
                colorScale={colorScale}
                heightScale={heightScale}
              />
            </group>
          );
        })
      )}
    </>
  );
}

export default function App() {
  const [login, setLogin] = useState("");
  const [token, setToken] = useState("");
  const [data, setData] = useState(generateDefaultData);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFetch = async () => {
    try {
      if (!login.trim() || !token.trim()) {
        alert("Por favor ingresa un usuario y un token.");
        return;
      }
      const allDays = await fetchContributions(login.trim(), token.trim());
      const weeklyData = parseToWeeklyData(allDays);
      setData(weeklyData);
    } catch (err) {
      console.error(err);
      alert("Error al obtener contribuciones: " + err.message);
    }
  };

  const totalWeeks = useMemo(() => {
    if (data.length === 0) return 0;
    return data[data.length - 1].week + 1;
  }, [data]);

  const totalDays = 7;
  const offsetX = 1;
  const offsetZ = 1;
  const centerX = (totalWeeks - 1) * offsetX * 0.4;
  const centerZ = (totalDays - 1) * offsetZ * 0.5;

  const stats = useMemo(() => {
    if (data.length === 0) return null;
    
    const totalContributions = data.reduce((sum, day) => sum + day.contributions, 0);
    const busiestDay = data.reduce((max, day) => day.contributions > (max?.contributions || 0) ? day : max, null);
    const startDate = new Date(data[0].date);
    const endDate = new Date(data[data.length - 1].date);
    
    let maxStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;
    
    data.forEach(day => {
      if (day.contributions > 0) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });

    // Calcular racha actual
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].contributions > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      totalContributions,
      dateRange: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      busiestDay: busiestDay ? {
        count: busiestDay.contributions,
        date: new Date(busiestDay.date).toLocaleDateString()
      } : null,
      longestStreak: maxStreak,
      currentStreak
    };
  }, [data]);

  return (
    <div className="w-screen h-screen relative">
      <div className="absolute top-4 left-4 z-50">
        <ContributionsForm 
          onSubmit={async (login, token) => {
            try {
              const allDays = await fetchContributions(login, token);
              const weeklyData = parseToWeeklyData(allDays);
              setData(weeklyData);
            } catch (err) {
              console.error(err);
              alert("Error al obtener contribuciones: " + err.message);
            }
          }} 
        />
      </div>

      {stats && (
        <>
          <div className="absolute top-[10%] right-[5%] text-right z-50">
            <div className="text-4xl font-bold text-green-700 mb-2">
              {stats.totalContributions} contribuciones
            </div>
            <div className="text-xl text-gray-600 mb-6">
              {stats.dateRange}
            </div>
            <div>
              <div className="text-2xl font-medium text-gray-800 mb-2">
                Día más activo
              </div>
              <div className="text-3xl font-bold text-green-700 mb-1">
                {stats.busiestDay?.count || 0} contribuciones
              </div>
              <div className="text-xl text-gray-600">
                {stats.busiestDay?.date || "N/A"}
              </div>
            </div>
          </div>

          <div className="absolute bottom-[10%] left-[5%] z-50">
            <div className="mb-6">
              <div className="text-2xl font-medium text-gray-800 mb-2">
                Racha más larga
              </div>
              <div className="text-3xl font-bold text-green-700">
                {stats.longestStreak} días
              </div>
            </div>
            <div>
              <div className="text-2xl font-medium text-gray-800 mb-2">
                Racha actual
              </div>
              <div className="text-3xl font-bold text-green-700">
                {stats.currentStreak} días
              </div>
            </div>
          </div>
        </>
      )}

      <Canvas camera={{ position: [15, 40, 42], fov: 45 }} className="bg-white">
        <OrbitControls />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 15, 10]} intensity={0.8} />
        <group position={[-centerX, 15, -centerZ]} rotation={[0, -Math.PI * 0.15, 0]}>
          {data.length > 0 && <Contributions3D data={data} />}
        </group>
      </Canvas>
    </div>
  );
}