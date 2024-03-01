const User = require('./auth-model')

async function checkUserAndPassword(req, res, next) {
    try {
      const { username, password } = req.body
      if(
        !username || 
        !username.trim() || 
        !password ) {
            res.status(422).json({ message: "username and password required" })
        } else {
            next()
        }
    } catch (err) {
      next(err)
    }
  }

  async function checkUsername(req, res, next) {
    try {
      const users = await User.findBy({ username: req.body.username })
      if (!users.length) {
        next()
      }
      else {
        res.status(422).json({ message: "username taken" })
      }
    } catch (err) {
      next(err)
    }
  }

  async function checkUsernameExists(req, res, next) {
    try {
      const users = await User.findBy({ username: req.body.username })
      if (users.length) {
        req.user = users[0]
        next()
      }
      else {
        res.status(401).json({ message: "invalid credentials"  })
      }
    } catch (err) {
      next(err)
    }
  }

  module.exports = {
    checkUserAndPassword,
    checkUsername,
    checkUsernameExists,
  }