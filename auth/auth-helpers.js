const bcrypt = require('bcryptjs');

const models = require('../models/index');

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function loginRedirect(req, res, next) {
  if (req.user) return res.status(401).json(
    { status: 'You are already logged in' }
  );

  return next();
}

function createUser(req, res) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);

  return models.User.create({
    username: req.body.username,
    password: hash,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  }).then(() => {
    res.redirect('/messages');
  });
}

function loginRequired(req, res, next) {
  if (!req.user) return res.redirect('/auth/login');

  return next();
}

module.exports = {
  comparePass,
  loginRedirect,
  loginRequired,
  createUser
}
