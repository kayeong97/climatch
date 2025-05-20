import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';

export function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Header />
      <form className="w-full max-w-sm mt-8 p-6 bg-white rounded shadow" onSubmit={() => navigate('/home')}>
        <label className="block mb-2">ID</label>
        <input type="text" className="w-full mb-4 p-2 border rounded" />

        <label className="block mb-2">Password</label>
        <input type="password" className="w-full mb-4 p-2 border rounded" />

        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">Login</button>
        <p className="mt-4 text-center">
          회원이 아니신가요? <Link to="/signup" className="text-blue-500">회원가입</Link>
        </p>
      </form>
    </div>
  );
} 