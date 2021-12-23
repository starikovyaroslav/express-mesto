const usersRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getUserData,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUserById);
usersRouter.get('/me', getUserData);
usersRouter.patch('/me', updateProfile);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
