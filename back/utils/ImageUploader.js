// utils/ImageUploader.js
// multer를 이용한 이미지 업로드 처리
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class ImageUploader {
  constructor(uploadDir = 'uploads/') {
    this.uploadDir = uploadDir;
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, this.uploadDir),
      filename: (req, file, cb) => cb(null, this.generateFileName(path.extname(file.originalname)))
    });
    this.upload = multer({ storage: this.storage, fileFilter: (req, file, cb) => {
      this.validateImageType(file) ? cb(null, true) : cb(new Error('Invalid image type'), false);
    }});
  }

  generateFileName(ext) {
    return `${uuidv4()}${ext}`;
  }

  validateImageType(file) {
    const allowed = ['image/jpeg', 'image/png', 'image/gif'];
    return allowed.includes(file.mimetype);
  }

  // Express 미들웨어로 사용: single file upload
  saveImage() {
    return this.upload.single('image');
  }
}

module.exports = ImageUploader; 