import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { HomePage } from './pages/HomePage';
import { OutfitViewPage } from './pages/OutfitViewPage';
import { OutfitUploadPage } from './pages/OutfitUploadPage';
import Weather from './pages/Weather';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/view" element={<OutfitViewPage />} />
        <Route path="/upload" element={<OutfitUploadPage />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
} 