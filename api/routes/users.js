const express = require('express');
const router = express.Router();

/**
 * MIDDLEWARE
 */
const checkAuth = require('../auth/check-auth');

/**
 * CONTROLLERS
 */
const UsersController = require('../controllers/users');

/**
 * ROUTES
 */
router.post('/signup', UsersController.create_user);
router.post('/login', UsersController.log_in);
router.delete('/:userId', checkAuth ,UsersController.delete_user); // TODO: Need to allow access to certain users.

module.exports = router;