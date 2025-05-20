import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';

export function OutfitViewPage() {
  const recommended = Array(3).fill(null);
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="p-6">
        <Link to="/home" className="text-sm">&lt; 홈으로</Link>
        <h2 className="text-2xl font-semibold mt-4">코디 보기</h2>
        <p className="mt-2">추천 연령 : 19 ~ 25, 같은 날씨 기반으로 추천되었습니다.</p>

        <div className="mt-6 grid grid-cols-3 gap-4">
          {recommended.map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded" />
          ))}
        </div>

        <div className="mt-4 text-center space-x-2">
          <button>1</button><button>2</button><button>3</button>
        </div>
      </div>
    </div>
  );
} 