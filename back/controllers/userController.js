const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createSession, deleteSession } = require('../models/sessionModel');
const PasswordChecker = require('../utils/PasswordChecker');
const zxcvbn = require('zxcvbn');
const crypto = require('crypto');

// JWT 비밀키
const JWT_SECRET = process.env.JWT_SECRET || 'climatch-secret-key';
const JWT_EXPIRES_IN = '1h';
const REFRESH_TOKEN_EXPIRES_IN = 30 * 24 * 60 * 60 * 1000; // 30일

// Generate a random password
const generateRandomPassword = (length = 12) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(crypto.randomInt(0, charset.length));
  }
  return password;
};

// Validate password strength
const validatePassword = (password) => {
  const result = zxcvbn(password);
  return {
    isValid: result.score >= 3,
    score: result.score,
    feedback: result.feedback
  };
};

// 사용자 회원가입
const register = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Validate username (lowercase English letters only)
    if (!/^[a-z]+$/.test(username)) {
      return res.status(400).json({ error: '아이디는 소문자 영어만 가능합니다.' });
    }

    // Generate password
    const password = generatePassword();
    const validation = validatePassword(password);
    
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Generated password is not strong enough',
        feedback: validation.feedback
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save user to database
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    connection.query(query, [username, email, hashedPassword], (error, results) => {
      if (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Error registering user' });
      }
      
      // Return the generated password to the user
      res.status(201).json({ 
        message: 'User registered successfully',
        password: password // In production, this should be sent via email
      });
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 사용자 로그인
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 필수 필드 확인
    if (!username || !password) {
      return res.status(400).json({ error: '사용자명과 비밀번호는 필수입니다.' });
    }

    // 사용자 조회
    const user = await userModel.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: '사용자명 또는 비밀번호가 일치하지 않습니다.' });
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: '사용자명 또는 비밀번호가 일치하지 않습니다.' });
    }

    // 액세스 토큰 생성
    const accessToken = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 리프레시 토큰 생성
    const refreshToken = jwt.sign(
      { userId: user.id, tokenType: 'refresh' },
      JWT_SECRET
    );

    // 세션 만료 시간 설정
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN);

    // 세션 저장
    await createSession(user.id, refreshToken, expiresAt);

    // 민감 정보 제외하고 응답
    const { password_hash: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: '로그인 성공',
      accessToken,
      refreshToken,
      expires_at: expiresAt,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 사용자 로그아웃
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: '리프레시 토큰이 필요합니다.' });
    }

    await deleteSession(refreshToken);
    
    res.status(200).json({ message: '로그아웃 성공' });
  } catch (error) {
    console.error('로그아웃 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 현재 사용자 정보 조회
const getCurrentUser = async (req, res) => {
  try {
    // JWT 미들웨어를 통해 전달된 사용자 ID
    const userId = req.user.userId;
    
    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    // 민감 정보 제외하고 응답
    const { password_hash: _, ...userWithoutPassword } = user;

    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 사용자 정보 업데이트
const updateUserProfile = async (req, res) => {
  try {
    // JWT 미들웨어를 통해 전달된 사용자 ID
    const userId = req.user.userId;
    const { gender, birth_date, age, location } = req.body;

    // 기존 사용자 정보 조회
    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    // 정보 업데이트
    const updatedUser = await userModel.updateUser(userId, {
      gender: gender || user.gender,
      birth_date: birth_date || user.birth_date,
      age: age || user.age,
      location: location || user.location
    });

    // 민감 정보 제외하고 응답
    const { password_hash: _, ...userWithoutPassword } = updatedUser;

    res.status(200).json({ 
      message: '사용자 정보가 업데이트되었습니다.',
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('사용자 정보 업데이트 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateUserProfile
}; 