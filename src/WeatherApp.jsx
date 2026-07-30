import { useState, useEffect, useLayoutEffect, useRef } from "react";
import DailyForecast from "./DailyForecast";
import HourlyForecast from "./HourlyForecast";
import OtherCities from "./OtherCities";
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

// Shown on the landing screen so the first search is one click away.
// Deliberately distinct from the three cities pinned under "Other Cities".
const CITY_SUGGESTIONS = ["Delhi", "Paris", "Singapore", "Sydney"];

const FLIP_MS = 520;
const FLIP_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

function WeatherApp({
  data,
  onSearch,
  isDark,
  setIsDark,
  skeletonPhase = "idle",
  searchError = "",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityTime, setCityTime] = useState("");

  const isIdle       = skeletonPhase === "idle";
  const isLoading    = skeletonPhase === "loading";
  const isFading     = skeletonPhase === "fading";
  const showSkeleton = isLoading || isFading;

  const showContent  = isFading || skeletonPhase === "done";

  // Landing = nothing has loaded yet and nothing is in flight. A failed
  // search returns here, so the error stays attached to the centred bar.
  const isLanding = !data && isIdle;

  const lockupRef = useRef(null);
  const groupRef = useRef(null);
  const inputRef = useRef(null);
  const lastRects = useRef({});
  const wasLanding = useRef(isLanding);

  // FLIP: the lockup and search bar are the same nodes in both layouts, so
  // we can play the layout jump back as a real movement. This runs after
  // every commit rather than only when `isLanding` flips, so the stored
  // rects always describe the layout we are actually coming from.
  useLayoutEffect(() => {
    const layoutChanged = wasLanding.current !== isLanding;
    wasLanding.current = isLanding;

    const targets = { lockup: lockupRef.current, group: groupRef.current };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    for (const [key, el] of Object.entries(targets)) {
      if (!el) continue;

      const next = el.getBoundingClientRect();
      const last = lastRects.current[key];
      lastRects.current[key] = next;

      if (!layoutChanged || !last || reduceMotion || !next.width || !last.width) continue;

      const dx = (last.left + last.width / 2) - (next.left + next.width / 2);
      const dy = (last.top + last.height / 2) - (next.top + next.height / 2);
      const scale = last.width / next.width;

      if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(scale - 1) < 0.01) continue;

      // The search bar keeps a constant height between layouts, so animating
      // its real width avoids the text distortion a scaleX would cause.
      const frames = key === "group"
        ? [
            { transform: `translate(${dx}px, ${dy}px)`, width: `${last.width}px` },
            { transform: "translate(0, 0)", width: `${next.width}px` },
          ]
        : [
            { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
            { transform: "none" },
          ];

      el.animate(frames, { duration: FLIP_MS, easing: FLIP_EASING });
    }
  });

  // Focus the centred bar on pointer devices only, so mobile keyboards
  // don't spring open on arrival.
  useEffect(() => {
    if (!isLanding) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    inputRef.current?.focus();
  }, [isLanding]);

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
    <div className={`app ${isDark ? "dark" : "light"} ${isLanding ? "landing" : ""}`}>


      <div className="top-bar">
        <div className="bar-core">
          <div className="left-side" ref={lockupRef}>
            <img className="logo" src="/logoMain.png" alt="Forecastly" />
            <p className="app-name"><strong>FORECASTLY</strong></p>
          </div>
          <div className="group" ref={groupRef}>
            <img className="search-icon" src="/search.png" alt="" />
            <input
              className="input"
              ref={inputRef}
              placeholder="Search City"
              value={searchQuery}
              disabled={showSkeleton}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
            />
            {searchError && <p className="search-error">{searchError}</p>}
          </div>
          {isLanding && (
            <div className="suggestions">
              {CITY_SUGGESTIONS.map(city => (
                <button
                  key={city}
                  type="button"
                  className="suggestion"
                  onClick={() => onSearch(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
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
                  <OtherCities city="London" />
                  <OtherCities city="Tokyo" />
                  <OtherCities city="New York" />
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