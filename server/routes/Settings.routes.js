import express from 'express'
const router = express.Router();
import { getSettings, updateSettings } from '../controllers/Settings.controller.js';

router.get('/', getSettings);    // GET /api/settings
router.put('/', updateSettings); // PUT /api/settings

export default router