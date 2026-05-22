'use client';
import { useState } from 'react';

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiKey = process.env.NEXT_PUBLIC_WEATHER_KEY;
    
   const getData = async (params) => {
    setLoading(true);
    setError('');
     
    try {
      //Fetch Current Weather 
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?${params}&units=metric&appid=${apiKey}`;
      const weatherRes = await fetch(weatherUrl);
      if (!weatherRes.ok) throw new Error("Location not found");
      const weatherData = await weatherRes.json();
      //Fetch 5-Day Forecast
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${params}&units=metric&appid=${apiKey}`;
      const forecastRes = await fetch(forecastUrl);
      if (!forecastRes.ok) throw new Error("Forecast unavailable");
      const forecastData = await forecastRes.json();
    
    // Filter for 12:00 PM daily readings (Requirement 1.1)
      const dailyForecast = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

      setWeather(weatherData);
      setForecast(dailyForecast);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
      if (city.trim()) getData(`q=${city}`);
    };
  
  // Search by GPS (Requirement: Current Location)
  const handleLocationSearch = () => {
    if (!navigator.geolocation) return setError("Geolocation not supported");
    
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        getData(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
      },
      (err) => {
        setError("Location access denied.");
        setLoading(false);
      }
    );
  };
  
 const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const themeMap = {
  Clear: "from-blue-400 to-blue-600",
  Clouds: "from-gray-400 to-blue-500",
  Rain: "from-blue-700 to-slate-900",
  Drizzle: "from-cyan-600 to-blue-800",
  Thunderstorm: "from-purple-900 to-slate-900",
  Snow: "from-blue-100 to-blue-300",
  Default: "from-blue-500 to-blue-800" // Starting with a clear sky
};

  // Get the current weather type, or 'Default' if no search has happened yet
const currentWeatherType = weather ? weather.weather[0].main : 'Default';
const backgroundGradient = themeMap[currentWeatherType] || themeMap.Default;
  
  return (
<div className={`min-h-screen transition-all duration-1000 bg-gradient-to-br ${backgroundGradient} text-white p-4 md:p-8`}>
  <div className="max-w-md mx-auto mt-10 p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 text-slate-800">
    <h1 className="text-2xl font-black text-slate-900 mb-4 text-center tracking-tight">
      WEATHER INTELLIGENCE
    </h1>    
  
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex gap-2">
        <input 
          className="flex-grow p-2 border border-slate-300 rounded-lg focus:outline-blue-500 text-slate-700"
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          onKeyDown={handleKeyDown} 
          placeholder="City, Zip Code, or Landmark..."        
        />
          <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            {loading ? "..." : "Search"}
          </button>
        </div>
          <button onClick={handleLocationSearch} className="text-sm text-blue-600 hover:underline">
            📍 Use My Current Location
          </button>
        </div>

      {/* Error Handling: Requirement 1.2 */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg text-center border border-red-100">
          ⚠️ {error}
        </div>
      )}

      {weather && (
        <div className="animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-slate-800">{weather.name}</h2>
          <img className="mx-auto w-24 h-24"
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} 
            alt="weather icon"
          />
          <p className="text-5xl font-bold text-blue-600 mb-2">{Math.round(weather.main.temp)}°C</p>
          <p className="text-slate-500 capitalize italic">{weather.weather[0].description}</p>
         
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-800 text-sm">
            {weather.main.temp > 25 ? "☀️ It's warm! Stay hydrated." : 
             weather.main.temp < 10 ? "❄️ It's chilly! Wear a jacket." : 
               "☁️ Pleasant weather for a walk."}
          </div>

          {/* 5-Day Forecast (Requirement 1.1) */}
          <div className="mt-8">
            <h3 className="font-bold text-slate-700 mb-4">5-Day Forecast (at Noon)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {forecast.map((day) => (
                <div key={day.dt} className="p-3 bg-white border border-slate-100 rounded-lg text-center shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                      {new Date(day.dt * 1000).toLocaleDateString('en-US', {weekday: 'short'})}
                    </p>                  
                    <img className="mx-auto w-8" src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt="icon" />
                  <p className="text-sm font-bold text-blue-700">{Math.round(day.main.temp)}°</p>
                </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}
