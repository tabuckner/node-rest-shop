const mongoose = require('mongoose');
const helpers = require('../helpers');

const Order = require('../models/order');
const Product = require('../models/product');

exports.get_all = (req, res, next) => {
  Order.find()
    .select('product quantity id')
    .populate('product', 'name price')
    .exec()
    .then(docs => {
      console.log(docs);
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + doc._id
            }
          }
        }),

      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

exports.create_new = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save()
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Order stored successfully.',
        createdOrder: {
          _id: result.id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders/' + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
};

exports.get_order = (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .populate('product')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found.'
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: 'GET', 
          url: 'http://localhost:3000/orders'
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    })
};

exports.delete_order = (req, res, next) => {
  const id = req.params.orderId;
  Order.findOneAndRemove({ _id: id })
    .exec()
    .then(result => {helpers.api.deleteSuccess(res, result, 'order')})
    .catch(err => {helpers.api.errorMessage(err, res)})
};