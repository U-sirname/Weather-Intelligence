"use client";
import { useState, useEffect } from "react";
import { MapPin, Search, Wind, Droplets, Sun, Thermometer, Navigation } from "lucide-react";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("weatherHistory") || "[]");
    setHistory(saved);
  }, []);

  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!city) return;
    fetchWeatherData(`q=${city}`);
  };

  const fetchWeatherData = async (query) => {
    setLoading(true);
    try {
      const res = await fetch(
        
`https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();
      if (res.ok) {
        setWeather(data);
        saveToHistory(data.name);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = (name) => {
    const updated = [name, ...history.filter(i => i !== name)].slice(0, 5);
    setHistory(updated);
    localStorage.setItem("weatherHistory", JSON.stringify(updated));
  };

  const getMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        fetchWeatherData(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-10 space-y-10">
      {/* Search Header */}
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">
          Weather <span className="text-blue-600">Intelligence</span>
        </h1>
      </section>

      <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search City..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
          Search
        </button>
        <button 
          type="button"
          onClick={getMyLocation}
          className="flex items-center justify-center gap-2 bg-white text-slate-700 px-6 py-4 rounded-2xl font-semibold border border-slate-200 hover:bg-slate-50 transition"
        >
          <MapPin size={20} className="text-blue-600" />
        </button>
      </form>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weather Results */}
        <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-xl min-h-[400px]">
          {loading ? (
            <div className="h-full flex items-center justify-center animate-pulse text-slate-400">Analyzing atmosphere...</div>
          ) : weather ? (
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-bold">{weather.name}</h2>
                  <p className="text-slate-500 capitalize">{weather.weather[0].description}</p>
                </div>
                <div className="text-6xl font-black text-blue-600">{Math.round(weather.main.temp)}°C</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <Wind className="text-blue-500 mb-2" />
                  <p className="text-xs text-slate-500 uppercase font-bold">Wind</p>
                  <p className="font-semibold">{weather.wind.speed} m/s</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <Droplets className="text-blue-500 mb-2" />
                  <p className="text-xs text-slate-500 uppercase font-bold">Humidity</p>
                  <p className="font-semibold">{weather.main.humidity}%</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <Thermometer className="text-blue-500 mb-2" />
                  <p className="text-xs text-slate-500 uppercase font-bold">Feels Like</p>
                  <p className="font-semibold">{Math.round(weather.main.feels_like)}°C</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <Navigation className="text-blue-500 mb-2" />
                  <p className="text-xs text-slate-500 uppercase font-bold">Pressure</p>
                  <p className="font-semibold">{weather.main.pressure} hPa</p>
                </div>
              </div>

              {/* AI Traveler Insight */}
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
                  <Sun size={18} /> Travel Intelligence Insight
                </h4>
                <p className="text-blue-700 text-sm">
                  {weather.main.temp > 25 ? "High temperatures detected. Stay hydrated and schedule outdoor activities for early morning." : 
                   weather.wind.speed > 10 ? "Significant wind speeds. Expect potential delays for high-profile vehicles or light aircraft." : 
                   "Conditions are stable for local transit and outdoor activities."}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
              <Sun size={64} className="mb-4" />
              <p>Search a location to begin</p>
            </div>
          )}
        </div>

        {/* Search History Sidebar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-widest text-slate-400">Recent Searches</h3>
          <div className="space-y-2">
            {history.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => fetchWeatherData(`q=${item}`)}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 font-medium text-slate-700"
              >
                {item}
              </button>
            ))}
            {history.length === 0 && <p className="text-sm text-slate-400 italic">No history yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
