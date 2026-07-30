import { useState, useEffect } from "react";
import cloudIcon from "./assets/cloud.png";
import rainIcon from "./assets/rain.png";
import clearIcon from "./assets/clear.png";
import snowIcon from "./assets/snow.png";
import { API_KEY } from "./config.js";

const weatherIcons = {
  Clouds: cloudIcon,
  Rain: rainIcon,
  Drizzle: rainIcon,
  Clear: clearIcon,
  Snow: snowIcon,
  Mist: cloudIcon,
  Haze: cloudIcon,
};

function OtherCities({ city }) {
  const [cityData, setCityData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCity() {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );
        const result = await response.json();
        if (!cancelled && result.cod === "200") {
          setCityData(result);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchCity();
    return () => { cancelled = true; };
  }, [city]);

  if (!cityData) return null;

  const weatherType = cityData.list[0].weather[0].main;
  const timezoneOffset = cityData.city.timezone;
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const cityTime = new Date(utc + timezoneOffset * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="current-weather">
      <div className="left-section">
        <h1 className="city-temp">{Math.round(cityData.list[0].main.temp)} °C</h1>
        <div className="weather-desc">
          <img className="weather-icon" src={weatherIcons[weatherType] || clearIcon} alt={weatherType} />
          <p className="city-weather">{weatherType}</p>
        </div>
        <p className="city-feel">Feels like: {Math.round(cityData.list[0].main.feels_like)} °C</p>
      </div>

      <div className="right-section">
        <div className="city-block">
          <h2 className="city-name">{cityData.city.name}</h2>
          <p className="city-time">{cityTime}</p>
        </div>
        <div className="lower-right">
          <div className="wind-desc">
            <img className="wind-icon" src="/wind.png" alt="wind" />
            <p className="city-wind"><strong>{Math.round(cityData.list[0].wind.speed)} m/s</strong></p>
          </div>
          <p className="city-temp-range">{Math.round(cityData.list[0].main.temp_min)} °C to {Math.round(cityData.list[0].main.temp_max)} °C</p>
        </div>
      </div>
    </div>
  );
}

export default OtherCities;
