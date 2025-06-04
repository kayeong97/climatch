import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Climatch. 날씨 기반 의상 추천 서비스.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 