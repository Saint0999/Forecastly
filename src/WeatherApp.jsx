import React, { useState, useEffect } from "react";
import DailyForecast from "./DailyForecast";
import HourlyForecast from "./HourlyForecast";
import OtherCities1 from "./OtherCities1";
import OtherCities2 from "./OtherCities2";
import OtherCities3 from "./OtherCities3";
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


function WeatherApp({data, selectedCity, setSelectedCity, isTransitioning, onSearch}) {
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityTime, setCityTime] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);

  const handleThemeToggle = () => {
    setIsThemeTransitioning(true);

    setTimeout(() => {
      setDarkMode(prev => !prev);
      setIsThemeTransitioning(false);
    }, 400);
  };

  useEffect(() => {
    if (!data) return;

    const updateTime = () => {
      const timezoneOffset = data.city.timezone;

      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const cityTime = new Date(utc + timezoneOffset * 1000);

      setCityTime(
        cityTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [data]);

  const weatherType = data?.list[0].weather[0].main;

  const handleSearch = () => {
    onSearch(searchQuery);
    setSearchQuery("");
  };

  return (
    <div className={"main-layout"}>
      <div className={`app ${darkMode ? "dark" : "light"}`}>

        <div className="top-bar">
          <div className="left-side">
            <img className="logo" src="/logoMain.png"/>
            <p className="app-name"><strong>FORECASTLY</strong></p>
          </div>

          <div className="group">
            <img className="search-icon" src="./src/assets/search.png"/>
            <input className="input" placeholder="Search City" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { handleSearch(); }}}/>
          </div>

          <div className="right-side">
            <label className="switch">
              <input className="input" type="checkbox" checked={darkMode} onChange={handleThemeToggle}/>
              <span className="slider">
                <img src={sunIcon} className="icon sun"/>
                <img src={moonIcon} className="icon moon"/>
              </span>
            </label>
          </div>
        </div>

        <div className={`content-wrapper ${isTransitioning ? "fade-out" : "fade-in"}`}>
          <div className="left-column">
            <div className="top-weather">
              {data && (
                <div className="current-weather">
                  <div className="left-section">
                    <h1 className="city-temp">{Math.round(data.list[0].main.temp)} °C</h1>
                    <div className="weather-desc">
                      <img className="weather-icon" src={weatherIcons[weatherType] || clearIcon}/>
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
                        <img className="wind-icon" src="/src/assets/wind.png"/>
                        <p className="city-wind"><strong>{Math.round(data.list[0].wind.speed)} m/s</strong></p>
                      </div>
                      <p className="city-temp-range">{Math.round(data.list[0].main.temp_min)} °C to {Math.round(data.list[0].main.temp_max)} °C</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {data && <p className="other-heading"><strong>OTHER CITIES</strong></p>}
            {data && <OtherCities1 />}
            {data && <OtherCities2 />}
            {data && <OtherCities3 />}

          </div>

          <div className="right-column">
            <HourlyForecast data={data}/>
            <DailyForecast data={data}/>
          </div>

        </div>
      </div>
    </div>
  );
}

export default WeatherApp;