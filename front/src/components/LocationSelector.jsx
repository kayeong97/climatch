import React, { useState, useEffect } from 'react';

// 임시 도시 데이터
const MOCK_CITIES = [
  { code: 'seoul', name: '서울' },
  { code: 'busan', name: '부산' },
  { code: 'incheon', name: '인천' },
  { code: 'daegu', name: '대구' },
  { code: 'daejeon', name: '대전' },
  { code: 'gwangju', name: '광주' },
  { code: 'ulsan', name: '울산' },
  { code: 'jeju', name: '제주' }
];

// 임시 구/군 데이터
const MOCK_DISTRICTS = {
  seoul: [
    { code: 'gangnam', name: '강남구' },
    { code: 'gangdong', name: '강동구' },
    { code: 'gangbuk', name: '강북구' },
    { code: 'gangseo', name: '강서구' },
    { code: 'gwanak', name: '관악구' },
    { code: 'mapo', name: '마포구' },
    { code: 'jongno', name: '종로구' }
  ],
  busan: [
    { code: 'haeundae', name: '해운대구' },
    { code: 'suyeong', name: '수영구' },
    { code: 'geumjeong', name: '금정구' },
    { code: 'yeonje', name: '연제구' }
  ],
  incheon: [
    { code: 'namdong', name: '남동구' },
    { code: 'yeonsu', name: '연수구' },
    { code: 'bupyeong', name: '부평구' }
  ],
  daegu: [
    { code: 'suseong', name: '수성구' },
    { code: 'dalseo', name: '달서구' },
    { code: 'dalseong', name: '달성군' }
  ],
  daejeon: [
    { code: 'yuseong', name: '유성구' },
    { code: 'seo', name: '서구' },
    { code: 'jung', name: '중구' }
  ],
  gwangju: [
    { code: 'seo', name: '서구' },
    { code: 'nam', name: '남구' },
    { code: 'buk', name: '북구' }
  ],
  ulsan: [
    { code: 'nam', name: '남구' },
    { code: 'dong', name: '동구' },
    { code: 'buk', name: '북구' }
  ],
  jeju: [
    { code: 'jeju', name: '제주시' },
    { code: 'seogwipo', name: '서귀포시' }
  ]
};

const LocationSelector = ({ onLocationSelect }) => {
  const [cities] = useState(MOCK_CITIES);
  const [districts, setDistricts] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [loading, setLoading] = useState(false);

  // 선택된 도시에 따라 구/군 목록 설정
  useEffect(() => {
    if (!selectedCity) {
      setDistricts([]);
      return;
    }

    setLoading(true);
    // 임시 데이터에서 구/군 목록 가져오기
    const districtData = MOCK_DISTRICTS[selectedCity] || [];
    setDistricts(districtData);
    setLoading(false);
  }, [selectedCity]);

  // 도시 선택 핸들러
  const handleCityChange = (e) => {
    const cityCode = e.target.value;
    setSelectedCity(cityCode);
    setSelectedDistrict('');
    
    // 부모 컴포넌트에 위치 정보 전달
    if (cityCode) {
      const cityName = cities.find(city => city.code === cityCode)?.name || '';
      onLocationSelect(cityName);
    } else {
      onLocationSelect(null);
    }
  };

  // 구/군 선택 핸들러
  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    
    if (districtCode) {
      const cityName = cities.find(city => city.code === selectedCity)?.name || '';
      const districtName = districts.find(district => district.code === districtCode)?.name || '';
      // 부모 컴포넌트에 위치 정보 전달 (도시명 + 구/군명)
      onLocationSelect(`${cityName} ${districtName}`);
    } else {
      const cityName = cities.find(city => city.code === selectedCity)?.name || '';
      onLocationSelect(cityName);
    }
  };

  return (
    <div className="location-selector">
      <div className="mb-4">
        <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-1">
          도시 선택
        </label>
        <select
          id="city-select"
          value={selectedCity}
          onChange={handleCityChange}
          disabled={loading || cities.length === 0}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">도시를 선택하세요</option>
          {cities.map((city) => (
            <option key={city.code} value={city.code}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCity && (
        <div className="mb-4">
          <label htmlFor="district-select" className="block text-sm font-medium text-gray-700 mb-1">
            구/군 선택
          </label>
          <select
            id="district-select"
            value={selectedDistrict}
            onChange={handleDistrictChange}
            disabled={loading || districts.length === 0}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">구/군을 선택하세요</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading && <div className="text-gray-500 text-sm">로딩 중...</div>}
    </div>
  );
};

export default LocationSelector; 