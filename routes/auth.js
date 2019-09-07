const express = require('express');
const router = express.Router();

const User = require('../models/user')

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET home page */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post('/signup', (req, res, next) => {
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
    username: req.body.username,
    password: hashPass
  }).then(() => {
    res.redirect('/')
  })
});

router.post('/login', (req, res, next) => {

  User.findOne({ username: req.body.username }).then((user) => {
    // compareSync does these two lines and then compares with user.password (which is a hash)
    // const salt = bcrypt.genSaltSync(bcryptSalt);
    // const hashPass = bcrypt.hashSync(password, salt);
    if (bcrypt.compareSync(req.body.password, user.password)) {
      req.session.currentUser = user;
      res.redirect("/");
    }
  })

});

module.exports = router;
