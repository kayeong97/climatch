// utils/PasswordChecker.js
// zxcvbn 기반 비밀번호 강도 체크 및 추천 생성
const zxcvbn = require('zxcvbn');

class PasswordChecker {
  // 비밀번호 강도 분석 결과 반환
  static checkStrength(password) {
    const result = zxcvbn(password);
    return {
      score: result.score,
      feedback: result.feedback,
      crackTime: result.crack_times_display,
    };
  }

  // 간단 랜덤 비밀번호 생성 (샘플)
  static suggestPassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let pwd = '';
    for (let i = 0; i < 12; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    return pwd;
  }
}

module.exports = PasswordChecker; 