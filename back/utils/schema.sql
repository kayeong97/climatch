-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  gender ENUM('male', 'female', 'other') DEFAULT NULL,
  birth_date DATE DEFAULT NULL,
  location VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 의류 아이템 테이블
CREATE TABLE IF NOT EXISTS clothing_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  category ENUM('top', 'bottom', 'outerwear', 'shoes', 'accessory') NOT NULL,
  type VARCHAR(50) NOT NULL,
  color VARCHAR(50) DEFAULT NULL,
  brand VARCHAR(100) DEFAULT NULL,
  image_path VARCHAR(255) DEFAULT NULL,
  weather_tags VARCHAR(255) DEFAULT NULL, -- 쉼표로 구분된 날씨 태그 (ex: 'rainy,cold,windy')
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 코디 아이템 테이블
CREATE TABLE IF NOT EXISTS outfits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT DEFAULT NULL,
  temperature_min INT DEFAULT NULL,
  temperature_max INT DEFAULT NULL,
  weather_condition VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 코디-의류 관계 테이블
CREATE TABLE IF NOT EXISTS outfit_items (
  outfit_id INT NOT NULL,
  clothing_id INT NOT NULL,
  PRIMARY KEY (outfit_id, clothing_id),
  FOREIGN KEY (outfit_id) REFERENCES outfits(id) ON DELETE CASCADE,
  FOREIGN KEY (clothing_id) REFERENCES clothing_items(id) ON DELETE CASCADE
); 