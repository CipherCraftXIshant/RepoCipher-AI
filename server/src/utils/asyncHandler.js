function asyncHandler(handler) {
  return (req, res, next) => {
    handler(req, res).catch(next);
  };
}

module.exports = { asyncHandler };
