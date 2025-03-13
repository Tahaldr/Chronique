import express from 'express';
import { createReport, getAllReports } from '../controllers/report.controller.js';
import { protectedRoute, adminRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/createreport', protectedRoute, createReport);
router.get('/getreports', protectedRoute, adminRoute, getAllReports);

export default router;
