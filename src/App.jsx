import './index.css'
import { useState, useEffect, useCallback } from 'react'
import WeatherApp from './WeatherApp.jsx'
import IntroScreen from './IntroScreen.jsx'
import { API_KEY } from './config.js'

function errorMessageFor(data, city) {
  switch (String(data.cod)) {
    case "401":
      return "Weather service rejected the API key.";
    case "404":
      return `City "${city}" not found.`;
    case "429":
      return "Too many requests. Please try again in a moment.";
    default:
      return data.message
        ? `Couldn't load weather: ${data.message}`
        : "Couldn't fetch weather data. Please try again.";
  }
}

function App() {
  const [selectedCity, setSelectedCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const [phase, setPhase] = useState("idle");
  const [searchError, setSearchError] = useState("");

  const [showIntro, setShowIntro] = useState(
    () => !sessionStorage.getItem("introPlayed")
  );

  const handleIntroDone = useCallback(() => {
    sessionStorage.setItem("introPlayed", "1");
    setShowIntro(false);
  }, []);

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    setSearchError("");
    setSelectedCity(searchQuery);
  };

  useEffect(() => {
    if (!selectedCity) return;
    let cancelled = false;

    async function fetchWeather() {
      try {
        setPhase("loading");

        const MIN_LOADING_MS = 1000;

        const [response] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${API_KEY}&units=metric`),
          new Promise(resolve => setTimeout(resolve, MIN_LOADING_MS)),
        ]);

        const data = await response.json();
        if (cancelled) return;

        // OWM reports errors via `cod`, as a string on some endpoints and a
        // number on others, so compare loosely.
        if (String(data.cod) !== "200") {
          setSearchError(errorMessageFor(data, selectedCity));
          setPhase("idle");
          return;
        }

        setCurrentWeather(data);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (cancelled) return;
            setPhase("fading");
            setTimeout(() => {
              if (!cancelled) setPhase("done");
            }, 500);
          });
        });

      } catch (error) {
        if (cancelled) return;
        console.log(error);
        setSearchError("Couldn't fetch weather data. Please try again.");
        setPhase("idle");
      }
    }

    fetchWeather();
    return () => { cancelled = true; };
  }, [selectedCity]);

  return (
    <>
      {showIntro && (
        <IntroScreen onDone={handleIntroDone} isDark={isDark} />
      )}

      <WeatherApp
        data={currentWeather}
        onSearch={handleSearch}
        isDark={isDark}
        setIsDark={setIsDark}
        skeletonPhase={phase}
        searchError={searchError}
      />
    </>
  );
}

export default App