// services/AuthService.js
// 인증 및 비밀번호 해싱/검증 처리
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository; // 사용자 데이터 접근 객체
  }

  // 회원가입 처리
  async signUp(userData) {
    const { password, ...rest } = userData;
    const passwordHash = await this.hashPassword(password);
    const user = new User({ passwordHash, ...rest });
    // DB에 저장
    await this.userRepository.create({ ...rest, passwordHash });
    return user;
  }

  // 로그인 처리 (JWT 발급)
  async login({ id, password }) {
    const userRecord = await this.userRepository.findById(id);
    if (!userRecord) throw new Error('User not found');
    const valid = await this.comparePassword(password, userRecord.passwordHash);
    if (!valid) throw new Error('Invalid credentials');
    const token = jwt.sign({ id: userRecord.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  }

  // 로그아웃 처리 (선택 사항: 토큰 블랙리스트 등)
  async logout(token) {
    // 토큰 무효화 로직 구현
    return true;
  }

  // 비밀번호 해싱
  async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  // 비밀번호 비교
  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = AuthService; 