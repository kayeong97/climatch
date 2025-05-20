import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';

export function SignupPage() {
  const years = Array.from({ length: 100 }, (_, i) => 2025 - i);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Header />
      <form className="w-full max-w-md mt-8 p-6 bg-white rounded shadow" onSubmit={() => navigate('/login')}>
        <h2 className="text-xl mb-4">회원가입</h2>

        <label className="block mb-2">ID :</label>
        <input type="text" className="w-full mb-4 p-2 border rounded" />

        <label className="block mb-2">Password :</label>
        <input type="password" className="w-full mb-4 p-2 border rounded" />

        <label className="block mb-2">생년월일 :</label>
        <div className="flex mb-4 space-x-2">
          <select className="flex-1 p-2 border rounded">
            {years.map(y => <option key={y}>{y}년</option>)}
          </select>
          <select className="flex-1 p-2 border rounded">
            {Array.from({ length: 12 }, (_, i) => i+1).map(m => <option key={m}>{m}월</option>)}
          </select>
          <select className="flex-1 p-2 border rounded">
            {Array.from({ length: 31 }, (_, i) => i+1).map(d => <option key={d}>{d}일</option>)}
          </select>
        </div>

        <label className="block mb-2">거주 지역 :</label>
        <select className="w-full mb-4 p-2 border rounded">
          <option>시/도 선택</option>
          {/* 시/군 옵션 추가 */}
        </select>

        <label className="flex items-center mb-4">
          <input type="checkbox" className="mr-2" /> 개인정보 수집에 동의합니다.
        </label>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">회원가입</button>
      </form>
    </div>
  );
} 