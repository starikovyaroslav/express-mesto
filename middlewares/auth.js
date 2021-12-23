const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new NotAuthError('Авторизуйтесь, пожалуйста');
  }
  req.user = payload;
  next();
};
