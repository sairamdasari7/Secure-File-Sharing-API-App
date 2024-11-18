const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileType: { type: String, enum: ['pptx', 'docx', 'xlsx'], required: true },
});

module.exports = mongoose.model('File', fileSchema);
