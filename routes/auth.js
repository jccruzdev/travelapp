const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post(
  '/login',
  [body('email').normalizeEmail().trim().isEmail().withMessage('El email es incorrecto')],
  authController.postLogin
);
router.get('/signup', authController.getSignUp);
router.post(
  '/signup',
  [
    body('email').trim().normalizeEmail().isEmail().withMessage('El email es incorrecto'),

    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('La contraseña debe contener almenos 5 caracteres'),
    body('confirmPassword').trim(),
  ],
  authController.postSignUp
);
router.post('/logout', authController.postLogOut);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);
router.post('/newPassword', authController.postNewPassword);

module.exports = router;
