
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-haiti-blue" />
          <span className="font-bold text-lg text-haiti-dark">BAC Haïti Quiz AI</span>
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
