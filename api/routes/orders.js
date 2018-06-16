const express = require('express');
const router = express.Router();


/**
 * MIDDLEWARE
 */
const checkAuth = require('../auth/check-auth');

/**
 * CONTROLLERS
 */
const OrdersController = require('../controllers/orders');

/**
 * ROUTES
 */
router.get('/', checkAuth, OrdersController.get_all);
router.post('/', checkAuth, OrdersController.create_new);
router.get('/:orderId', checkAuth, OrdersController.get_order);
router.delete('/:orderId', checkAuth, OrdersController.delete_order);

module.exports = router;