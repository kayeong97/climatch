import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function OutfitViewPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;
  // For demo purposes, we'll use an empty array to simulate no recommendations
  const recommended = [];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4">
        <div className="flex items-center">
          <Link to="/home" className="text-gray-600">
            &lt; 홈으로
          </Link>
          <h1 className="text-xl font-semibold mx-auto">코디 보기</h1>
        </div>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          추천 연령 : 19 ~ 25, 같은 날씨 기반으로 추천되었습니다.
        </p>

        {recommended.length > 0 ? (
          <>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommended.map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-200 rounded-lg shadow" />
              ))}
            </div>

            <div className="mt-6 flex justify-center items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-10 p-8 bg-gray-50 rounded-lg text-center">
            <div className="text-gray-400 text-5xl mb-4">😔</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">추천할 이미지가 없습니다</h3>
            <p className="text-gray-500">
              현재 날씨와 연령대에 맞는 코디 추천이 없습니다.<br />
              직접 코디를 올려보시는 건 어떨까요?
            </p>
            <Link 
              to="/upload" 
              className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              코디 업로드하기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 