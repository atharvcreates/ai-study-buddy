import express from 'express';
import multer from 'multer';
import { uploadPdf } from '../controllers/pdfController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', protect, upload.single('pdf'), uploadPdf);

export default router;
