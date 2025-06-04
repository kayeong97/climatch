const { pool } = require('../utils/database');

// 새로운 날씨 기록 생성
const createWeatherHistory = async (weatherData) => {
  try {
    const { location, weather_temp, weather_condition } = weatherData;
    
    const [result] = await pool.execute(
      'INSERT INTO climatch_weather_history (location, weather_temp, weather_condition) VALUES (?, ?, ?)',
      [location, weather_temp, weather_condition]
    );
    
    return { id: result.insertId, ...weatherData, fetched_at: new Date() };
  } catch (error) {
    console.error('날씨 기록 생성 오류:', error);
    throw error;
  }
};

// 위치별 최신 날씨 조회
const getLatestWeatherByLocation = async (location) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM climatch_weather_history WHERE location = ? ORDER BY fetched_at DESC LIMIT 1',
      [location]
    );
    
    return rows[0];
  } catch (error) {
    console.error('최신 날씨 조회 오류:', error);
    throw error;
  }
};

// 위치별 날씨 기록 조회
const getWeatherHistoryByLocation = async (location, limit = 10) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM climatch_weather_history WHERE location = ? ORDER BY fetched_at DESC LIMIT ?',
      [location, limit]
    );
    
    return rows;
  } catch (error) {
    console.error('날씨 기록 조회 오류:', error);
    throw error;
  }
};

// 날짜별 날씨 기록 조회
const getWeatherHistoryByDate = async (location, date) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const [rows] = await pool.execute(
      'SELECT * FROM climatch_weather_history WHERE location = ? AND fetched_at BETWEEN ? AND ? ORDER BY fetched_at',
      [location, startOfDay, endOfDay]
    );
    
    return rows;
  } catch (error) {
    console.error('날짜별 날씨 기록 조회 오류:', error);
    throw error;
  }
};

// 오래된 날씨 기록 삭제 (기록 정리)
const deleteOldWeatherHistory = async (daysToKeep = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    const [result] = await pool.execute(
      'DELETE FROM climatch_weather_history WHERE fetched_at < ?',
      [cutoffDate]
    );
    
    return { deleted: result.affectedRows };
  } catch (error) {
    console.error('날씨 기록 삭제 오류:', error);
    throw error;
  }
};

module.exports = {
  createWeatherHistory,
  getLatestWeatherByLocation,
  getWeatherHistoryByLocation,
  getWeatherHistoryByDate,
  deleteOldWeatherHistory
}; 