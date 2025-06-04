import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../services/authService';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check for any messages passed from other pages (like signup)
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!userId || !password) {
      setError('ID와 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Use auth service to login with bcrypt password checking
      const result = await loginUser(userId, password);
      
      // If successful login, update the auth context
      login(result.user, result.token);
      navigate('/home');
    } catch (err) {
      setError(err.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center mb-8">
        <img src="/climatch_logo.png" alt="Climatch Logo" className="h-20 w-20" />
        <h1 className="text-3xl font-bold text-indigo-600 mt-2">Climatch</h1>
      </div>
      
      <form className="w-full max-w-sm p-6 bg-white rounded shadow" onSubmit={handleSubmit}>
        {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{message}</div>
        )}
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
        )}
        
        <div className="mb-4">
          <label className="block mb-2">ID</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2">Password</label>
          <input 
            type="password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? '로그인 중...' : 'Login'}
        </button>
        
        <p className="mt-4 text-center">
          회원이 아니신가요? <Link to="/signup" className="text-blue-500 hover:underline">회원가입</Link>
        </p>
      </form>
    </div>
  );
} 