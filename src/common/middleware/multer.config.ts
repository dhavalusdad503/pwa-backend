import fs from 'fs';
import path from 'path';

import multer from 'multer';

export const storage = multer.diskStorage({
  destination(req, file, cb) {
    let uploadPath;
    console.log('file', file.fieldname);
    switch (file.fieldname) {
      case 'caregiver_image':
        uploadPath = path.join(process.cwd(), 'uploads', 'users', 'caregiver');
        break;
      case 'supervisor_image':
        uploadPath = path.join(process.cwd(), 'uploads', 'users', 'supervisor');
        break;
      case 'admin_image':
        uploadPath = path.join(process.cwd(), 'uploads', 'users', 'admin');
        break;
      default:
        uploadPath = path.join(process.cwd(), 'uploads', 'others');
    }
    // uploadPath = path.join(process.cwd(), "uploads", "others");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const match = file.fieldname.match(/\d+\[(.+)\]/);
    if (match) {
      const prefix = match[1]; // e.g., "image"
      cb(null, `${prefix}-${uniqueSuffix}${ext}`);
      return;
    } else {
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  },
});
