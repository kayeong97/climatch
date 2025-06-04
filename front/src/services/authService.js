// In a real application, this would be a backend service.
// For this demo, we're simulating bcrypt functionality in the frontend.
// Note: In a production app, NEVER do password hashing in the frontend.
// This is purely for demonstration purposes.

// API 기본 URL
const API_BASE_URL = 'http://localhost:3000/api';

// Simulate bcrypt hash function (간단한 해시 시뮬레이션)
const simulateBcryptHash = async (password) => {
  const salt = Array.from({ length: 16 }, () => 
    Math.floor(Math.random() * 36).toString(36)
  ).join('');
  
  const combined = password + salt;
  const hash = btoa(combined);
  
  return `$2b$10$${salt}${hash}`;
};

// Simulate bcrypt compare function (간단한 비교 시뮬레이션)
const simulateBcryptCompare = async (password, hash) => {
  const parts = hash.split('$');
  if (parts.length !== 4) return false;
  
  const salt = parts[3].substring(0, 16);
  const storedHash = parts[3].substring(16);
  
  const combined = password + salt;
  const compareHash = btoa(combined);
  
  return compareHash === storedHash;
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    // 백엔드 API 호출을 위한 데이터 변환
    const backendUserData = {
      username: userData.userId,
      password: userData.password,
      birth_date: userData.birthDate,
      age: userData.age,
      location: userData.location,
    };
    
    // 백엔드 API 호출 시도
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendUserData),
        signal: AbortSignal.timeout(3000)
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('서버에 회원가입 성공:', data);
        return { success: true, user: data.user };
      }
    } catch (apiError) {
      console.error('API 호출 실패, localStorage에 저장:', apiError);
    }
    
    // 백엔드 API 호출 실패 시 localStorage에 저장 (백업 방식)
    const { password, ...otherData } = userData;
    const hashedPassword = await simulateBcryptHash(password);
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (existingUsers.some(u => u.userId === userData.userId)) {
      throw new Error('이미 존재하는 아이디입니다.');
    }
    
    const newUser = {
      ...otherData,
      passwordHash: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    return { success: true, user: { ...otherData } };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (userId, password) => {
  try {
    // 백엔드 API 호출 시도
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userId, password }),
        signal: AbortSignal.timeout(3000)
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        return { success: true, user: data.user, token: data.token };
      }
    } catch (apiError) {
      console.error('API 호출 실패, localStorage에서 사용자 확인:', apiError);
    }

    // 백엔드 API 호출 실패 시 localStorage에서 확인 (백업 방식)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.userId === userId);
    
    if (!user) {
      throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
    
    const isPasswordValid = await simulateBcryptCompare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
    
    const token = btoa(`${userId}:${Date.now()}`);
    const { passwordHash, ...userData } = user;
    
    return { success: true, user: userData, token };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export default {
  registerUser,
  loginUser
}; 