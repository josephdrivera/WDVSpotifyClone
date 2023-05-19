const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization || req.query.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    try {
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // add user from payload
        req.user = decoded;
        // go to next middleware
        next();
    } catch (err) {
        // token is invalid
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;