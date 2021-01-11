const express = require('express');
const errorController = require('../controllers/errorController');
const router = express.Router();
const postController = require('../controllers/postController');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');


router.use(authController.protect);

router.route('/post/crud')
    .post(postController.createPost)
    .get(postController.getAllPosts);

router.route('/post/crud/:id')
    .put(postController.updatePost)
    .delete(postController.deletePost)
    .get(postController.getPostById);

router.get('/user/crud/:id', userController.getUser);

router.get('/signin', errorController.error);
router.get('/signup', errorController.error);

module.exports = router;
