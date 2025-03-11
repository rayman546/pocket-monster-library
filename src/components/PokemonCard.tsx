
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pokemon } from '../lib/types';

interface PokemonCardProps {
  pokemon: Pokemon;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const [isRotated, setIsRotated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showShiny, setShowShiny] = useState(false);
  
  const typeColors: Record<string, string> = {
    normal: 'bg-pokemon-normal',
    fire: 'bg-pokemon-fire',
    water: 'bg-pokemon-water',
    electric: 'bg-pokemon-electric',
    grass: 'bg-pokemon-grass',
    ice: 'bg-pokemon-ice',
    fighting: 'bg-pokemon-fighting',
    poison: 'bg-pokemon-poison',
    ground: 'bg-pokemon-ground',
    flying: 'bg-pokemon-flying',
    psychic: 'bg-pokemon-psychic',
    bug: 'bg-pokemon-bug',
    rock: 'bg-pokemon-rock',
    ghost: 'bg-pokemon-ghost',
    dragon: 'bg-pokemon-dragon',
    dark: 'bg-pokemon-dark',
    steel: 'bg-pokemon-steel',
    fairy: 'bg-pokemon-fairy',
  };
  
  const mainType = pokemon.types[0].type.name;
  const bgColor = typeColors[mainType] || 'bg-muted';
  
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
  
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const toggleShiny = () => {
    setShowShiny(!showShiny);
  };

  // Choose the appropriate sprite based on showShiny state
  const spriteUrl = showShiny 
    ? pokemon.sprites.other['official-artwork'].front_shiny || pokemon.sprites.front_shiny
    : pokemon.sprites.other['official-artwork'].front_default;
  
  return (
    <div 
      className="perspective group"
      onMouseEnter={() => setIsRotated(true)}
      onMouseLeave={() => setIsRotated(false)}
    >
      <div className={`relative w-full h-full transition-transform duration-500 preserve-3d ${isRotated ? 'transform-gpu rotate-y-180' : ''}`}>
        {/* Front of card */}
        <div className={`backface-hidden rounded-2xl overflow-hidden glass card-hover border border-white/30 shadow-sm transition-all duration-300 h-full`}>
          <div className={`${bgColor}/20 p-6 flex flex-col items-center`}>
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full"></div>
              </div>
            )}
            <img 
              src={spriteUrl} 
              alt={`${pokemon.name}${showShiny ? ' (Shiny)' : ''}`}
              onClick={toggleShiny}
              className={`w-40 h-40 object-contain transition-opacity duration-300 select-none animate-float ${isLoaded ? 'opacity-100' : 'opacity-0'} cursor-pointer`}
              onLoad={handleImageLoad}
              title={showShiny ? "Click to see normal form" : "Click to see shiny form"}
            />
            {showShiny && (
              <div className="mt-1 px-2 py-0.5 bg-amber-500/20 text-amber-600 text-xs font-semibold rounded-full">
                ✨ Shiny ✨
              </div>
            )}
            <div className="mt-4 text-center w-full">
              <span className="inline-block text-xs font-medium text-muted-foreground/80 bg-muted/80 rounded-full px-2 py-0.5 mb-1">
                #{pokemon.id.toString().padStart(3, '0')}
              </span>
              <h3 className="text-xl font-display font-semibold capitalize">{pokemon.name}</h3>
              <div className="flex justify-center space-x-2 mt-2">
                {pokemon.types.map((type) => (
                  <span 
                    key={type.type.name} 
                    className={`${typeColors[type.type.name]} px-2 py-0.5 rounded-full text-white text-xs font-medium`}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Back of card */}
        <div className="absolute inset-0 backface-hidden transform-gpu rotate-y-180 rounded-2xl overflow-hidden glass card-hover border border-white/30 shadow-sm h-full">
          <div className="p-5 h-full flex flex-col">
            <h3 className="text-lg font-semibold capitalize text-center mb-4">{pokemon.name}</h3>
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name} className="flex items-center text-sm">
                    <span className="w-20 font-medium">{formatStatName(stat.stat.name)}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${bgColor}`} 
                        style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs font-mono">{stat.base_stat}</span>
                  </div>
                ))}
              </div>
              
              <Link 
                to={`/pokemon/${pokemon.id}`} 
                className="mt-4 block w-full text-center px-4 py-2 rounded-lg bg-primary text-white font-medium transition-all hover:bg-primary/90"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;

