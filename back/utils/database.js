const mysql = require('mysql2/promise');
require('dotenv').config();

// MariaDB 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'climatch',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 데이터베이스 연결 테스트 및 초기 설정
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('데이터베이스 연결 성공!');
    
    // climatch 데이터베이스가 없으면 생성
    await connection.query('CREATE DATABASE IF NOT EXISTS climatch');
    
    // climatch 데이터베이스 선택
    await connection.query('USE climatch');
    
    // 사용자 테이블 생성
    await connection.query(`
      CREATE TABLE IF NOT EXISTS climatch_user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        gender VARCHAR(10),
        birth_date DATE,
        age INT,
        location VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 세션 테이블 생성
    await connection.query(`
      CREATE TABLE IF NOT EXISTS climatch_session (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES climatch_user(id) ON DELETE CASCADE
      )
    `);
    
    // 날씨 기록 테이블 생성
    await connection.query(`
      CREATE TABLE IF NOT EXISTS climatch_weather_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        location VARCHAR(50) NOT NULL,
        temperature FLOAT NOT NULL,
        \`condition\` VARCHAR(50) NOT NULL,
        humidity INT,
        wind_speed FLOAT,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 의상 테이블 생성
    await connection.query(`
      CREATE TABLE IF NOT EXISTS climatch_outfit (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        weather_id INT,
        top_type VARCHAR(50),
        bottom_type VARCHAR(50),
        outer_type VARCHAR(50),
        accessory VARCHAR(100),
        image_url VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES climatch_user(id) ON DELETE CASCADE,
        FOREIGN KEY (weather_id) REFERENCES climatch_weather_history(id) ON DELETE SET NULL
      )
    `);
    
    connection.release();
    return true;
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error);
    return false;
  }
};

module.exports = {
  pool,
  testConnection
}; 