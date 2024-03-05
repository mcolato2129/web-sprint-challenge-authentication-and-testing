const router = require('express').Router();
const User = require('./auth-model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { checkUserAndPassword, checkUsername, checkUsernameExists } = require('./auth-middleware')

router.post('/register',  checkUserAndPassword, checkUsername, (req, res, next) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
  const { username, password } = req.body
  const hash = bcrypt.hashSync(password, 8)
  User.add({ username: username.trim() , password: hash })
    .then(saved => {
      console.log(saved)
      res.status(201).json(saved)
    })
    .catch(err => {
      console.log(next(err))
    })
});

router.post('/login', checkUserAndPassword, checkUsernameExists, (req, res, next) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */

      if(bcrypt.compareSync(req.body.password, req.user.password)) {
        const token = buildToken(req.user)
        res.json({
          message: `welcome, ${req.user.username}`,
          token,
        })
      } else {
        res.status(422).json('incorrect password')
      }
});

function buildToken(user) {
  const payload = {
    username: user.username,
    password: user.password,
  }
  const options = {
    expiresIn: '1h',
  }
  return jwt.sign(payload,'yourSecretKey', options)
}

module.exports = router;
