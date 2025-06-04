import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function OutfitUploadPage() {
  const { currentUser } = useAuth();
  const [dressingLevel, setDressingLevel] = useState('MID');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4">
        <div className="flex items-center">
          <Link to="/home" className="text-gray-600">
            &lt; 홈으로
          </Link>
          <h1 className="text-xl font-semibold mx-auto">코디 업로드</h1>
        </div>
        
        <div className="max-w-md mx-auto mt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <div 
                className="aspect-[3/4] bg-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => document.getElementById('fileInput').click()}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500">업로드</span>
                )}
              </div>
              <input 
                id="fileInput" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <label className="block mb-1">상의 색상 :</label>
                <input type="text" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>

              <div>
                <label className="block mb-1">꾸밈단계 :</label>
                <div className="flex space-x-2">
                  {['MIN', 'MID', 'MAX'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDressingLevel(level)}
                      className={`px-3 py-1 border rounded ${
                        dressingLevel === level 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1">지역 :</label>
                <input type="text" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>

              <div>
                <label className="block mb-1">날씨 :</label>
                <div className="flex items-center">
                  <input type="text" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  <span className="ml-2">시/군</span>
                </div>
              </div>

              <div>
                <label className="block mb-1">나이 :</label>
                <div className="flex items-center">
                  <input type="number" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  <span className="ml-2">세</span>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-purple-600 text-white py-3 rounded-lg mt-8 hover:bg-purple-700 transition-colors"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
} 