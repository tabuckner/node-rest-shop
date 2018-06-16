const mongoose = require('mongoose');

const Product = require('../models/product');


exports.get_all = (req, res, next) => {
  Product.find()
    .select('name price _id productImage') // Fetch only these fields
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + doc._id // TODO: replace with base url.
            }
          }
        })
      }
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
};

exports.create_product = (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product.save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: 'Created product successfully.',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + result._id // TODO: replace with base url.
          }
        }
      });
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      });
    });
};

exports.get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            description: 'Get all products',
            url: 'http://localhost:3000/products'
          }
        })
      } else {
        res.status(404).json({
          message: 'No data found for this id. Please check the ID.'
        })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
};

exports.update_product = (req, res, next) => { // FIXME: This method is not working.
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value; // TODO: Learn more about this syntax
  }
  console.log(updateOps);
  console.log(id);
  Product.update({
      _id: id
    }, {
      $set: updateOps
    })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Product updated successfully.',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + id
        }
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
  // res.status(200).json({
  //   message: 'Updated product.'
  // });
};

exports.delete_product = (req, res, next) => {
  const id = req.params.productId
  Product.findOneAndRemove({
      _id: id
    })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Product deleted successfully.',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products',
          body: {
            name: 'String',
            price: 'Number'
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};