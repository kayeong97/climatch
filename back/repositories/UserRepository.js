// repositories/UserRepository.js
// 사용자 데이터 접근 계층 (임시 in-memory 구현)
class UserRepository {
  constructor() {
    this.users = new Map(); // 임시 저장용 (실제 구현은 DB 사용)
  }

  async create(userData) {
    const id = userData.id;
    if (this.users.has(id)) {
      throw new Error('User already exists');
    }
    this.users.set(id, userData);
    return userData;
  }

  async findById(id) {
    const user = this.users.get(id);
    if (!user) return null;
    return user;
  }

  async update(id, userData) {
    if (!this.users.has(id)) {
      throw new Error('User not found');
    }
    const updatedUser = { ...this.users.get(id), ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async delete(id) {
    if (!this.users.has(id)) {
      throw new Error('User not found');
    }
    return this.users.delete(id);
  }
}

module.exports = UserRepository; 