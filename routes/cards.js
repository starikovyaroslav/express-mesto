const cardsRouter = require('express').Router();
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const { cardValidation, cardIdValidation } = require('../middlewares/validation');

cardsRouter.get('/', getCards);
cardsRouter.delete('/:id', cardIdValidation, deleteCard);
cardsRouter.post('/', cardValidation, createCard);
cardsRouter.put('/:id/likes', cardIdValidation, likeCard);
cardsRouter.delete('/:id/likes', cardIdValidation, dislikeCard);

module.exports = cardsRouter;
