const express = require('express');
const { uploadFile, listFiles, generateDownloadLink, downloadFile } = require('../controllers/fileController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/upload', authMiddleware('OpsUser'), uploadFile);
router.get('/list', authMiddleware('ClientUser'), listFiles);
router.get('/generate-link/:id', authMiddleware('ClientUser'), generateDownloadLink);
router.get('/download/:token', authMiddleware('ClientUser'), downloadFile);

module.exports = router;
