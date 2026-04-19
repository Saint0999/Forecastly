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

function DailyForecast({data, isTransitioning, onSearch}) {

  if(!data) return null;

  const dailyData = data.list.filter((item, index) => index % 8 === 0);
  return (
    <>
      <div className="daily-forecast">
        <p className="forecast-heading"><strong>5 DAY FORECAST</strong></p>
        {dailyData.map((day) => (
          <>
            <div className="forecast-card" key={day.dt}>
              <div className="date">
                <p>{new Date(day.dt * 1000).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </p>
              </div>

              <div className="weather-group-daily">
                <img className="daily-icons" src={weatherIcons[day.weather[0].main]} />
                <p className="city-weather">{day.weather[0].main}</p>
              </div>
              
              <div className="temp">
                <p><strong>{Math.round(day.main.temp_min)} °C - {Math.round(day.main.temp_max)} °C</strong></p>
              </div>
          
            </div>
          </>
        ))}
      </div>
    </>
  );
}

export default DailyForecast;