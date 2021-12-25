const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при создании карточки');
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(new NotFoundError('Карточка с указанным id не найдена'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
      return card.remove();
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные при удалении карточки');
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(new NotFoundError('Карточка с указанным id не найдена'))
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new ValidationError('Переданы некорректные данные для постановки лайка');
    }
  })
  .catch(next);

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.id,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(new NotFoundError('Карточка с указанным id не найдена'))
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new ValidationError({ message: 'Переданы некорректные данные для удаления лайка' });
    }
  })
  .catch(next);

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
