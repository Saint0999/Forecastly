import React, {useState, useEffect} from "react";
import cloudIcon from "./assets/cloud.png";
import rainIcon from "./assets/rain.png";
import clearIcon from "./assets/clear.png";
import snowIcon from "./assets/snow.png";
import sunIcon from "./assets/sun.png"
import moonIcon from "./assets/moon.png"

const weatherIcons = {
  Clouds: cloudIcon,
  Rain: rainIcon,
  Drizzle: rainIcon,
  Clear: clearIcon,
  Snow: snowIcon,
  Mist: cloudIcon,
  Haze: cloudIcon,
};

function HourlyForecast({ data, isTransitioning, onSearch }) {
  if (!data) return null;

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const todayData = data.list.filter(item =>
    item.dt_txt.includes(today) || item.dt_txt.includes(tomorrowStr)
  );

  const now = new Date();

  const upcoming = todayData.filter(item =>
    new Date(item.dt_txt) > now
  );

  return (
    <div className="hourly-forecast">
      {upcoming.slice(0, 12).map(item => (
        <div key={item.dt} className="hour-card">
          <p className="hourly-time"><strong>{item.dt_txt.slice(11, 16)}</strong></p>
          <div className="hourly-icon-group">
            <img
              src={weatherIcons[item.weather[0].main]}
              className="hour-icon"
            />
            <p className="city-weather">{data.list[0].weather[0].main}</p>
          </div>
          
          <p className="hourly-temp"><strong>{Math.round(item.main.temp)}°C</strong></p>
        </div>
      ))}
    </div>
  );
}

export default HourlyForecast;