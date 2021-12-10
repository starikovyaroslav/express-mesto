const usersRouter = require('express').Router();
const { getUsers, getUserById, createUser } = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUserById);
usersRouter.post('/', createUser);
/* usersRouter.patch('/me', updateProfile);
usersRouter.patch('/me/avatar', updateAvatar); */

module.exports = usersRouter;
