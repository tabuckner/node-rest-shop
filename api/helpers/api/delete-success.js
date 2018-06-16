module.exports = (response, result, type) => {
  let title, request;
  switch (type.toLowerCase()) {
    case 'order':
      title = 'Order';
      request = {
        type: 'POST',
        url: 'http://localhost:3000/target',
        body: {
          productId: 'ID',
          quantity: 'Number'
        }
      };
      break;
    case 'product':
      title = 'Product';
      request = {
        type: 'POST',
        url: 'http://localhost:3000/products',
        body: {
          name: 'String',
          price: 'Number'
        }
      };
      break;
    default: 
      title = 'It was',
      request = result
  };
  return response.status(200).json({
    message: `${title} successfully deleted.`,
    request: request
  });
}
