
import React from 'react';
import Navbar from './Navbar';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="py-6 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Data provided by <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PokéAPI</a></p>
          <p className="mt-2">© {new Date().getFullYear()} Pokémon Library</p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;
