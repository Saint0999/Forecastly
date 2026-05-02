import React, { useState, useEffect } from "react";
import DailyForecast from "./DailyForecast";
import HourlyForecast from "./HourlyForecast";
import OtherCities1 from "./OtherCities1";
import OtherCities2 from "./OtherCities2";
import OtherCities3 from "./OtherCities3";
import {
  SkeletonCurrentWeather,
  SkeletonHourlyForecast,
  SkeletonDailyForecast,
  SkeletonOtherCities,
} from "./SkeletonLoader";
import cloudIcon from "./assets/cloud.png";
import rainIcon from "./assets/rain.png";
import clearIcon from "./assets/clear.png";
import snowIcon from "./assets/snow.png";
import sunIcon from "./assets/sun.png";
import moonIcon from "./assets/moon.png";
import "./index.css";

const weatherIcons = {
  Clouds: cloudIcon,
  Rain: rainIcon,
  Drizzle: rainIcon,
  Clear: clearIcon,
  Snow: snowIcon,
  Mist: cloudIcon,
  Haze: cloudIcon,
};

function WeatherApp({
  data,
  selectedCity,
  setSelectedCity,
  onSearch,
  isDark,
  setIsDark,
  skeletonPhase = "idle",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityTime, setCityTime] = useState("");

  const isIdle       = skeletonPhase === "idle";
  const isLoading    = skeletonPhase === "loading";
  const isFading     = skeletonPhase === "fading";
  const showSkeleton = isLoading || isFading;
  
  const showContent  = isFading || skeletonPhase === "done";

  useEffect(() => {
    if (!data) return;
    const updateTime = () => {
      const timezoneOffset = data.city.timezone;
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const cityDate = new Date(utc + timezoneOffset * 1000);
      setCityTime(
        cityDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [data]);

  const weatherType = data?.list[0]?.weather[0]?.main;

  const handleSearch = () => {
    onSearch(searchQuery);
    setSearchQuery("");
  };

  return (
    <div className={`app ${isDark ? "dark" : "light"}`}>

      
      <div className="top-bar">
        <div className="left-side">
          <img className="logo" src="/logoMain.png" alt="Forecastly" />
          <p className="app-name"><strong>FORECASTLY</strong></p>
        </div>
        <div className="group">
          <img className="search-icon" src="/search.png" alt="" />
          <input
            className="input"
            placeholder="Search City"
            value={searchQuery}
            disabled={showSkeleton}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
          />
        </div>
        <div className="right-side">
          <label className="switch">
            <input
              type="checkbox"
              checked={isDark}
              onChange={() => setIsDark(prev => !prev)}
            />
            <span className="slider">
              <img src={sunIcon} className="icon sun" alt="" />
              <img src={moonIcon} className="icon moon" alt="" />
            </span>
          </label>
        </div>
      </div>

      <div className="content-wrapper">

        
        <div className="left-column">

          
          <div className="card-slot">
            {showSkeleton && (
              <div className={isFading ? "slot-layer slot-out" : "slot-layer"}>
                <SkeletonCurrentWeather />
              </div>
            )}
            {showContent && (
              <div className={isFading ? "slot-layer slot-in" : "slot-layer"}>
                {data ? (
                  <div className="current-weather">
                    <div className="left-section">
                      <h1 className="city-temp">{Math.round(data.list[0].main.temp)} °C</h1>
                      <div className="weather-desc">
                        <img className="weather-icon" src={weatherIcons[weatherType] || clearIcon} alt={weatherType} />
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
                          <img className="wind-icon" src="/wind.png" alt="wind" />
                          <p className="city-wind"><strong>{Math.round(data.list[0].wind.speed)} m/s</strong></p>
                        </div>
                        <p className="city-temp-range">
                          {Math.round(data.list[0].main.temp_min)} °C to {Math.round(data.list[0].main.temp_max)} °C
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          
          {!isIdle && <p className="other-heading"><strong>OTHER CITIES</strong></p>}
          <div className="card-slot">
            {showSkeleton && (
              <div className={isFading ? "slot-layer slot-out" : "slot-layer"}>
                <SkeletonOtherCities count={3} />
              </div>
            )}
            {showContent && (
              <div className={isFading ? "slot-layer slot-in" : "slot-layer"}>
                <div className="other-cities">
                  <OtherCities1 />
                  <OtherCities2 />
                  <OtherCities3 />
                </div>
              </div>
            )}
          </div>

        </div>

        
        <div className="right-column">

          
          <div className="card-slot">
            {showSkeleton && (
              <div className={isFading ? "slot-layer slot-out" : "slot-layer"}>
                <SkeletonHourlyForecast count={8} />
              </div>
            )}
            {showContent && (
              <div className={isFading ? "slot-layer slot-in" : "slot-layer"}>
                <HourlyForecast data={data} />
              </div>
            )}
          </div>

    
          {!isIdle && <p className="forecast-heading"><strong>5 DAY FORECAST</strong></p>}
          <div className="card-slot">
            {showSkeleton && (
              <div className={isFading ? "slot-layer slot-out" : "slot-layer"}>
                <SkeletonDailyForecast count={5} />
              </div>
            )}
            {showContent && (
              <div className={isFading ? "slot-layer slot-in" : "slot-layer"}>
                <DailyForecast data={data} />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default WeatherApp;