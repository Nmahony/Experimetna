'use client'
import { useState, useEffect } from 'react'
import { Wind } from 'lucide-react'

interface WeatherData {
  temperature: number
  weatherCode: number
  windspeed: number
}

function getWeatherEmoji(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 3) return '⛅'
  if (code <= 48) return '🌫️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '❄️'
  if (code <= 82) return '🌦️'
  return '⛈️'
}

function getWeatherLabel(code: number): string {
  if (code === 0) return 'Clear sky'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 48) return 'Foggy'
  if (code <= 67) return 'Rainy'
  if (code <= 77) return 'Snowy'
  if (code <= 82) return 'Showers'
  return 'Stormy'
}

function isGoodOutdoorDay(code: number, temp: number): boolean {
  return code <= 3 && temp >= 8
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=50.8812&longitude=-1.0287&current=temperature_2m,weathercode,windspeed_10m&timezone=Europe%2FLondon'
    )
      .then(r => r.json())
      .then(data => {
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weathercode,
          windspeed: Math.round(data.current.windspeed_10m),
        })
      })
      .catch(() => {/* silently fail */})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="bg-white/10 rounded-xl px-4 py-3 flex items-center gap-3 min-w-[160px] animate-pulse">
        <div className="w-8 h-8 bg-white/20 rounded" />
        <div className="space-y-1">
          <div className="h-3 w-16 bg-white/20 rounded" />
          <div className="h-2 w-20 bg-white/20 rounded" />
        </div>
      </div>
    )
  }

  if (!weather) return null

  const good = isGoodOutdoorDay(weather.weatherCode, weather.temperature)

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3">
      <span className="text-3xl" role="img" aria-label={getWeatherLabel(weather.weatherCode)}>
        {getWeatherEmoji(weather.weatherCode)}
      </span>
      <div>
        <p className="text-white font-bold text-lg leading-none">{weather.temperature}°C</p>
        <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
          <Wind size={10} />
          {weather.windspeed} km/h
        </p>
      </div>
      <div className="ml-1 border-l border-white/20 pl-3">
        <p className={`text-xs font-semibold ${good ? 'text-green-200' : 'text-orange-200'}`}>
          {good ? '✓ Great outdoor day!' : '→ Maybe go indoors'}
        </p>
        <p className="text-white/60 text-xs">Waterlooville</p>
      </div>
    </div>
  )
}
