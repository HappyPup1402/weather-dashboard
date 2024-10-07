import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

// TODO: Define a City class with name and id properties
class City {
  // Properties of a city
  id: string;
  name: string;
  coord: { lat: number; lon: number };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;

  // Initialize the properties of a city
  constructor(
    id: string,
    name: string,
    coord: { lat: number; lon: number },
    country: string,
    population: number,
    timezone: number,
    sunrise: number,
    sunset: number
  ) {
    this.id = id;
    this.name = name;
    this.coord = coord;
    this.country = country;
    this.population = population;
    this.timezone = timezone;
    this.sunrise = sunrise;
    this.sunset = sunset;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(){
    return await fs.readFile('db/searchHistory.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile('db/searchHistory.json', JSON.stringify(cities, null, '\t'));
  }


  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read().then((cities) => {
      let parsedCities: City[];

      // If cities isn't an array or can't be turned into one, send back a new empty array
      try {
        // parse the JSON string into an array of City objects
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        // send an empty array if it fails
        parsedCities = [];
      }

      return parsedCities;
    });
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    if (!city) {
      throw new Error('state cannot be blank');
    }

    // create a new city
    const newCity: City = {
      name: city, id: uuidv4(),
      coord: {
        lat: 0,
        lon: 0
      },
      country: '',
      population: 0,
      timezone: 0,
      sunrise: 0,
      sunset: 0
    };

    // Get all cities, add the new city, write all the updated cities, return the newCity
    return await this.getCities()
        .then((cities) => {
            // Check for duplicates
            if (cities.find((existingCity) => existingCity.name === newCity.name)) {
                return cities; // Return existing cities if the new city already exists
            }
            return [...cities, newCity]; // Add the new city to the array
        })
        .then((updatedCities) => this.write(updatedCities)) // Write the updated cities back to the file
        .then(() => newCity); // Return the newly added city
  }
  
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    return await this.getCities()
      .then((cities) => cities.filter((city) => city.id !== id))
      .then((filteredCities) => this.write(filteredCities));
  }
}

export default new HistoryService();
