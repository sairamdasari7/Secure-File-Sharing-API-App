const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['OpsUser', 'ClientUser'], required: true },
    isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
