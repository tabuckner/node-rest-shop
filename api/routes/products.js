const express = require('express');
const router = express.Router();
const multer = require('multer');


/**
 * CONTROLLERS
 */
const ProductsController = require('../controllers/products');

/**
 * MIDDLEWARE // TODO: Move this shit to it's own file
 */
const checkAuth = require('../auth/check-auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  // Reject
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    // Accept
    cb(null, true);
  } else {
    cb(new Error('Filetype is not allowed.'), false);
  }
}
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

/**
 * ROUTES
 */
router.get('/', ProductsController.get_all);
router.post('/', checkAuth, upload.single('productImage'), ProductsController.create_product);
router.get('/:productId', ProductsController.get_product);
router.patch('/:productId', checkAuth, ProductsController.update_product);
router.delete('/:productId', checkAuth, ProductsController.delete_product);

module.exports = router;