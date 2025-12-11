import fs from "fs";
import path from "path";

import multer from "multer";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        let uploadPath;
        console.log('file', file.fieldname);
        switch (file.fieldname) {
            case "caregiver_image":
                uploadPath = path.join(process.cwd(), "uploads", "users", "caregiver");
                break;
            case "supervisor_image":
                uploadPath = path.join(process.cwd(), "uploads", "users", "supervisor");
                break;
            case "admin_image":
                uploadPath = path.join(process.cwd(), "uploads", "users", "admin");
                break;
            default:
                uploadPath = path.join(process.cwd(), "uploads", "other");
        }
        // uploadPath = path.join(process.cwd(), "uploads", "other");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename(req, file, cb) {

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const match = file.fieldname.match(/\d+\[(.+)\]/);
        if (match) {
            const prefix = match[1]; // e.g., "image"
            return cb(null, `${prefix}-${uniqueSuffix}${ext}`);
        }
        else {
            cb(null, file.fieldname + "-" + uniqueSuffix + ext);
        }
    },
});

export const uploadFile = multer({ storage });
export default uploadFile;
