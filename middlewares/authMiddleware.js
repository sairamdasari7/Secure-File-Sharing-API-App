const jwt = require('jsonwebtoken');

const authMiddleware = (role) => (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        if (role && req.user.role !== role) {
            return res.status(403).json({ message: 'Access denied' });
        }

        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
