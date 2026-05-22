'use client'; // This tells Next.js this is an interactive page
import { useState } from 'react';

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  const fetchWeather = async () => {
    const apiKey = "YOUR_OPENWEATHER_API_KEY";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    setWeather(data); // This saves the data into "memory"
  };

  return (
    <main style={{ padding: '20px' }}>
      <h1>Weather App</h1>
      
      {/* Search Input */}
      <input 
        type="text" 
        value={city} 
        onChange={(e) => setCity(e.target.value)} 
        placeholder="Enter city..."
      />
      <button onClick={fetchWeather}>Search</button>

      {/* Display Section (Step 4: DOM Manipulation) */}
      {weather && weather.main && (
        <div>
          <h2>{weather.name}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Condition: {weather.weather[0].description}</p>
        </div>
      )}
    </main>
  );
}
