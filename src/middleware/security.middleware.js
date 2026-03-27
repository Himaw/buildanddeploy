import aj from '#config/arcjet.js';
import { slidingWindow } from '@arcjet/node';
import logger from '#config/logger.js';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role;

    let limit;
    let message;

    switch (role) {
      case 'admin':
        limit = 20;
        message = 'Admin rate limit exceeded';
        break;
      case 'user':
        limit = 10;
        message = 'User rate limit exceeded';
        break;
      case 'guest':
        limit = 5;
        message = 'Guest rate limit exceeded';
        break;
    }

    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role} rate limit`,
      })
    );

    const decision = await client.protect(req);

    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Bot detected', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Automated requests are not allowed',
      });
    }

    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield triggered', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Automated requests are not allowed',
      });
    }

    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: message || 'Rate limit exceeded',
      });
    }

    next();
  } catch (error) {
    console.error('Arcjet error', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong in security middleware',
    });
  }
};

export default securityMiddleware;
