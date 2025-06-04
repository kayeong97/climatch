const { pool } = require('../utils/database');

// 사용자 생성
const createUser = async (userData) => {
  try {
    const { username, password_hash, gender, birth_date, age, location } = userData;
    const [result] = await pool.execute(
      'INSERT INTO climatch_user (username, password_hash, gender, birth_date, age, location) VALUES (?, ?, ?, ?, ?, ?)',
      [username, password_hash, gender, birth_date, age, location]
    );
    return { id: result.insertId, ...userData };
  } catch (error) {
    console.error('사용자 생성 오류:', error);
    throw error;
  }
};

// 사용자명으로 사용자 조회
const getUserByUsername = async (username) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM climatch_user WHERE username = ?', [username]);
    return rows[0];
  } catch (error) {
    console.error('사용자 조회 오류:', error);
    throw error;
  }
};

// ID로 사용자 조회
const getUserById = async (id) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM climatch_user WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.error('사용자 조회 오류:', error);
    throw error;
  }
};

// 사용자 정보 업데이트
const updateUser = async (id, userData) => {
  try {
    const { gender, birth_date, age, location } = userData;
    await pool.execute(
      'UPDATE climatch_user SET gender = ?, birth_date = ?, age = ?, location = ? WHERE id = ?',
      [gender, birth_date, age, location, id]
    );
    return { id, ...userData };
  } catch (error) {
    console.error('사용자 업데이트 오류:', error);
    throw error;
  }
};

// 사용자 삭제
const deleteUser = async (id) => {
  try {
    await pool.execute('DELETE FROM climatch_user WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('사용자 삭제 오류:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  updateUser,
  deleteUser
}; 