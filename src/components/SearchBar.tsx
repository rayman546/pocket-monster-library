
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchPokemon } from '../services/api';
import { Pokemon } from '../lib/types';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Pokemon[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Handle outside click to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setIsSearching(true);
        try {
          const data = await searchPokemon(query);
          setResults(data);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);
  
  const handleSelectPokemon = (pokemon: Pokemon) => {
    setQuery('');
    setShowResults(false);
    navigate(`/pokemon/${pokemon.id}`);
  };
  
  const getTypeColor = (type: string): string => {
    return `bg-pokemon-${type}`;
  };
  
  return (
    <div className="relative w-full max-w-md mx-auto" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Pokémon..."
          className="w-full px-4 py-3 rounded-full bg-white/80 backdrop-blur-lg border-0 ring-1 ring-primary/10 focus:ring-2 focus:ring-primary/40 shadow-sm transition-all duration-200 placeholder:text-muted-foreground/70"
          onFocus={() => {
            if (results.length > 0) setShowResults(true);
          }}
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full"></div>
          </div>
        )}
      </div>
      
      {showResults && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white/95 backdrop-blur-xl rounded-lg shadow-lg overflow-hidden transition-all duration-200 animate-fade-in border border-border">
          <div className="max-h-96 overflow-y-auto p-1">
            {results.map((pokemon) => (
              <button
                key={pokemon.id}
                onClick={() => handleSelectPokemon(pokemon)}
                className="flex items-center w-full px-3 py-2 hover:bg-muted/50 rounded-md transition-colors"
              >
                <img 
                  src={pokemon.sprites.front_default} 
                  alt={pokemon.name} 
                  className="w-12 h-12 mr-3"
                />
                <div className="flex flex-col items-start">
                  <span className="font-medium capitalize">{pokemon.name}</span>
                  <div className="flex space-x-1 mt-1">
                    {pokemon.types.map((t) => (
                      <span 
                        key={t.type.name}
                        className={`${getTypeColor(t.type.name)} text-white text-xs px-2 py-0.5 rounded-full`}
                      >
                        {t.type.name}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="ml-auto text-muted-foreground font-mono">#{pokemon.id.toString().padStart(3, '0')}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
