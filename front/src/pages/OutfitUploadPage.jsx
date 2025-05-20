import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';

export function OutfitUploadPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="p-6 max-w-lg mx-auto">
        <Link to="/home" className="text-sm">&lt; 홈으로</Link>
        <h2 className="text-2xl font-semibold mt-4">코디 업로드</h2>
        <form className="mt-6 space-y-4">
          <div className="flex">
            <div className="w-1/2 h-48 bg-gray-200 rounded mr-4 flex items-center justify-center">업로드</div>
            <div className="flex-1 space-y-2">
              <label>상의 색상 :</label>
              <input type="text" className="w-full p-2 border rounded" />

              <label>꾸밈단계 :</label>
              <div className="space-x-2">
                <button type="button" className="px-2 border rounded">MIN</button>
                <button type="button" className="px-2 border rounded">MID</button>
                <button type="button" className="px-2 border rounded">MAX</button>
              </div>

              <label>지역 :</label>
              <input type="text" className="w-full p-2 border rounded" />

              <label>날씨 :</label>
              <input type="text" className="w-full p-2 border rounded" placeholder="시/군" />

              <label>나이 :</label>
              <input type="number" className="w-full p-2 border rounded" />
            </div>
          </div>
          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">Upload</button>
        </form>
      </div>
    </div>
  );
} 