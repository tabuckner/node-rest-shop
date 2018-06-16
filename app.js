const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

/**
 * ROUTE IMPORTS
 */
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

mongoose.connect('mongodb://tabuckner:'
  + process.env.MONGO_ATLAS_PW +
  '@cluster0-shard-00-00-xaene.mongodb.net:27017,cluster0-shard-00-01-xaene.mongodb.net:27017,cluster0-shard-00-02-xaene.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'
);

/**
 * MIDDLEWARE
 */
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELTE, GET');
    return res.status(200).json({});
  }
  next();
});

/**
 * ROUTES
 */
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

// Errors
app.use((req, res, next) => {
  const err = new Error('Not found.');
  err.status = 404;
  next(err);
})
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status);
  res.json({
    error: {
      message: err.message,
      status: status
    }
  });
})

module.exports = app;