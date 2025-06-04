const weatherHistoryModel = require('../models/weatherHistoryModel');

// 날씨 정보 저장
const saveWeatherData = async (req, res) => {
  try {
    const { location, weather_temp, weather_condition } = req.body;

    // 필수 필드 확인
    if (!location || weather_temp === undefined || !weather_condition) {
      return res.status(400).json({ error: '위치, 온도, 날씨 상태는 필수입니다.' });
    }

    // 날씨 정보 저장
    const weatherData = await weatherHistoryModel.createWeatherHistory({
      location,
      weather_temp,
      weather_condition
    });

    res.status(201).json({
      message: '날씨 정보가 저장되었습니다.',
      weather: weatherData
    });
  } catch (error) {
    console.error('날씨 정보 저장 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 위치 기반 최신 날씨 정보 조회
const getLatestWeather = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ error: '위치 정보가 필요합니다.' });
    }

    const weatherData = await weatherHistoryModel.getLatestWeatherByLocation(location);

    if (!weatherData) {
      return res.status(404).json({ error: '해당 위치의 날씨 정보를 찾을 수 없습니다.' });
    }

    res.status(200).json({ weather: weatherData });
  } catch (error) {
    console.error('날씨 정보 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 위치 기반 날씨 기록 조회
const getWeatherHistory = async (req, res) => {
  try {
    const { location, limit } = req.query;

    if (!location) {
      return res.status(400).json({ error: '위치 정보가 필요합니다.' });
    }

    const weatherHistory = await weatherHistoryModel.getWeatherHistoryByLocation(
      location,
      limit ? parseInt(limit) : 10
    );

    res.status(200).json({ history: weatherHistory });
  } catch (error) {
    console.error('날씨 기록 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 날짜별 날씨 기록 조회
const getWeatherByDate = async (req, res) => {
  try {
    const { location, date } = req.query;

    if (!location || !date) {
      return res.status(400).json({ error: '위치와 날짜 정보가 필요합니다.' });
    }

    const weatherData = await weatherHistoryModel.getWeatherHistoryByDate(location, date);

    res.status(200).json({ weather: weatherData });
  } catch (error) {
    console.error('날짜별 날씨 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 오래된 날씨 기록 정리
const cleanupWeatherHistory = async (req, res) => {
  try {
    const { days } = req.query;
    
    const result = await weatherHistoryModel.deleteOldWeatherHistory(
      days ? parseInt(days) : 30
    );

    res.status(200).json({
      message: '오래된 날씨 기록이 정리되었습니다.',
      deleted: result.deleted
    });
  } catch (error) {
    console.error('날씨 기록 정리 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

module.exports = {
  saveWeatherData,
  getLatestWeather,
  getWeatherHistory,
  getWeatherByDate,
  cleanupWeatherHistory
};