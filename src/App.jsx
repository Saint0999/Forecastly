import './index.css'
import { useState, useEffect, useCallback } from 'react'
import WeatherApp from './WeatherApp.jsx'
import IntroScreen from './IntroScreen.jsx'

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
    const API_KEY = import.meta.env.VITE_OWM_API_KEY;
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

        if (data.cod !== "200") {
          setSearchError(`City "${selectedCity}" not found.`);
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