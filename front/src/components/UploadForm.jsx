import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export function UploadForm() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    weather: '',
    location: '',
    age: currentUser?.age || '',
    image: null
  });
  const [weather, setWeather] = useState(null);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedCity, setSelectedCity] = useState('서울');
  const [selectedDistrict, setSelectedDistrict] = useState('강남구');

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

    // Fetch districts for selected city
    const fetchDistricts = async () => {
      try {
        const response = await axios.get(`/api/locations/districts?city=${selectedCity}`);
        setDistricts(response.data);
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    };

    // Fetch current weather
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`/api/weather?city=${selectedCity}&district=${selectedDistrict}`);
        setWeather(response.data);
        setFormData(prev => ({
          ...prev,
          weather: response.data.description,
          location: `${selectedCity} ${selectedDistrict}`
        }));
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    fetchCities();
    fetchDistricts();
    fetchWeather();
  }, [selectedCity, selectedDistrict]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedDistrict(''); // Reset district when city changes
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      await axios.post('/api/outfits', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Handle success
    } catch (error) {
      console.error('Error uploading outfit:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">제목</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">설명</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows="3"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">도시</label>
          <select
            value={selectedCity}
            onChange={handleCityChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">구/군</label>
          <select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">날씨</label>
        <input
          type="text"
          value={formData.weather}
          onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">나이</label>
        <input
          type="number"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">이미지</label>
        <input
          type="file"
          onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          className="mt-1 block w-full"
          accept="image/*"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        업로드
      </button>
    </form>
  );
} 