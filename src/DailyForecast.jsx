import cloudIcon from "./assets/cloud.png";
import rainIcon from "./assets/rain.png";
import clearIcon from "./assets/clear.png";
import snowIcon from "./assets/snow.png";

const weatherIcons = {
  Clouds: cloudIcon,
  Rain: rainIcon,
  Drizzle: rainIcon,
  Clear: clearIcon,
  Snow: snowIcon,
  Mist: cloudIcon,
  Haze: cloudIcon,
};

function localDateKey(dt, timezoneOffset) {
  return new Date((dt + timezoneOffset) * 1000).toISOString().split("T")[0];
}

function groupByDay(list, timezoneOffset) {
  const days = new Map();

  for (const item of list) {
    const key = localDateKey(item.dt, timezoneOffset);
    if (!days.has(key)) days.set(key, []);
    days.get(key).push(item);
  }

  return Array.from(days.values()).map(items => {
    const tempMin = Math.min(...items.map(item => item.main.temp_min));
    const tempMax = Math.max(...items.map(item => item.main.temp_max));

    // Use the entry closest to local noon to represent the day's icon/condition.
    const midday = items.reduce((best, item) => {
      const hourOf = (entry) => new Date((entry.dt + timezoneOffset) * 1000).getUTCHours();
      return Math.abs(hourOf(item) - 12) < Math.abs(hourOf(best) - 12) ? item : best;
    });

    return { dt: midday.dt, weather: midday.weather[0], tempMin, tempMax };
  });
}

function DailyForecast({ data }) {
  if (!data) return null;

  const timezoneOffset = data.city.timezone;
  const dailyData = groupByDay(data.list, timezoneOffset).slice(0, 5);

  return (
    <div className="daily-forecast">
      {dailyData.map((day) => (
        <div className="forecast-card" key={day.dt}>
          <div className="date">
            <p>{new Date((day.dt + timezoneOffset) * 1000).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC",
            })}</p>
          </div>
          <div className="weather-group-daily">
            <img className="daily-icons" src={weatherIcons[day.weather.main] || clearIcon} alt={day.weather.main} />
            <p className="city-weather">{day.weather.main}</p>
          </div>
          <div className="temp">
            <p><strong>{Math.round(day.tempMin)} °C - {Math.round(day.tempMax)} °C</strong></p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DailyForecast;
