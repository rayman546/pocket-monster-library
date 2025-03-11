
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-foreground">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-white"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="2" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="22" />
              <line x1="2" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="22" y2="12" />
            </svg>
          </div>
          <span className="font-display font-semibold text-lg">Pokémon Library</span>
        </Link>
        
        <div className="hidden md:block w-1/3">
          <SearchBar />
        </div>
        
        <nav className="flex items-center space-x-1">
          <Link 
            to="/" 
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === '/' 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/favorites" 
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === '/favorites' 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Favorites
          </Link>
        </nav>
      </div>
      
      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar />
      </div>
    </header>
  );
};

export default Navbar;
