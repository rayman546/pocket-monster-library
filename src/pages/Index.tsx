
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import PokemonCard from '../components/PokemonCard';
import LoadingState from '../components/LoadingState';
import { fetchPokemonList, fetchPokemon } from '../services/api';
import { Pokemon } from '../lib/types';

const Index: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;
  
  const loadPokemon = async (initialLoad = false) => {
    try {
      if (initialLoad) {
        setLoading(true);
      }
      
      const response = await fetchPokemonList(limit, offset);
      
      if (response.results.length === 0) {
        setHasMore(false);
        return;
      }
      
      const pokemonDetails = await Promise.all(
        response.results.map(p => fetchPokemon(p.name))
      );
      
      if (initialLoad) {
        setPokemon(pokemonDetails);
      } else {
        setPokemon(prev => [...prev, ...pokemonDetails]);
      }
      
      setHasMore(!!response.next);
    } catch (error) {
      console.error('Error loading Pokemon:', error);
      setError('Failed to load Pokemon. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadPokemon(true);
  }, []);
  
  const loadMore = () => {
    setOffset(prev => prev + limit);
  };
  
  useEffect(() => {
    if (offset > 0) {
      loadPokemon();
    }
  }, [offset]);
  
  if (loading && pokemon.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <LoadingState message="Loading Pokémon" />
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p>{error}</p>
            <button 
              onClick={() => loadPokemon(true)} 
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <section className="mb-12">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              Pokémon Library
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              Explore the world of Pokémon with our comprehensive library featuring detailed information, stats, evolutions and more.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pokemon.map(p => (
              <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="p-4 text-center">
                  <h3 className="text-xl font-display font-semibold capitalize mb-2">{p.name}</h3>
                  <span className="inline-block text-xs font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5 mb-3">
                    #{p.id.toString().padStart(3, '0')}
                  </span>
                  
                  <div className="flex justify-center mb-4">
                    <img 
                      src={p.sprites.other['official-artwork'].front_default} 
                      alt={p.name}
                      className="w-32 h-32 object-contain animate-float"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="flex justify-center space-x-2 mb-3">
                    {p.types.map((type) => {
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
                      
                      return (
                        <span 
                          key={type.type.name} 
                          className={`${typeColors[type.type.name]} px-2 py-0.5 rounded-full text-white text-xs font-medium`}
                        >
                          {type.type.name}
                        </span>
                      );
                    })}
                  </div>
                  
                  <div className="space-y-1 text-left text-sm mb-4">
                    {p.stats.map((stat) => {
                      const statName = (() => {
                        switch(stat.stat.name) {
                          case 'hp': return 'HP';
                          case 'attack': return 'ATK';
                          case 'defense': return 'DEF';
                          case 'special-attack': return 'Sp.ATK';
                          case 'special-defense': return 'Sp.DEF';
                          case 'speed': return 'SPD';
                          default: return stat.stat.name;
                        }
                      })();
                      
                      // Determine color based on stat value
                      const getStatColor = (statName: string, value: number) => {
                        const type = p.types[0].type.name;
                        if (type === 'fire' || type === 'fighting') return 'bg-pokemon-fire';
                        if (type === 'water') return 'bg-pokemon-water';
                        if (type === 'grass') return 'bg-pokemon-grass';
                        if (type === 'electric') return 'bg-pokemon-electric';
                        return 'bg-primary';
                      };
                      
                      return (
                        <div key={stat.stat.name} className="flex items-center">
                          <span className="w-16 font-medium">{statName}</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getStatColor(stat.stat.name, stat.base_stat)}`} 
                              style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 w-8 text-right font-mono">{stat.base_stat}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <Link 
                    to={`/pokemon/${p.id}`} 
                    className="block w-full text-center px-4 py-2 rounded-lg bg-primary text-white font-medium transition-all hover:bg-primary/90"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {hasMore && (
            <div className="mt-10 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  'Load More Pokémon'
                )}
              </button>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Index;
