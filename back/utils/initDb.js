require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('./database');

async function initializeDatabase() {
  try {
    // 데이터베이스 연결 체크
    const connection = await pool.getConnection();
    console.log('데이터베이스에 연결되었습니다.');

    // 스키마 파일 읽기
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // 스키마 파일 내 각 SQL 문 실행
    const statements = schema
      .split(';')
      .filter(statement => statement.trim() !== '');

    for (const statement of statements) {
      await connection.query(statement + ';');
    }

    console.log('데이터베이스 테이블이 성공적으로 생성되었습니다.');
    connection.release();
    return true;
  } catch (error) {
    console.error('데이터베이스 초기화 오류:', error);
    return false;
  }
}

// 스크립트가 직접 실행될 때만 초기화 함수 호출
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { initializeDatabase }; 