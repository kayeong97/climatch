import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: '',
    gender: '',
    city: '',
    district: ''
  });
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch cities
    const fetchCities = async () => {
      try {
        const response = await axios.get('/api/locations/cities');
        setCities(response.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    // Fetch districts when city changes
    if (formData.city) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(`/api/locations/districts?city=${formData.city}`);
          setDistricts(response.data);
        } catch (error) {
          console.error('Error fetching districts:', error);
        }
      };

      fetchDistricts();
    }
  }, [formData.city]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/auth/register', formData);
      if (response.data.password) {
        alert(`회원가입이 완료되었습니다. 임시 비밀번호: ${response.data.password}`);
        navigate('/login');
      }
    } catch (error) {
      setError(error.response?.data?.error || '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          회원가입
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                사용자명 (소문자 영어만 가능)
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                나이
              </label>
              <div className="mt-1">
                <input
                  id="age"
                  name="age"
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                성별
              </label>
              <div className="mt-1">
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">선택하세요</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                도시
              </label>
              <div className="mt-1">
                <select
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value, district: '' })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">선택하세요</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                구/군
              </label>
              <div className="mt-1">
                <select
                  id="district"
                  name="district"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={!formData.city}
                >
                  <option value="">선택하세요</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 