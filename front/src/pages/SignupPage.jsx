import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import zxcvbn from 'zxcvbn';

export function SignupPage() {
  const years = Array.from({ length: 100 }, (_, i) => 2025 - i);
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formValid, setFormValid] = useState(false);
  const [userId, setUserId] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // 비밀번호 강도 평가
  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setPasswordStrength(result.score);
    } else {
      setPasswordStrength(0);
    }
  }, [password]);

  // 폼 유효성 검사
  useEffect(() => {
    // 비밀번호 강도가 2 이상(보통 이상)이고 ID가 있고 이용약관에 동의한 경우에만 유효
    setFormValid(passwordStrength >= 2 && userId.trim() !== '' && agreeTerms);
  }, [passwordStrength, userId, agreeTerms]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formValid) {
      navigate('/login');
    }
  };

  // 비밀번호 강도에 따른 텍스트와 색상
  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return { text: '매우 약함', color: 'text-red-500' };
      case 1:
        return { text: '약함', color: 'text-red-500' };
      case 2:
        return { text: '보통', color: 'text-yellow-500' };
      case 3:
        return { text: '강함', color: 'text-green-500' };
      case 4:
        return { text: '매우 강함', color: 'text-green-700' };
      default:
        return { text: '', color: '' };
    }
  };

  const strengthInfo = getPasswordStrengthText();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Header />
      <form className="w-full max-w-md mt-8 p-6 bg-white rounded shadow" onSubmit={handleSubmit}>
        <h2 className="text-xl mb-4">회원가입</h2>

        <label className="block mb-2">ID :</label>
        <input 
          type="text" 
          className="w-full mb-4 p-2 border rounded" 
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />

        <label className="block mb-2">Password :</label>
        <div className="relative">
          <input 
            type="password" 
            className="w-full mb-1 p-2 border rounded" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {password && (
            <div className="mb-4 flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    passwordStrength === 0 ? 'bg-red-700' : 
                    passwordStrength === 1 ? 'bg-red-500' : 
                    passwordStrength === 2 ? 'bg-yellow-500' : 
                    passwordStrength === 3 ? 'bg-green-500' : 'bg-green-700'
                  }`} 
                  style={{ width: `${(passwordStrength + 1) * 20}%` }}
                ></div>
              </div>
              <span className={`ml-2 text-sm ${strengthInfo.color}`}>{strengthInfo.text}</span>
            </div>
          )}
          {passwordStrength < 2 && password && (
            <p className="text-xs text-red-500 mb-4">비밀번호 강도가 약합니다. 더 강력한 비밀번호를 사용해주세요.</p>
          )}
        </div>

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
          <input 
            type="checkbox" 
            className="mr-2" 
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            required
          /> 
          개인정보 수집에 동의합니다.
        </label>

        <button 
          type="submit" 
          className={`w-full py-2 rounded ${formValid ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          disabled={!formValid}
        >
          회원가입
        </button>
      </form>
    </div>
  );
} 