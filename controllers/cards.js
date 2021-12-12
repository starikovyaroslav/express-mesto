const Card = require('../models/card');
const { ERR_BAD_REQUEST, ERR_DEFAULT, ERR_NOT_FOUND } = require('../errors/statusCode');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(ERR_DEFAULT).send({ message: `Произошла ошибка ${err}` }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(ERR_DEFAULT).send({ message: `Произошла ошибка ${err}` });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .orFail(new Error('InvalidId'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'InvalidId') {
        res.status(ERR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при удалении карточки' });
        return;
      }
      res.status(ERR_DEFAULT).send({ message: `Произошла ошибка ${err}` });
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('InvalidId'))
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.message === 'InvalidId') {
      res.status(ERR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      return;
    }
    if (err.name === 'CastError') {
      res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
      return;
    }
    res.status(ERR_DEFAULT).send({ message: `Произошла ошибка ${err}` });
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('InvalidId'))
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.message === 'InvalidId') {
      res.status(ERR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      return;
    }
    if (err.name === 'CastError') {
      res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для удаления лайка' });
      return;
    }
    res.status(ERR_DEFAULT).send({ message: `Произошла ошибка ${err}` });
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
