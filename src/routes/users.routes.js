import express from 'express';
import {
  fetchAllUsers,
  fetchUserById,
  updateUserController,
  deleteUserController,
} from '#controllers/users.controller.js';
import { authMiddleware } from '#middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', fetchAllUsers);
router.get('/:id', fetchUserById);
router.put('/:id', updateUserController);
router.delete('/:id', deleteUserController);

export default router;
