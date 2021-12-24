const usersRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getUserData,
} = require('../controllers/users');

const {
  avatarValidation,
  userDataValidation,
  userIdValidation,
} = require('../middlewares/validation');

usersRouter.get('/', getUsers);
usersRouter.get('/:id', userIdValidation, getUserById);
usersRouter.get('/me', getUserData);
usersRouter.patch('/me', userDataValidation, updateProfile);
usersRouter.patch('/me/avatar', avatarValidation, updateAvatar);

module.exports = usersRouter;
