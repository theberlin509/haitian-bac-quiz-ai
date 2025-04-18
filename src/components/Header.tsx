
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/07ef9a06-c088-44ed-88a0-69794df8c53e.png" 
            alt="BacFasil Logo" 
            className="h-10 w-10"
          />
          <span className="font-bold text-lg text-haiti-dark">BacFasil</span>
        </Link>
        <nav className="flex gap-4">
          <Link to="/" className="text-haiti-dark hover:text-haiti-blue transition-colors">
            Accueil
          </Link>
          <Link to="/progress" className="text-haiti-dark hover:text-haiti-blue transition-colors">
            Progression
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
