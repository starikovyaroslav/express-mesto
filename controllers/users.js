const User = require('../models/user');
const { ERR_BAD_REQUEST, ERR_DEFAULT, ERR_NOT_FOUND } = require('../errors/statusCode');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(ERR_DEFAULT).send({ message: `Произошла ошибка ${err}` }));
};

const getUserById = (req, res) => {
  User.findById(req.params._id)
    .orFail(new Error('InvalidId'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'InvalidId') {
        res.status(ERR_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Передан некорректный id' });
        return;
      }
      res.status(ERR_DEFAULT).send({ message: `Произошла ошибка ${err}` });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(ERR_DEFAULT).send({ message: `Произошла ошибка ${err}` });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .orFail(new Error('InvalidId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'InvalidId') {
        res.status(ERR_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Передан некорректный id' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      res.status(ERR_DEFAULT).send({ message: `Произошла ошибка ${err}` });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .orFail(new Error('InvalidId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'InvalidId') {
        res.status(ERR_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Передан некорректный id' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      res.status(ERR_DEFAULT).send({ message: `Произошла ошибка ${err}` });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
