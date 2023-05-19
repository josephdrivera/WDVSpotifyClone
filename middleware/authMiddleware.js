const jwt = require('jsonwebtoken');

const authMiddleware = (allowedRoles) => (req, res, next) => {
    const token = req.headers.authorization || req.query.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Add user from payload
        req.user = decoded;

        // Check if user has the required role
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Unauthorized access.' });
        }

        // Go to the next middleware
        next();
    } catch (err) {
        // Token is invalid
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
