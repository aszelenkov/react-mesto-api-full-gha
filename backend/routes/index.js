const router = require('express').Router();
const { validateSignUp, validateSignIn } = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');
const routerUsers = require('./users');
const routerCards = require('./cards');

router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);
router.use('/users', auth, routerUsers);
router.use('/cards', auth, routerCards);
router.use('/*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
