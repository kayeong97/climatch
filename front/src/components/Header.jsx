import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 현재 경로에 따라 활성화된 메뉴 항목 스타일 적용
  const getNavLinkClass = (path) => {
    return location.pathname === path
      ? "text-indigo-600 font-semibold"
      : "text-gray-600 hover:text-indigo-600";
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* 로고 및 브랜드명 */}
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/home" : "/login"} className="flex items-center">
              <img 
                src="/climatch_logo.png" 
                alt="Climatch Logo" 
                className="h-12 w-12 mr-3" 
              />
              <h1 className="text-2xl font-bold text-indigo-600">Climatch</h1>
            </Link>
          </div>

          {/* 데스크톱 네비게이션 메뉴 */}
          {isAuthenticated ? (
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/home" className={`${getNavLinkClass('/home')} text-lg`}>
                홈
              </Link>
              <Link to="/weather" className={`${getNavLinkClass('/weather')} text-lg`}>
                날씨
              </Link>
              <Link to="/view" className={`${getNavLinkClass('/view')} text-lg`}>
                코디 보기
              </Link>
              <Link to="/upload" className={`${getNavLinkClass('/upload')} text-lg`}>
                코디 업로드
              </Link>
              <button 
                onClick={handleLogout} 
                className="bg-red-500 text-white px-4 py-2 rounded-full text-sm hover:bg-red-600 transition-colors"
              >
                로그아웃
              </button>
              <span className="text-gray-600">
                {currentUser?.name || currentUser?.id}님
              </span>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center space-x-4">
              <Link 
                to="/login" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm hover:bg-indigo-700 transition-colors"
              >
                로그인
              </Link>
              <Link 
                to="/signup"
                className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-full text-sm hover:bg-indigo-50 transition-colors"
              >
                회원가입
              </Link>
            </nav>
          )}

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-500 hover:text-indigo-600 focus:outline-none"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 드롭다운 */}
        {isMenuOpen && (
          <div className="mt-4 md:hidden">
            <div className="flex flex-col space-y-3 pb-3">
              {isAuthenticated ? (
                <>
                  <div className="px-2 py-2 text-gray-600 font-semibold border-b pb-2">
                    {currentUser?.name || currentUser?.id}님
                  </div>
                  <Link 
                    to="/home" 
                    className={`${getNavLinkClass('/home')} px-2 py-2 rounded-md text-lg`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    홈
                  </Link>
                  <Link 
                    to="/weather" 
                    className={`${getNavLinkClass('/weather')} px-2 py-2 rounded-md text-lg`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    날씨
                  </Link>
                  <Link 
                    to="/view" 
                    className={`${getNavLinkClass('/view')} px-2 py-2 rounded-md text-lg`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    코디 보기
                  </Link>
                  <Link 
                    to="/upload" 
                    className={`${getNavLinkClass('/upload')} px-2 py-2 rounded-md text-lg`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    코디 업로드
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }} 
                    className="bg-red-500 text-white px-4 py-2 mt-2 rounded-md text-lg text-center"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-lg text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    로그인
                  </Link>
                  <Link 
                    to="/signup"
                    className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-md text-lg text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 