// services/AuthService.js
// 인증 및 비밀번호 해싱/검증 처리
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PasswordChecker = require('../utils/PasswordChecker');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository; // 사용자 데이터 접근 객체
    this.passwordChecker = new PasswordChecker();
  }

  // 로그인 처리 (JWT 발급)
  async login(username, password) {
    const userRecord = await this.userRepository.findByUsername(username);
    if (!userRecord) return false;
    
    const valid = await this.checkPassword(password, userRecord.passwordHash);
    if (!valid) return false;
    
    const token = jwt.sign({ id: userRecord.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  }

  // 로그아웃 처리
  logout() {
    // 클라이언트 측에서 토큰 삭제하도록 유도
    // 서버 측에서는 별도의 추가 작업 없음
    return true;
  }

  // 회원가입 처리
  async signup(user) {
    // 비밀번호 해시화 등 사용자 정보 처리
    const existingUser = await this.userRepository.findByUsername(user.username);
    if (existingUser) return false;
    
    // 사용자 생성
    const result = await this.userRepository.create(user);
    return result ? true : false;
  }

  // 비밀번호 해싱
  async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  // 비밀번호 검증
  async checkPassword(input, hash) {
    return bcrypt.compare(input, hash);
  }
}

module.exports = AuthService; 