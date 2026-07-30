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

function formatLocalTime(dt, timezoneOffset) {
  const localDate = new Date((dt + timezoneOffset) * 1000);
  const hours = String(localDate.getUTCHours()).padStart(2, "0");
  const minutes = String(localDate.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function HourlyForecast({ data }) {
  if (!data) return null;

  const timezoneOffset = data.city.timezone;

  return (
    <div className="hourly-forecast">
      {data.list.slice(0, 12).map(item => (
        <div key={item.dt} className="hour-card">
          <p className="hourly-time"><strong>{formatLocalTime(item.dt, timezoneOffset)}</strong></p>
          <div className="hourly-icon-group">
            <img
              src={weatherIcons[item.weather[0].main] || clearIcon}
              className="hour-icon"
              alt={item.weather[0].main}
            />
            <p className="city-weather">{item.weather[0].main}</p>
          </div>

          <p className="hourly-temp"><strong>{Math.round(item.main.temp)}°C</strong></p>
        </div>
      ))}
    </div>
  );
}

export default HourlyForecast;
