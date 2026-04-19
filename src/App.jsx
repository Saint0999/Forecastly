import { useState, useEffect } from 'react'
import WeatherApp from './WeatherApp.jsx'

function App() {

  const [selectedCity, setSelectedCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    setIsVisible(false);

    setTimeout(() => {
      setSelectedCity(searchQuery);          
    }, 400);
  };

  useEffect((e) => {
    if(!selectedCity) return;
    const API_KEY = "b165829b6d626fcd82a77fceb66003ee";

    async function fetchWeather(){
        try{
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${API_KEY}&units=metric`);
            const data = await response.json();

            if (data.cod !== "200") {
              console.warn("City not found:", selectedCity);
              setIsTransitioning(false);
              return;
            }
            console.log(data);
            setCurrentWeather(data);
            setIsVisible(true);
        } catch (error){
            console.log(error);
            setIsVisible(true);
        }
    }

    fetchWeather();
  }, [selectedCity]);

  return(
    <>
      <WeatherApp data={currentWeather} selectedCity={selectedCity} setSelectedCity={setSelectedCity} isTransitioning={!isVisible} onSearch={handleSearch}/>
      
    </>
  )
}

export default App
