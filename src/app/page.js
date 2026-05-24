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
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?${params}&units=metric&appid=${apiKey}`;
      const weatherRes = await fetch(weatherUrl);
      if (!weatherRes.ok) throw new Error("Location not found");
      const weatherData = await weatherRes.json();

      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${params}&units=metric&appid=${apiKey}`;
      const forecastRes = await fetch(forecastUrl);
      if (!forecastRes.ok) throw new Error("Forecast unavailable");
      const forecastData = await forecastRes.json();

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

  const handleLocationSearch = () => {
    if (!navigator.geolocation) return setError("Geolocation not supported");
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => getData(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`),
      () => { setError("Location access denied."); setLoading(false); }
    );
  };

  return (
    /* MAIN CANVAS: Now the entire screen is your container */
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4">      
      <div className="w-full max-w-4xl flex flex-col items-center"></div>
      {/* HEADER: Floating freely at the top */}
      <header className="mb-12">
        <h1 className="text-slate-900 text-sm font-black tracking-[0.4em] uppercase opacity-60">
          Weather-Intelligence
        </h1>
      </header>

      {/* SEARCH SECTION: Minimalist and centered */}
     <div className="w-[85%] max-w-xl flex flex-col items-center mb-16">
        <div className="relative w-full mb-6">
          <input 
            className="w-full bg-transparent border-b-2 border-slate-200 py-3 px-2 text-xl font-medium text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-500 transition-all"
            value={city} 
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search city..."
          />
          <button 
            onClick={handleSearch} 
            className="absolute right-2 top-3 text-blue-600 font-bold text-2xl hover:translate-x-1 transition-transform"
          >
            {loading ? "..." : "→"}
          </button>
        </div>
        <button 
          onClick={handleLocationSearch} 
          className="text-[10px] text-blue-400 font-bold tracking-[0.2em] hover:text-blue-600 uppercase transition-colors"
        >
          📍 Current Location
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="w-full flex flex-col items-center pt-24 animate-in fade-in duration-500">
          <div className="bg-red-50/50 px-8 py-4 rounded-full shadow-sm max-w-md">
            <p className="text-red-500 font-black uppercase tracking-[0.3em] text-[10px] text-center">
              ⚠️ {error}
            </p>
          </div>
          <p className="text-slate-400 text-[9px] text-center mt-4 uppercase tracking-widest opacity-60">
            Check the spelling or try a different location
          </p>
        </div>
      )}

      {/* WEATHER DATA: Displayed directly on the background */}
      {weather && (
        <div className="w-full max-w-2xl flex flex-col items-center animate-in fade-in zoom-in duration-1000">
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-4 text-center">
            {weather.name}
          </h2>
          
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            <div className="text-center md:text-right">
              <p className="text-8xl md:text-9xl font-black text-blue-600 tracking-tighter leading-none">
                {Math.round((weather.main.temp * 9/5) + 32)}°F
              </p>
              <p className="text-2xl font-bold text-slate-400 mt-2">
                {Math.round(weather.main.temp)}°C
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-start border-l-0 md:border-l-2 border-slate-200 md:pl-8">
              <img 
                className="w-32 h-32 -my-6"
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} 
                alt="weather icon"
              />
              <p className="text-sm font-black uppercase tracking-[0.4em] text-slate-400 italic">
                {weather.weather[0].description}
              </p>
            </div>
          </div>

          {/* 5-DAY FORECAST: Clean horizontal line */}
          <div className="w-full pt-12 border-t border-slate-200/60 max-w-xl">
            <div className="grid grid-cols-5 gap-4 md:gap-8">
              {forecast.map((day) => (
                <div key={day.dt} className="flex flex-col items-center group">
                  <p className="text-[10px] font-black text-slate-300 uppercase mb-2 group-hover:text-blue-400 transition-colors">
                    {new Date(day.dt * 1000).toLocaleDateString('en-US', {weekday: 'short'})}
                  </p>
                  <img 
                    className="w-10 h-10 grayscale group-hover:grayscale-0 transition-all" 
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
                    alt="icon" 
                  />
                  <p className="text-[11px] font-bold text-slate-400 mt-2">
                    {Math.round((day.main.temp * 9/5) + 32)}°F <span className="text-slate-200">/ {Math.round(day.main.temp)}°C</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}