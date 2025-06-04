const { pool } = require('../utils/database');

// 새로운 의상 생성
const createOutfit = async (outfitData) => {
  try {
    const { 
      user_id, top_color, style, image_url, 
      weather_temp, weather_condition, user_age,
      is_recommended 
    } = outfitData;
    
    const [result] = await pool.execute(
      `INSERT INTO climatch_outfit 
       (user_id, top_color, style, image_url, weather_temp, weather_condition, user_age, is_recommended) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, top_color, style, image_url, weather_temp, weather_condition, user_age, is_recommended || 0]
    );
    
    return { id: result.insertId, ...outfitData };
  } catch (error) {
    console.error('의상 생성 오류:', error);
    throw error;
  }
};

// ID로 의상 조회
const getOutfitById = async (id) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM climatch_outfit WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.error('의상 조회 오류:', error);
    throw error;
  }
};

// 사용자 ID로 의상 목록 조회
const getOutfitsByUserId = async (userId) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM climatch_outfit WHERE user_id = ?', [userId]);
    return rows;
  } catch (error) {
    console.error('의상 목록 조회 오류:', error);
    throw error;
  }
};

// 날씨 조건으로 의상 목록 조회
const getOutfitsByWeather = async (temperature, condition) => {
  try {
    const tempRange = 5; // 온도 범위 설정 (±5도)
    
    const [rows] = await pool.execute(
      `SELECT * FROM climatch_outfit 
       WHERE weather_temp BETWEEN ? - ? AND ? + ? 
       AND weather_condition LIKE ?`,
      [temperature, tempRange, temperature, tempRange, `%${condition}%`]
    );
    
    return rows;
  } catch (error) {
    console.error('날씨 기반 의상 조회 오류:', error);
    throw error;
  }
};

// 의상 추천 상태 업데이트
const updateOutfitRecommendation = async (id, isRecommended) => {
  try {
    await pool.execute(
      'UPDATE climatch_outfit SET is_recommended = ? WHERE id = ?',
      [isRecommended ? 1 : 0, id]
    );
    
    return { id, is_recommended: isRecommended };
  } catch (error) {
    console.error('의상 추천 상태 업데이트 오류:', error);
    throw error;
  }
};

// 의상 업데이트
const updateOutfit = async (id, outfitData) => {
  try {
    const { 
      top_color, style, image_url, 
      weather_temp, weather_condition, user_age
    } = outfitData;
    
    await pool.execute(
      `UPDATE climatch_outfit 
       SET top_color = ?, style = ?, image_url = ?, 
           weather_temp = ?, weather_condition = ?, user_age = ?
       WHERE id = ?`,
      [top_color, style, image_url, weather_temp, weather_condition, user_age, id]
    );
    
    return { id, ...outfitData };
  } catch (error) {
    console.error('의상 업데이트 오류:', error);
    throw error;
  }
};

// 의상 삭제
const deleteOutfit = async (id) => {
  try {
    await pool.execute('DELETE FROM climatch_outfit WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('의상 삭제 오류:', error);
    throw error;
  }
};

module.exports = {
  createOutfit,
  getOutfitById,
  getOutfitsByUserId,
  getOutfitsByWeather,
  updateOutfitRecommendation,
  updateOutfit,
  deleteOutfit
}; 