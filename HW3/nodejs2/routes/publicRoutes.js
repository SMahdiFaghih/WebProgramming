const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const postController = require('./../controllers/postController');


router.post('/signin', authController.login);
router.post('/signup', authController.signup);
router.get('/post', postController.getAllPosts);

module.exports = router;