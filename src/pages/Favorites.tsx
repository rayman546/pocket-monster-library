
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import PokemonCard from '../components/PokemonCard';
import LoadingState from '../components/LoadingState';
import { fetchPokemon } from '../services/api';
import { Pokemon } from '../lib/types';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        
        // Get favorite IDs from localStorage
        const favoriteIds = JSON.parse(localStorage.getItem('pokemon_favorites') || '[]');
        
        if (favoriteIds.length === 0) {
          setFavorites([]);
          setLoading(false);
          return;
        }
        
        // Fetch details for each favorite Pokemon
        const favoritesData = await Promise.all(
          favoriteIds.map((id: number) => fetchPokemon(id))
        );
        
        setFavorites(favoritesData);
      } catch (error) {
        console.error('Error loading favorites:', error);
        setError('Failed to load favorites. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadFavorites();
    
    // Add event listener for storage changes
    const handleStorageChange = () => {
      loadFavorites();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Manually trigger reload when favorites change
  const handleFavoritesChange = () => {
    const favoriteIds = JSON.parse(localStorage.getItem('pokemon_favorites') || '[]');
    if (favorites.length !== favoriteIds.length) {
      setLoading(true);
      // Small delay to allow animation to complete
      setTimeout(() => {
        const loadFavorites = async () => {
          try {
            if (favoriteIds.length === 0) {
              setFavorites([]);
              setLoading(false);
              return;
            }
            
            const favoritesData = await Promise.all(
              favoriteIds.map((id: number) => fetchPokemon(id))
            );
            
            setFavorites(favoritesData);
          } catch (error) {
            console.error('Error reloading favorites:', error);
          } finally {
            setLoading(false);
          }
        };
        
        loadFavorites();
      }, 300);
    }
  };
  
  // Add listener to custom event
  useEffect(() => {
    window.addEventListener('favoritesUpdated', handleFavoritesChange);
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesChange);
    };
  }, [favorites.length]);
  
  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <LoadingState message="Loading favorites" />
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
              Your Favorites
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              View and manage your favorite Pokémon collection.
            </p>
          </div>
          
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map(p => (
                <PokemonCard key={p.id} pokemon={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-xl">
              <div className="mb-4">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto text-muted-foreground"
                >
                  <path d="M12 20.25L3.75 12.75C2.25 11.25 2.25 9 3.75 7.5C5.25 6 7.5 6 9 7.5L12 10.5L15 7.5C16.5 6 18.75 6 20.25 7.5C21.75 9 21.75 11.25 20.25 12.75L12 20.25Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">No favorites yet</h3>
              <p className="text-muted-foreground mt-1">
                Add Pokémon to your favorites by clicking the heart icon on their detail page
              </p>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Favorites;
