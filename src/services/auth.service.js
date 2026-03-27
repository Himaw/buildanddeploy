import bcrypt from 'bcrypt';
import logger from '#config/logger.js';
import database from '#config/database.js';
import { eq } from 'drizzle-orm';
import { users } from '#models/user.model.js';

const { db } = database;

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error('Error hashing password', error);
    throw new Error('Error hashing password', { cause: error });
  }
};

export const createUser = async ({ name, email, password, role }) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await hashPassword(password);

    const user = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        created_at: users.created_at,
      });
    logger.info('User created successfully', { user });
    return user;
  } catch (error) {
    logger.error('Error creating user', error);
    throw error;
  }
};

export const signInUser = async ({ email, password }) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = existingUser[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return user;
  } catch (error) {
    logger.error('Error signing in user', error);
    throw error;
  }
};
