const routerCards = require('express').Router();
const cardsController = require('../controllers/cards');
const { validateCreateCard, validateCardId } = require('../middlewares/validate');

routerCards.get('/', cardsController.getCards);
routerCards.post('/', validateCreateCard, cardsController.createCard);
routerCards.delete('/:_id', validateCardId, cardsController.deleteCard);
routerCards.put('/:_id/likes', validateCardId, cardsController.likeCard);
routerCards.delete('/:_id/likes', validateCardId, cardsController.dislikeCard);

module.exports = routerCards;
