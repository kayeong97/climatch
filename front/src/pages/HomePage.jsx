import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';

export function HomePage() {
  const navigate = useNavigate();
  const weather = { temperature: 22, description: '맑음' };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="p-6">
        <div className="flex justify-end space-x-4 text-sm">
          <button onClick={() => navigate('/view')}>다른 사람 코디 보러 가기</button>
          <button onClick={() => navigate('/upload')}>오늘의 코디 업로드하기</button>
          <button onClick={() => {/* 이전 코디 보기 */}}>이전 코디 보러 가기</button>
          <button onClick={() => {/* 로그아웃 */}}>logout</button>
        </div>

        <div className="mt-10 flex items-center space-x-4">
          <div className="text-yellow-400 text-6xl">☀️</div>
          <div className="text-5xl">{weather.temperature}°C</div>
        </div>

        <p className="mt-6 text-xl">ID님! 오늘 날씨엔 셔츠 어때요?</p>
      </div>
    </div>
  );
} 