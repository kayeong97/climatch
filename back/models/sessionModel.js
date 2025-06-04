const { pool } = require('../utils/database');

// 세션 테이블 생성 확인
const initSessionTable = async () => {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS climatch_session (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES climatch_user(id) ON DELETE CASCADE
      )
    `);
  } catch (error) {
    console.error('세션 테이블 초기화 오류:', error);
  }
};

// 초기화 실행
(async () => {
  try {
    await initSessionTable();
  } catch (error) {
    console.error('세션 모델 초기화 실패:', error);
  }
})();

// 세션 생성
const createSession = async (userId, token, expiresIn = 30 * 24 * 60 * 60 * 1000) => {
  try {
    const expiresAt = new Date(Date.now() + expiresIn);
    
    const [result] = await pool.execute(
      'INSERT INTO climatch_session (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userId, token, expiresAt]
    );
    
    return {
      id: result.insertId,
      userId,
      token,
      expiresAt
    };
  } catch (error) {
    console.error('세션 생성 오류:', error);
    throw error;
  }
};

// 세션 삭제
const deleteSession = async (token) => {
  try {
    await pool.execute('DELETE FROM climatch_session WHERE token = ?', [token]);
    return true;
  } catch (error) {
    console.error('세션 삭제 오류:', error);
    throw error;
  }
};

// 토큰으로 세션 조회
const getSessionByToken = async (token) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM climatch_session WHERE token = ? AND expires_at > NOW()',
      [token]
    );
    
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('세션 조회 오류:', error);
    throw error;
  }
};

// 사용자의 모든 세션 삭제
const deleteUserSessions = async (userId) => {
  try {
    await pool.execute('DELETE FROM climatch_session WHERE user_id = ?', [userId]);
    return true;
  } catch (error) {
    console.error('사용자 세션 삭제 오류:', error);
    throw error;
  }
};

module.exports = {
  createSession,
  deleteSession,
  getSessionByToken,
  deleteUserSessions
}; 