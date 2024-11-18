const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const register = async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) return res.status(400).json({ message: 'Missing fields' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword, role });

        // Send verification email
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'your_email@gmail.com', pass: 'your_password' } });
        await transporter.sendMail({
            from: '"Secure File Sharing" <no-reply@file-sharing.com>',
            to: email,
            subject: 'Verify Your Email',
            html: `<a href="http://localhost:${process.env.PORT}/api/auth/verify/${token}">Verify Email</a>`,
        });

        res.status(201).json({ message: 'User registered, verify email to continue' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) return res.status(403).json({ message: 'Email not verified' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};

const verifyEmail = async (req, res) => {
    const token = req.params.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        user.isVerified = true;
        await user.save();
        res.json({ message: 'Email verified' });
    } catch (err) {
        res.status(500).json({ message: 'Verification failed', error: err.message });
    }
};

module.exports = { register, login, verifyEmail };
