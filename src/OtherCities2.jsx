import React, { useState, useEffect } from "react";
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

const API_KEY = "b165829b6d626fcd82a77fceb66003ee";

const CITIES = ["Tokyo"]; 

function OtherCities({data}) {
  const [citiesData, setCitiesData] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      const results = await Promise.all(
        CITIES.map(city =>
          fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`)
            .then(res => res.json())
        )
      );
      setCitiesData(results);
    };

    fetchCities();
  }, [data]);

  return (
    <>
      {citiesData.map((data, index) => {
        const weatherType = data?.list[0].weather[0].main;
        const timezoneOffset = data?.city.timezone;
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const cityTime = new Date(utc + timezoneOffset * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div key={index} className="other-cities">
            <div className="current-weather">
              <div className="left-section">
                <h1 className="city-temp">{Math.round(data.list[0].main.temp)} °C</h1>
                <div className="weather-desc">
                  <img className="weather-icon" src={weatherIcons[weatherType] || clearIcon} />
                  <p className="city-weather">{data.list[0].weather[0].main}</p>
                </div>
                <p className="city-feel">Feels like: {Math.round(data.list[0].main.feels_like)} °C</p>
              </div>

              <div className="right-section">
                <div className="city-block">
                  <h2 className="city-name">{data.city.name}</h2>
                  <p className="city-time">{cityTime}</p>
                </div>
                <div className="lower-right">
                  <div className="wind-desc">
                    <img className="wind-icon" src="/src/assets/wind.png" />
                    <p className="city-wind"><strong>{Math.round(data.list[0].wind.speed)} m/s</strong></p>
                  </div>
                  <p className="city-temp-range">{Math.round(data.list[0].main.temp_min)} °C to {Math.round(data.list[0].main.temp_max)} °C</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default OtherCities;