const express = require('express');
const router = express.Router();
const { createSession, deleteSession } = require('../models/sessionModel');
const authMiddleware = require('../middlewares/auth');

// 세션 생성 (로그인)
router.post('/', async (req, res) => {
  try {
    const { userId, token } = req.body;
    
    if (!userId || !token) {
      return res.status(400).json({ error: '사용자 ID와 토큰이 필요합니다.' });
    }
    
    const session = await createSession(userId, token);
    res.status(201).json({ success: true, session });
  } catch (error) {
    console.error('세션 생성 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 세션 삭제 (로그아웃)
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    await deleteSession(token);
    res.status(200).json({ success: true, message: '로그아웃 되었습니다.' });
  } catch (error) {
    console.error('세션 삭제 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router; 