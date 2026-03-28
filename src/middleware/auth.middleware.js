import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';

export const authMiddleware = (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ error: 'Unauthorized', message: 'No token provided' });
    }

    const decoded = jwttoken.verify(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication error', error);
    return res
      .status(401)
      .json({ error: 'Unauthorized', message: 'Invalid or expired token' });
  }
};
