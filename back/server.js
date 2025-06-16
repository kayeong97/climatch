require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./utils/database.js');
const userRoutes = require('./routes/userRoutes.js');
const outfitRoutes = require('./routes/outfitRoutes.js');
const weatherRoutes = require('./routes/weatherRoutes.js');
const sessionRoutes = require('./routes/sessionRoutes.js');
const recommendationRoutes = require('./routes/recommendationRoutes.js');

// Express 앱 생성
const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 데이터베이스 연결 및 서버 시작
(async () => {
  const connected = await testConnection();
  if (connected) {
    console.log('데이터베이스 연결 성공! 서버를 시작합니다.');
    
    // 기본 경로
    app.get('/', (req, res) => {
      res.send('Climatch API가 실행 중입니다.');
    });

    // API 라우트 등록
    app.use('/api/users', userRoutes);
    app.use('/api/outfits', outfitRoutes);
    app.use('/api/weather', weatherRoutes);
    app.use('/api/sessions', sessionRoutes);
    app.use('/api', recommendationRoutes);

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
  } else {
    console.error('데이터베이스 연결 실패. 서버를 종료합니다.');
    process.exit(1);
  }
})(); 