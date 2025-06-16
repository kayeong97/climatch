// models/User.js
// 사용자 모델 정의
const { pool } = require('../utils/database');
const bcrypt = require('bcrypt');

class User {
  constructor({ id, username, passwordHash, gender, birthDate, location }) {
    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.gender = gender;
    this.birthDate = new Date(birthDate);
    this.location = location;
    this.age = this.getAge();
  }

  // 생년월일로부터 나이를 계산
  getAge() {
    const diff = Date.now() - this.birthDate.getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  }

  // 비밀번호 검증 (AuthService.comparePassword와 함께 사용)
  validatePassword(password, compareFunc) {
    return compareFunc(password, this.passwordHash);
  }

  // 사용자 생성
  static async create(userData) {
    const { username, email, password } = userData;
    
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
      const [result] = await pool.query(
        'INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())',
        [username, email, hashedPassword]
      );
      
      return { id: result.insertId, username, email };
    } catch (error) {
      console.error('사용자 생성 오류:', error);
      throw error;
    }
  }
  
  // ID로 사용자 찾기
  static async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('사용자 조회 오류:', error);
      throw error;
    }
  }
  
  // 사용자 정보 업데이트
  static async update(id, updateData) {
    const fields = Object.keys(updateData)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = [...Object.values(updateData), id];
    
    try {
      const [result] = await pool.query(
        `UPDATE users SET ${fields}, updated_at = NOW() WHERE id = ?`,
        values
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('사용자 업데이트 오류:', error);
      throw error;
    }
  }
  
  // 비밀번호 확인
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User; 