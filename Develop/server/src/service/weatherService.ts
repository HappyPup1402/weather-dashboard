import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number; // Latitude
  lon: number; // Longitude
}

// TODO: Define a class for the Weather object
class Weather {
  id: string;
  tempF: string;
  description: string;
  icon: string;
  city: string;
  date: string;
  windSpeed: string;
  humidity: string;

  constructor(
    id: string,
    tempF: string,
    description: string,
    icon: string,
    city: string,
    date: string,
    windSpeed: string,
    humidity: string
  ) {
    this.id = id;
    this.tempF = tempF;
    this.description = description;
    this.icon = icon;
    this.city = city;
    this.date = date;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string = process.env.API_BASE_URL || '';
  private apiKey: string = process.env.API_KEY || '';

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const geocodeQuery = this.buildGeocodeQuery(query);
    console.log(geocodeQuery);
    const response = await fetch(geocodeQuery);
    const data = await response.json();
    
    if (data.city.coord) {
      return { lat: data.city.coord.lat, lon: data.city.coord.lon };
    } else {
      throw new Error('Location not found');
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return { lat: locationData.lat, lon: locationData.lon };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `${this.baseURL}forecast?q=${query}&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string) {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    return await response.json();
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const weather = response.list[0];
      return new Weather(
        weather.weather[0].id, 
        weather.main.temp, 
        weather.weather[0].description,
        weather.weather[0].icon, 
        response.city.name,
        weather.dt_txt,
        weather.wind.speed,
        weather.main.humidity
      );
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecastArray: Weather[] = [];

    const limitedWeatherData = weatherData.slice(0, 6);

    // Loop through the weather data array
    for (const weather of limitedWeatherData) {
      // Create a new Weather object for each forecast entry
      const forecastWeather = new Weather(
        weather.weather[0].id,
        weather.main.temp,
        weather.weather[0].description,
        weather.weather[0].icon,
        currentWeather.city,
        weather.dt_txt,
        weather.wind.speed,
        weather.main.humidity
      );

      // Push the Weather object into the forecast array
      forecastArray.push(forecastWeather);
    }

    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    // Fetch and destructure the location data
    const coordinates = await this.fetchAndDestructureLocationData(city);

    // Fetch weather data using coordinates
    const weatherData = await this.fetchWeatherData(coordinates);

    // Parse the current weather data
    const currentWeather = this.parseCurrentWeather(weatherData);

    // Build the forecast array using the weather data
    const forecast = this.buildForecastArray(currentWeather, weatherData.list);

    return forecast;
  }
}

export default new WeatherService();
