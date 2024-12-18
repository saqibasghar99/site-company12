import jwt from 'jsonwebtoken';

// Auth Middleware to verify JWT and check if the user is authenticated
export const authMiddleware = (req, res, next) => {
    // const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const secretKey = process.env.JWT_SECRET || 'fallback_secret_key';
        const decoded = jwt.verify(token, secretKey);
        // req.user = decoded.user;
        next();
    } catch (error) {
        console.error('JWT verification error:', error.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};