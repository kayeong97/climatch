const sessionModel = require('../models/sessionModel');
const jwt = require('jsonwebtoken');

// JWT 비밀키 (실제로는 환경 변수에서 가져오는 것이 좋습니다)
const JWT_SECRET = process.env.JWT_SECRET || 'climatch-secret-key';
const JWT_EXPIRES_IN = '1h';

// 리프레시 토큰으로 액세스 토큰 재발급
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: '리프레시 토큰이 필요합니다.' });
    }

    // 세션 DB에서 리프레시 토큰 조회
    const session = await sessionModel.getSessionByToken(refreshToken);
    if (!session) {
      return res.status(401).json({ error: '유효하지 않은 리프레시 토큰입니다.' });
    }

    // 토큰 만료 확인
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
      await sessionModel.deleteSession(refreshToken);
      return res.status(401).json({ error: '만료된 리프레시 토큰입니다.' });
    }

    try {
      // 리프레시 토큰 검증
      const decoded = jwt.verify(refreshToken, JWT_SECRET);
      
      if (decoded.tokenType !== 'refresh' || decoded.userId !== session.user_id) {
        return res.status(401).json({ error: '유효하지 않은 리프레시 토큰입니다.' });
      }

      // 새 액세스 토큰 발급
      const newAccessToken = jwt.sign(
        { userId: decoded.userId },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.status(200).json({
        message: '토큰이 재발급되었습니다.',
        accessToken: newAccessToken
      });
    } catch (error) {
      console.error('토큰 검증 오류:', error);
      return res.status(401).json({ error: '유효하지 않은 리프레시 토큰입니다.' });
    }
  } catch (error) {
    console.error('토큰 재발급 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 사용자의 모든 세션 조회
const getUserSessions = async (req, res) => {
  try {
    // JWT 미들웨어를 통해 전달된 사용자 ID
    const userId = req.user.userId;
    
    const sessions = await sessionModel.getSessionsByUserId(userId);
    
    // 리프레시 토큰은 보안을 위해 제외
    const sanitizedSessions = sessions.map(session => ({
      id: session.id,
      issued_at: session.issued_at,
      expires_at: session.expires_at
    }));
    
    res.status(200).json({ sessions: sanitizedSessions });
  } catch (error) {
    console.error('세션 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 사용자의 모든 세션 삭제 (모든 기기에서 로그아웃)
const logoutAllSessions = async (req, res) => {
  try {
    // JWT 미들웨어를 통해 전달된 사용자 ID
    const userId = req.user.userId;
    
    await sessionModel.deleteAllUserSessions(userId);
    
    res.status(200).json({ message: '모든 세션에서 로그아웃되었습니다.' });
  } catch (error) {
    console.error('세션 삭제 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 만료된 세션 정리 (관리자용)
const cleanupExpiredSessions = async (req, res) => {
  try {
    // 관리자 권한 확인 로직이 필요할 수 있습니다.
    
    const result = await sessionModel.deleteExpiredSessions();
    
    res.status(200).json({
      message: '만료된 세션이 정리되었습니다.',
      deleted: result.deleted
    });
  } catch (error) {
    console.error('세션 정리 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

module.exports = {
  refreshToken,
  getUserSessions,
  logoutAllSessions,
  cleanupExpiredSessions
}; 