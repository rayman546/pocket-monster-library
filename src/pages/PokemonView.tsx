
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PokemonDetail from '../components/PokemonDetail';
import LoadingState from '../components/LoadingState';
import { fetchPokemon } from '../services/api';
import { Pokemon } from '../lib/types';

const PokemonView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadPokemon = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchPokemon(id);
        setPokemon(data);
      } catch (error) {
        console.error('Error loading Pokemon:', error);
        setError('Failed to load Pokémon details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadPokemon();
  }, [id]);
  
  const handlePrevious = () => {
    if (pokemon && pokemon.id > 1) {
      navigate(`/pokemon/${pokemon.id - 1}`);
    }
  };
  
  const handleNext = () => {
    if (pokemon) {
      navigate(`/pokemon/${pokemon.id + 1}`);
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <LoadingState message="Loading Pokémon details" />
        </div>
      </Layout>
    );
  }
  
  if (error || !pokemon) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p>{error || 'Pokémon not found'}</p>
            <button 
              onClick={() => navigate('/')} 
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePrevious}
            disabled={pokemon.id <= 1}
            className="flex items-center px-3 py-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1"
            >
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Previous
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            Back to List
          </button>
          
          <button
            onClick={handleNext}
            className="flex items-center px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            Next
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1"
            >
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        
        <PokemonDetail pokemon={pokemon} />
      </div>
    </Layout>
  );
};

export default PokemonView;
