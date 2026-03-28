import logger from '#config/logger.js';
import database from '#config/database.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

const { db } = database;

export const getAllUsers = async () => {
  try {
    const allUsers = await db.select().from(users);
    return allUsers;
  } catch (error) {
    logger.error('Error getting all users', error);
    throw error;
  }
};

export const getUserById = async id => {
  try {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  } catch (error) {
    logger.error('Error getting user by ID', error);
    throw error;
  }
};

export const updateUser = async (id, { name, email, role }) => {
  try {
    const user = await db
      .update(users)
      .set({ name, email, role })
      .where(eq(users.id, id))
      .returning();
    return user;
  } catch (error) {
    logger.error('Error updating user', error);
    throw error;
  }
};

export const deleteUser = async id => {
  try {
    const user = await db.delete(users).where(eq(users.id, id)).returning();
    return user;
  } catch (error) {
    logger.error('Error deleting user', error);
    throw error;
  }
};
