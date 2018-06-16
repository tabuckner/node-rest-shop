module.exports = (error, response) => {
  console.warn(error);
  return response.status(500).json({
    error: error
  });
}
