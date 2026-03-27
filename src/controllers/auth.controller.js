import logger from '#config/logger.js';
import { signUpSchema, signInSchema } from '#validations/auth.validation.js';
import { formatValidationError } from '#utils/format.js';
import { createUser, signInUser } from '#services/auth.service.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const signup = async (req, res, next) => {
  try {
    const validation = signUpSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation Error',
        details: formatValidationError(validation.error),
      });
    }

    const { name, email, password, role } = validation.data;

    const user = await createUser({ name, email, password, role });

    const token = jwttoken.sign({ id: user.id, email, role });

    cookies.set(res, 'token', token);

    logger.info('User created successfully', { email });
    res.status(201).json({
      message: 'User created successfully',
      user: { id: user.id, name, email, role },
    });
  } catch (error) {
    logger.error('Error signing up', error);

    if (error.message.includes('User with this email already exists')) {
      return res.status(409).json({
        error: 'User with this email already exists',
      });
    }
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const validation = signInSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation Error',
        details: formatValidationError(validation.error),
      });
    }

    const { email, password } = validation.data;

    const user = await signInUser({ email, password });

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    logger.info('User signed in successfully', { email });
    res.status(200).json({
      message: 'User signed in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Error signing in', error);

    if (error.message === 'Invalid email or password') {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    cookies.clear(res, 'token');

    logger.info('User signed out successfully');
    res.status(200).json({
      message: 'User signed out successfully',
    });
  } catch (error) {
    logger.error('Error signing out', error);
    next(error);
  }
};
