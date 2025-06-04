const jwt = require('jsonwebtoken');

// JWT 비밀키
const JWT_SECRET = process.env.JWT_SECRET || 'climatch-secret-key';

// 토큰 검증 미들웨어
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: '인증 토큰이 필요합니다.' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('토큰 검증 오류:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: '토큰이 만료되었습니다.' });
    }
    
    return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
  }
};

module.exports = verifyToken; 