const router = require('express').Router();
const userController = require('../controllers/user');

router.get('/login', userController.getLogin);
router.get('/register', userController.getRegister);
router.get('/logout', userController.getLogout);
router.get('/profile/:id', userController.getProfile);
router.post('/refill/:id', userController.postRefill);

router.post('/register', userController.postRegister);
router.post('/login', userController.postLogin);


module.exports = router;