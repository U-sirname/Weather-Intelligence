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
  return (
    
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg border border-slate-200">
      <h1 className="text-2xl font-bold text-slate-800 mb-4 text-center">Weather Intelligence</h1>
      
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
  );
}
