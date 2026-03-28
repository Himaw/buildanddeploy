import logger from '#config/logger.js';
import { getAllUsers } from '#services/users.service.js';
import { getUserById } from '#services/users.service.js';
import { updateUser } from '#services/users.service.js';
import { deleteUser } from '#services/users.service.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      message: 'Users fetched successfully',
      users,
    });
  } catch (error) {
    logger.error('Error getting all users', error);
    next(error);
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    res.status(200).json({
      message: 'User fetched successfully',
      user,
    });
  } catch (error) {
    logger.error('Error getting user by ID', error);
    next(error);
  }
};

export const updateUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (String(req.user.id) !== String(id) && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not allowed to update this account',
      });
    }

    const { name, email, role } = req.body;
    const user = await updateUser(id, { name, email, role });
    res.status(200).json({
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    logger.error('Error updating user', error);
    next(error);
  }
};

export const deleteUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (String(req.user.id) !== String(id) && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not allowed to delete this account',
      });
    }

    const user = await deleteUser(id);
    res.status(200).json({
      message: 'User deleted successfully',
      user,
    });
  } catch (error) {
    logger.error('Error deleting user', error);
    next(error);
  }
};
