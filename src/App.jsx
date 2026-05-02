import './index.css'
import { useState, useEffect, useCallback } from 'react'
import WeatherApp from './WeatherApp.jsx'
import IntroScreen from './IntroScreen.jsx'

function App() {
  const [selectedCity, setSelectedCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const [phase, setPhase] = useState("idle");
  // phases: "idle" | "loading" | "fading" | "done"

  // Intro plays once per session; sessionStorage persists until tab is closed
  const [showIntro, setShowIntro] = useState(
    () => !sessionStorage.getItem("introPlayed")
  );

  const handleIntroDone = useCallback(() => {
    sessionStorage.setItem("introPlayed", "1");
    setShowIntro(false);
  }, []);

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    setSelectedCity(searchQuery);
  };

  useEffect(() => {
    if (!selectedCity) return;
    const API_KEY = "b165829b6d626fcd82a77fceb66003ee";

    async function fetchWeather() {
      try {
        setPhase("loading");

        const MIN_LOADING_MS = 1000;

        const [response] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${API_KEY}&units=metric`),
          new Promise(resolve => setTimeout(resolve, MIN_LOADING_MS)),
        ]);

        const data = await response.json();

        if (data.cod !== "200") {
          console.warn("City not found:", selectedCity);
          setPhase("idle");
          return;
        }

        setCurrentWeather(data);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setPhase("fading");
            setTimeout(() => setPhase("done"), 500);
          });
        });

      } catch (error) {
        console.log(error);
        setPhase("idle");
      }
    }

    fetchWeather();
  }, [selectedCity]);

  return (
    <>
      {/* Intro sits above everything in the stacking context.
          It unmounts itself cleanly after the fade-out completes. */}
      {showIntro && (
        <IntroScreen onDone={handleIntroDone} isDark={isDark} />
      )}

      {/* Main app always renders underneath — no remount, no layout flash */}
      <WeatherApp
        data={currentWeather}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        onSearch={handleSearch}
        isDark={isDark}
        setIsDark={setIsDark}
        skeletonPhase={phase}
      />
    </>
  );
}

export default App