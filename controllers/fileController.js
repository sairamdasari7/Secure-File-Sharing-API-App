const multer = require('multer');
const path = require('path');
const File = require('../models/File');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 
                              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only pptx, docx, xlsx allowed.'));
        }
    },
}).single('file');

// Upload file (OpsUser only)
const uploadFile = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ message: err.message });

        try {
            const file = await File.create({
                filename: req.file.filename,
                uploadedBy: req.user.id,
                fileType: path.extname(req.file.originalname).substring(1),
            });
            res.status(201).json({ message: 'File uploaded successfully', file });
        } catch (error) {
            res.status(500).json({ message: 'File upload failed', error: error.message });
        }
    });
};

// List all uploaded files (ClientUser)
const listFiles = async (req, res) => {
    try {
        const files = await File.find().populate('uploadedBy', 'email role');
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching files', error: error.message });
    }
};

// Generate encrypted download link
const generateDownloadLink = async (req, res) => {
    const { id } = req.params;
    try {
        const file = await File.findById(id);
        if (!file) return res.status(404).json({ message: 'File not found' });

        const token = jwt.sign({ fileId: file.id, userId: req.user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const downloadLink = `http://localhost:${process.env.PORT}/api/files/download/${token}`;

        res.json({ 'download-link': downloadLink, message: 'success' });
    } catch (error) {
        res.status(500).json({ message: 'Error generating link', error: error.message });
    }
};

// Download file
const downloadFile = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const file = await File.findById(decoded.fileId);
        if (!file || decoded.userId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.download(path.join(__dirname, '../uploads', file.filename));
    } catch (error) {
        res.status(500).json({ message: 'Download failed', error: error.message });
    }
};

module.exports = { uploadFile, listFiles, generateDownloadLink, downloadFile };
