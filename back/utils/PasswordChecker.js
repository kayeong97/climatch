// utils/PasswordChecker.js
// zxcvbn 기반 비밀번호 강도 체크 및 추천 생성
const zxcvbn = require('zxcvbn');

class PasswordChecker {
  // 비밀번호 강도 분석 결과 반환
  checkStrength(password) {
    const result = zxcvbn(password);
    
    // 강도 수준 문자열 변환 (0-4 → 문자열)
    let strengthLevel = '';
    switch(result.score) {
      case 0: strengthLevel = '매우 약함'; break;
      case 1: strengthLevel = '약함'; break;
      case 2: strengthLevel = '보통'; break;
      case 3: strengthLevel = '강함'; break;
      case 4: strengthLevel = '매우 강함'; break;
      default: strengthLevel = '알 수 없음';
    }
    
    return {
      score: result.score,
      strengthLevel,
      feedback: result.feedback,
      crackTime: result.crack_times_display,
    };
  }

  // 랜덤 비밀번호 생성 (각 문자가 독립적으로 랜덤)
  suggestPassword(length = 12) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}

module.exports = PasswordChecker; 