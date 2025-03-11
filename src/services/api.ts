
import { Pokemon, PokemonListResponse, PokemonSpecies, EvolutionChain } from "../lib/types";

const API_BASE_URL = "https://pokeapi.co/api/v2";
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Helper to check if cached data is still valid
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

// Helper to get cached data if valid
const getCachedData = <T>(key: string): T | null => {
  const cachedData = localStorage.getItem(key);
  if (!cachedData) return null;
  
  try {
    const { data, timestamp } = JSON.parse(cachedData);
    if (isCacheValid(timestamp)) {
      return data as T;
    }
    return null;
  } catch (error) {
    console.error("Error parsing cached data:", error);
    return null;
  }
};

// Helper to cache data
const cacheData = <T>(key: string, data: T): void => {
  const cacheObject = {
    data,
    timestamp: Date.now()
  };
  
  try {
    localStorage.setItem(key, JSON.stringify(cacheObject));
  } catch (error) {
    console.error("Error caching data:", error);
    // If storage is full, clear older entries
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      clearOldCache();
      try {
        localStorage.setItem(key, JSON.stringify(cacheObject));
      } catch {
        console.error("Still cannot cache data after clearing old cache");
      }
    }
  }
};

// Helper to clear old cache entries
const clearOldCache = (): void => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('pokemon_')) {
      const cachedData = localStorage.getItem(key);
      if (cachedData) {
        try {
          const { timestamp } = JSON.parse(cachedData);
          if (!isCacheValid(timestamp)) {
            localStorage.removeItem(key);
          }
        } catch {
          localStorage.removeItem(key);
        }
      }
    }
  });
};

// Fetch Pokemon list with pagination
export const fetchPokemonList = async (limit = 20, offset = 0): Promise<PokemonListResponse> => {
  const cacheKey = `pokemon_list_${limit}_${offset}`;
  const cachedData = getCachedData<PokemonListResponse>(cacheKey);
  
  if (cachedData) return cachedData;
  
  try {
    const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error('Failed to fetch Pokemon list');
    
    const data: PokemonListResponse = await response.json();
    cacheData(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
};

// Fetch a single Pokemon by ID or name
export const fetchPokemon = async (idOrName: number | string): Promise<Pokemon> => {
  const cacheKey = `pokemon_${idOrName}`;
  const cachedData = getCachedData<Pokemon>(cacheKey);
  
  if (cachedData) return cachedData;
  
  try {
    const response = await fetch(`${API_BASE_URL}/pokemon/${idOrName}`);
    if (!response.ok) throw new Error(`Failed to fetch Pokemon: ${idOrName}`);
    
    const data: Pokemon = await response.json();
    cacheData(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching Pokemon ${idOrName}:`, error);
    throw error;
  }
};

// Fetch Pokemon species data
export const fetchPokemonSpecies = async (idOrName: number | string): Promise<PokemonSpecies> => {
  const cacheKey = `pokemon_species_${idOrName}`;
  const cachedData = getCachedData<PokemonSpecies>(cacheKey);
  
  if (cachedData) return cachedData;
  
  try {
    const response = await fetch(`${API_BASE_URL}/pokemon-species/${idOrName}`);
    if (!response.ok) throw new Error(`Failed to fetch Pokemon species: ${idOrName}`);
    
    const data: PokemonSpecies = await response.json();
    cacheData(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching Pokemon species ${idOrName}:`, error);
    throw error;
  }
};

// Fetch evolution chain
export const fetchEvolutionChain = async (url: string): Promise<EvolutionChain> => {
  const id = url.split('/').filter(Boolean).pop();
  const cacheKey = `evolution_chain_${id}`;
  const cachedData = getCachedData<EvolutionChain>(cacheKey);
  
  if (cachedData) return cachedData;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch evolution chain`);
    
    const data: EvolutionChain = await response.json();
    cacheData(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching evolution chain:`, error);
    throw error;
  }
};

// Search Pokemon by name
export const searchPokemon = async (query: string): Promise<Pokemon[]> => {
  try {
    // First get a list of all Pokemon
    const { results } = await fetchPokemonList(151, 0); // First 151 Pokemon
    
    // Filter Pokemon by name
    const filteredResults = results.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Fetch details for each matching Pokemon
    const pokemonPromises = filteredResults.map(p => fetchPokemon(p.name));
    return await Promise.all(pokemonPromises);
  } catch (error) {
    console.error('Error searching Pokemon:', error);
    throw error;
  }
};
