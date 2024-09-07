import React, { useState, useEffect } from 'react';
import { useChoghadiya } from '../hooks/useChoghadiya';

interface WeatherForecast {
  time: Date;
  temperature: number;
  conditions: string;
}

interface Period {
  name: string;
  start: Date;
  end: Date;
  effect: string;
}

const WeatherIntegration: React.FC = () => {
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const { periods } = useChoghadiya();

  useEffect(() => {
    // Simulating weather API call
    const fetchWeather = async () => {
      // Replace this with actual API call when ready
      const mockForecast: WeatherForecast[] = [
        { time: new Date(), temperature: 25, conditions: 'Sunny' },
        { time: new Date(Date.now() + 3600000), temperature: 27, conditions: 'Partly Cloudy' },
        { time: new Date(Date.now() + 7200000), temperature: 26, conditions: 'Clear' },
      ];
      setWeatherForecast(mockForecast);
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    if (periods && periods.length > 0) {
      const newRecommendations = periods.map((period: Period) => {
        const weather = weatherForecast.find(w => w.time >= period.start && w.time < period.end);
        if (weather && period.effect === 'Good' && weather.conditions === 'Clear') {
          return `${period.name} is a good time for outdoor activities. Weather: ${weather.conditions}, Temperature: ${weather.temperature}°C`;
        }
        return null;
      }).filter(Boolean) as string[];

      setRecommendations(newRecommendations);
    }
  }, [weatherForecast, periods]);

  if (!periods || periods.length === 0) {
    return <div>Loading Choghadiya periods...</div>;
  }

  return (
    <div className="weather-integration">
      <h2>Weather-based Recommendations</h2>
      {recommendations.length > 0 ? (
        <ul>
          {recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      ) : (
        <p>No weather-based recommendations available at this time.</p>
      )}
    </div>
  );
};

export default WeatherIntegration;