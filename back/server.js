const express = require('express');
const cors = require('cors');
const { testConnection } = require('./utils/database');
const userRoutes = require('./routes/userRoutes');
const outfitRoutes = require('./routes/outfitRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

// Express 앱 생성
const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors()); // CORS 활성화
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩

// 데이터베이스 연결 테스트
(async () => {
  await testConnection();
})();

// 기본 경로
app.get('/', (req, res) => {
  res.send('Climatch API가 실행 중입니다.');
});

// API 라우트 등록
app.use('/api/users', userRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/sessions', sessionRoutes);

// 404 에러 처리
app.use((req, res) => {
  res.status(404).json({ error: '요청하신 경로를 찾을 수 없습니다.' });
});

// 오류 처리 미들웨어
app.use((err, req, res, next) => {
  console.error('서버 오류:', err);
  res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

module.exports = app; 