import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { OutfitViewPage } from './pages/OutfitViewPage';
import { OutfitUploadPage } from './pages/OutfitUploadPage';
import Weather from './pages/Weather';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 인증이 필요하지 않은 페이지 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* 인증이 필요한 페이지 */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/home" element={<Weather />} />
              <Route path="/" element={<Weather />} />
              <Route path="/view" element={<OutfitViewPage />} />
              <Route path="/upload" element={<OutfitUploadPage />} />
            </Route>
          </Route>
          
          {/* 기본 경로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
} 