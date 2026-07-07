import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Utiliser process.cwd() pour cibler toujours le dossier uploads à la racine du projet
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });
