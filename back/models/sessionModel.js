const { pool } = require('../utils/database');

// 새 세션 생성
const createSession = async (userId, refreshToken, expiresAt) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO climatch_session (user_id, refresh_token, expires_at) VALUES (?, ?, ?)',
      [userId, refreshToken, expiresAt]
    );
    
    return { 
      id: result.insertId,
      user_id: userId,
      refresh_token: refreshToken,
      expires_at: expiresAt
    };
  } catch (error) {
    console.error('세션 생성 오류:', error);
    throw error;
  }
};

// 리프레시 토큰으로 세션 조회
const getSessionByToken = async (refreshToken) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM climatch_session WHERE refresh_token = ?',
      [refreshToken]
    );
    
    return rows[0];
  } catch (error) {
    console.error('세션 조회 오류:', error);
    throw error;
  }
};

// 사용자 ID로 세션 조회
const getSessionsByUserId = async (userId) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM climatch_session WHERE user_id = ?',
      [userId]
    );
    
    return rows;
  } catch (error) {
    console.error('세션 목록 조회 오류:', error);
    throw error;
  }
};

// 만료된 세션 삭제
const deleteExpiredSessions = async () => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM climatch_session WHERE expires_at < NOW()'
    );
    
    return { deleted: result.affectedRows };
  } catch (error) {
    console.error('만료 세션 삭제 오류:', error);
    throw error;
  }
};

// 세션 삭제 (로그아웃)
const deleteSession = async (refreshToken) => {
  try {
    await pool.execute(
      'DELETE FROM climatch_session WHERE refresh_token = ?',
      [refreshToken]
    );
    
    return { success: true };
  } catch (error) {
    console.error('세션 삭제 오류:', error);
    throw error;
  }
};

// 사용자의 모든 세션 삭제 (전체 로그아웃)
const deleteAllUserSessions = async (userId) => {
  try {
    await pool.execute(
      'DELETE FROM climatch_session WHERE user_id = ?',
      [userId]
    );
    
    return { success: true };
  } catch (error) {
    console.error('사용자 세션 삭제 오류:', error);
    throw error;
  }
};

module.exports = {
  createSession,
  getSessionByToken,
  getSessionsByUserId,
  deleteExpiredSessions,
  deleteSession,
  deleteAllUserSessions
}; 