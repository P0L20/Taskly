import {express} from 'express'
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');

router.get('/', getSettings);    // GET /api/settings
router.put('/', updateSettings); // PUT /api/settings

module.exports = router;