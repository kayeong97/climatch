const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

// 사용자 회원가입
router.post('/register', userController.register);

// 사용자 로그인
router.post('/login', userController.login);

// 사용자 로그아웃
router.post('/logout', userController.logout);

// 현재 사용자 정보 조회 (인증 필요)
router.get('/me', authMiddleware, userController.getCurrentUser);

// 사용자 정보 업데이트 (인증 필요)
router.put('/profile', authMiddleware, userController.updateUserProfile);

module.exports = router; 