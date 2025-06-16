// utils/ImageUploader.js
// multer를 이용한 이미지 업로드 처리
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

class ImageUploader {
  constructor(uploadDir = 'uploads/') {
    this.uploadDir = uploadDir;
    
    // 업로드 폴더가 없으면 생성
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    
    // multer 설정
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, this.uploadDir),
      filename: (req, file, cb) => cb(null, this.generateFileName(path.extname(file.originalname)))
    });
    
    // 업로드 미들웨어 생성
    this.upload = multer({ 
      storage: this.storage, 
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
      fileFilter: (req, file, cb) => {
        this.validateImageType(file) ? cb(null, true) : cb(new Error('Invalid image type'), false);
      }
    });
  }

  generateFileName(ext) {
    return `${uuidv4()}${ext}`;
  }

  validateImageType(file) {
    const allowed = ['image/jpeg', 'image/png', 'image/gif'];
    return allowed.includes(file.mimetype);
  }

  // 이미지 업로드 처리 (파일 -> URL)
  async uploadImage(file) {
    if (!file) {
      throw new Error('파일이 제공되지 않았습니다.');
    }
    
    if (!this.validateImageType(file)) {
      throw new Error('지원하지 않는 이미지 형식입니다.');
    }
    
    try {
      // 파일이 이미 업로드된 경우 경로만 반환
      if (file.path) {
        // 상대 URL 경로로 변환
        return '/' + file.path.replace(/\\/g, '/');
      }
      
      // 새로운 파일 저장 필요 시
      const fileName = this.generateFileName(path.extname(file.originalname));
      const filePath = path.join(this.uploadDir, fileName);
      
      // 파일 저장 (Node.js의 fs 모듈 사용)
      await fs.promises.writeFile(filePath, file.buffer);
      
      // 상대 URL 경로로 반환
      return '/' + filePath.replace(/\\/g, '/');
    } catch (error) {
      console.error('이미지 업로드 에러:', error);
      throw new Error('이미지 업로드에 실패했습니다.');
    }
  }

  // Express 미들웨어로 사용: single file upload
  saveImage() {
    return this.upload.single('image');
  }
}

module.exports = ImageUploader; 