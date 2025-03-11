
import React, { useState, useEffect } from 'react';
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
              <PokemonCard key={p.id} pokemon={p} />
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
