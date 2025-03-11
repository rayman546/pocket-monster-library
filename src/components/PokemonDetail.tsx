
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pokemon, PokemonSpecies, EvolutionChain } from '../lib/types';
import { fetchPokemonSpecies, fetchEvolutionChain, fetchPokemon } from '../services/api';
import LoadingState from './LoadingState';

interface PokemonDetailProps {
  pokemon: Pokemon;
}

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon }) => {
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evolution, setEvolution] = useState<EvolutionChain | null>(null);
  const [evolutionPokemon, setEvolutionPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check if this Pokemon is in favorites
        const favorites = JSON.parse(localStorage.getItem('pokemon_favorites') || '[]');
        setIsFavorite(favorites.includes(pokemon.id));
        
        // Fetch species data
        const speciesData = await fetchPokemonSpecies(pokemon.id);
        setSpecies(speciesData);
        
        // Fetch evolution chain
        if (speciesData.evolution_chain) {
          const evoData = await fetchEvolutionChain(speciesData.evolution_chain.url);
          setEvolution(evoData);
          
          // Get Pokemon in evolution chain
          const evoChain: string[] = [];
          
          // Add first form
          evoChain.push(evoData.chain.species.name);
          
          // Add second forms
          evoData.chain.evolves_to.forEach(secondForm => {
            evoChain.push(secondForm.species.name);
            
            // Add third forms
            secondForm.evolves_to.forEach(thirdForm => {
              evoChain.push(thirdForm.species.name);
            });
          });
          
          // Fetch data for each Pokemon in the evolution chain
          const uniqueEvoChain = Array.from(new Set(evoChain));
          const evoPokemonData = await Promise.all(
            uniqueEvoChain.map(name => fetchPokemon(name))
          );
          
          // Sort evolution Pokemon by their position in the evolution chain
          const sortedEvoPokemon = evoPokemonData.sort((a, b) => {
            return uniqueEvoChain.indexOf(a.name) - uniqueEvoChain.indexOf(b.name);
          });
          
          setEvolutionPokemon(sortedEvoPokemon);
        }
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [pokemon.id]);
  
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('pokemon_favorites') || '[]');
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = favorites.filter((id: number) => id !== pokemon.id);
      localStorage.setItem('pokemon_favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      // Add to favorites
      const updatedFavorites = [...favorites, pokemon.id];
      localStorage.setItem('pokemon_favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(true);
    }
  };
  
  const getTypeColor = (type: string): string => {
    return `bg-pokemon-${type}`;
  };
  
  const getEnglishDescription = (): string => {
    if (!species) return '';
    
    const englishEntry = species.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    
    return englishEntry 
      ? englishEntry.flavor_text.replace(/\f/g, ' ') 
      : 'No description available.';
  };
  
  if (loading) {
    return <LoadingState message="Loading details" />;
  }
  
  const formatStatName = (statName: string): string => {
    const statMap: Record<string, string> = {
      'hp': 'HP',
      'attack': 'ATK',
      'defense': 'DEF',
      'special-attack': 'Sp.ATK',
      'special-defense': 'Sp.DEF',
      'speed': 'SPD'
    };
    
    return statMap[statName] || statName;
  };
  
  const mainType = pokemon.types[0].type.name;
  const bgColor = getTypeColor(mainType);
  
  return (
    <div className="animate-fade-in">
      <div className={`${bgColor}/10 rounded-2xl p-6 md:p-8 glass`}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Pokemon image */}
          <div className="flex-shrink-0 w-full md:w-1/3 flex justify-center">
            <div className="relative perspective">
              <img 
                src={pokemon.sprites.other['official-artwork'].front_default} 
                alt={pokemon.name}
                className="w-64 h-64 object-contain animate-float drop-shadow-lg"
              />
            </div>
          </div>
          
          {/* Pokemon info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="text-muted-foreground font-mono">
                    #{pokemon.id.toString().padStart(3, '0')}
                  </span>
                  {species && (
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                      {species.generation.name.replace('-', ' ').toUpperCase()}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold capitalize mt-1">
                  {pokemon.name}
                </h1>
              </div>
              
              <button
                onClick={toggleFavorite}
                className="flex-shrink-0 p-2 rounded-full hover:bg-muted/50 transition-colors"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorite ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 20.25L3.75 12.75C2.25 11.25 2.25 9 3.75 7.5C5.25 6 7.5 6 9 7.5L12 10.5L15 7.5C16.5 6 18.75 6 20.25 7.5C21.75 9 21.75 11.25 20.25 12.75L12 20.25Z" fill="#ef4444" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 20.25L3.75 12.75C2.25 11.25 2.25 9 3.75 7.5C5.25 6 7.5 6 9 7.5L12 10.5L15 7.5C16.5 6 18.75 6 20.25 7.5C21.75 9 21.75 11.25 20.25 12.75L12 20.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {pokemon.types.map((type) => (
                <span 
                  key={type.type.name} 
                  className={`${getTypeColor(type.type.name)} px-3 py-1 rounded-full text-white text-sm font-medium`}
                >
                  {type.type.name}
                </span>
              ))}
            </div>
            
            <div className="mt-6 bg-white/40 backdrop-blur-sm rounded-xl overflow-hidden">
              <div className="flex border-b border-border">
                <button 
                  className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'about' ? 'bg-white/60 text-foreground' : 'text-muted-foreground hover:bg-white/30'}`}
                  onClick={() => setActiveTab('about')}
                >
                  About
                </button>
                <button 
                  className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'stats' ? 'bg-white/60 text-foreground' : 'text-muted-foreground hover:bg-white/30'}`}
                  onClick={() => setActiveTab('stats')}
                >
                  Stats
                </button>
                <button 
                  className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'evolution' ? 'bg-white/60 text-foreground' : 'text-muted-foreground hover:bg-white/30'}`}
                  onClick={() => setActiveTab('evolution')}
                >
                  Evolution
                </button>
              </div>
              
              <div className="p-4">
                {activeTab === 'about' && (
                  <div className="space-y-4">
                    <p className="text-sm text-balance">{getEnglishDescription()}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Height</p>
                        <p className="font-medium">{pokemon.height / 10} m</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Weight</p>
                        <p className="font-medium">{pokemon.weight / 10} kg</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Abilities</p>
                        <p className="font-medium capitalize">
                          {pokemon.abilities.map(a => a.ability.name).join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'stats' && (
                  <div className="space-y-3">
                    {pokemon.stats.map((stat) => (
                      <div key={stat.stat.name} className="flex items-center">
                        <span className="w-20 text-sm font-medium">{formatStatName(stat.stat.name)}</span>
                        <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${bgColor}`} 
                            style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-mono w-8 text-right">{stat.base_stat}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {activeTab === 'evolution' && (
                  <div>
                    {evolutionPokemon.length > 0 ? (
                      <div className="flex flex-wrap justify-center items-center gap-2">
                        {evolutionPokemon.map((evo, index) => (
                          <React.Fragment key={evo.id}>
                            <Link 
                              to={`/pokemon/${evo.id}`} 
                              className={`flex flex-col items-center p-2 rounded-lg hover:bg-white/40 transition-colors ${evo.id === pokemon.id ? 'ring-2 ring-primary/30 bg-white/20' : ''}`}
                            >
                              <img 
                                src={evo.sprites.front_default} 
                                alt={evo.name} 
                                className="w-20 h-20 object-contain"
                              />
                              <span className="text-xs text-muted-foreground">
                                #{evo.id.toString().padStart(3, '0')}
                              </span>
                              <span className="text-sm font-medium capitalize">
                                {evo.name}
                              </span>
                            </Link>
                            
                            {index < evolutionPokemon.length - 1 && (
                              <svg 
                                width="20" 
                                height="20" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-muted-foreground mx-1"
                              >
                                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground text-sm">No evolution data available</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
