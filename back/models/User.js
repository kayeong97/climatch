// models/User.js
// 사용자 모델 정의
class User {
  constructor({ id, passwordHash, gender, birthDate, location }) {
    this.id = id;
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
}

module.exports = User; 