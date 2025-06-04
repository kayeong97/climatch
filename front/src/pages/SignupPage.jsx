import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import zxcvbn from 'zxcvbn';
import { registerUser } from '../services/authService';

export function SignupPage() {
  const navigate = useNavigate();
  const passwordInputRef = useRef(null);
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formValid, setFormValid] = useState(false);
  const [userId, setUserId] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordSuggestion, setShowPasswordSuggestion] = useState(true);
  const [passwordFeedback, setPasswordFeedback] = useState('');

  // Generate years, months, and days for dropdowns
  const years = Array.from({ length: 100 }, (_, i) => 2025 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  // Location options
  const locations = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

  // Password suggestions
  const strongPasswordSuggestions = [
    'Climatch2025!@',
    'Weather&Style123',
    'Fashion#Cloud456',
    'Secure$Style789',
    'C00l_L00k!2025'
  ];

  // Randomly select a password suggestion
  const getRandomPasswordSuggestion = () => {
    const index = Math.floor(Math.random() * strongPasswordSuggestions.length);
    return strongPasswordSuggestions[index];
  };

  const [passwordSuggestion] = useState(getRandomPasswordSuggestion());

  // Handle Enter key on password field
  const handlePasswordKeyDown = (e) => {
    if (e.key === 'Enter' && showPasswordSuggestion) {
      e.preventDefault();
      setPassword(passwordSuggestion);
      setShowPasswordSuggestion(false);
    }
  };

  // Handle password input focus
  const handlePasswordFocus = () => {
    if (!password) {
      setShowPasswordSuggestion(true);
    }
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword !== passwordSuggestion) {
      setShowPasswordSuggestion(false);
    }
  };

  // 비밀번호 강도 평가
  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setPasswordStrength(result.score);
      
      // Set feedback based on the password strength
      if (result.score < 2) {
        let feedback = result.feedback.warning || '';
        if (result.feedback.suggestions && result.feedback.suggestions.length > 0) {
          feedback += feedback ? ': ' : '';
          feedback += result.feedback.suggestions[0];
        }
        
        if (!feedback) {
          if (password.length < 8) {
            feedback = '비밀번호가 너무 짧습니다';
          } else if (!/[A-Z]/.test(password)) {
            feedback = '대문자가 포함되어야 합니다';
          } else if (!/[a-z]/.test(password)) {
            feedback = '소문자가 포함되어야 합니다';
          } else if (!/[0-9]/.test(password)) {
            feedback = '숫자가 포함되어야 합니다';
          } else if (!/[^A-Za-z0-9]/.test(password)) {
            feedback = '특수문자가 포함되어야 합니다';
          }
        }
        
        setPasswordFeedback(feedback);
      } else {
        setPasswordFeedback('');
      }
    } else {
      setPasswordStrength(0);
      setPasswordFeedback('');
    }
  }, [password]);

  // 폼 유효성 검사
  useEffect(() => {
    // 비밀번호 강도가 2 이상(보통 이상)이고 ID가 있고 이용약관에 동의한 경우에만 유효
    setFormValid(
      passwordStrength >= 2 && 
      userId.trim() !== '' && 
      agreeTerms &&
      birthYear &&
      birthMonth &&
      birthDay &&
      location
    );
  }, [passwordStrength, userId, agreeTerms, birthYear, birthMonth, birthDay, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Create user data object
      const userData = {
        userId,
        password,
        birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
        location,
        age: new Date().getFullYear() - birthYear
      };
      
      // Register user with bcrypt password hashing
      await registerUser(userData);
      
      // If successful, navigate to login page
      navigate('/login', { 
        state: { message: '회원가입이 완료되었습니다. 로그인해주세요.' } 
      });
    } catch (err) {
      setError(err.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
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

  // 비밀번호 추천 가이드라인
  const passwordRecommendations = [
    "최소 8자 이상 입력하세요",
    "대문자, 소문자, 숫자, 특수문자를 조합하세요",
    "개인정보(이름, 생일 등)가 포함되지 않도록 하세요",
    "연속된 문자나 숫자를 사용하지 마세요 (예: 123456, abcdef)"
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
      <div className="flex flex-col items-center mb-6">
        <img src="/climatch_logo.png" alt="Climatch Logo" className="h-16 w-16" />
        <h1 className="text-2xl font-bold text-indigo-600 mt-2">회원가입</h1>
      </div>
      
      <form className="w-full max-w-md p-6 bg-white rounded shadow" onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block mb-2">ID :</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" 
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Password :</label>
          <div className="relative">
            <input 
              type="password" 
              ref={passwordInputRef}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" 
              value={password}
              onChange={handlePasswordChange}
              onFocus={handlePasswordFocus}
              onKeyDown={handlePasswordKeyDown}
              placeholder={showPasswordSuggestion ? passwordSuggestion : ""}
              required
            />
            {showPasswordSuggestion && !password && (
              <p className="mt-1 text-xs text-gray-500">
                Enter 키를 누르면 추천 비밀번호를 사용할 수 있습니다.
              </p>
            )}
            {password && (
              <div className="my-2 flex items-center">
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
            {passwordFeedback && (
              <p className="text-xs text-red-500 mb-2">{passwordFeedback}</p>
            )}
          </div>
          
          {/* 비밀번호 추천 가이드라인 */}
          <div className="mt-2 p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-500 font-medium mb-1">안전한 비밀번호 만들기:</p>
            <ul className="text-xs text-gray-500 list-disc pl-4">
              {passwordRecommendations.map((rec, index) => (
                <li key={index} className="mb-1">{rec}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">생년월일 :</label>
          <div className="flex space-x-2">
            <select 
              className="flex-1 p-2 border rounded"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              required
            >
              <option value="">년</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select 
              className="flex-1 p-2 border rounded"
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
              required
            >
              <option value="">월</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select 
              className="flex-1 p-2 border rounded"
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
              required
            >
              <option value="">일</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">거주 지역 :</label>
          <select 
            className="w-full p-2 border rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="">시/군</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="mr-2" 
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required
            />
            <span className="text-sm">개인정보 수집에 동의합니다.</span>
          </label>
        </div>

        <button 
          type="submit" 
          className={`w-full py-2 rounded text-white transition-colors ${
            formValid && !isLoading
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!formValid || isLoading}
        >
          {isLoading ? '처리 중...' : '회원가입'}
        </button>

        <p className="mt-4 text-center">
          이미 계정이 있으신가요? <Link to="/login" className="text-blue-500 hover:underline">로그인</Link>
        </p>
      </form>
    </div>
  );
} 