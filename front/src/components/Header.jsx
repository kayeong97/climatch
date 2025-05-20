import React from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="flex items-center p-4 shadow">
      <Link to="/home">
        <img src="/climatch_logo.png" alt="Climatch Logo" className="h-8 w-8 mr-2" />
      </Link>
      <h1 className="text-2xl font-semibold">Climatch</h1>
    </header>
  );
} 