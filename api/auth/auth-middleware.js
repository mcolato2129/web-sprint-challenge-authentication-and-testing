const User = require('./auth-model')

async function checkUserAndPassword(req, res, next) {
    try {
      const { username, password } = req.body
      if(
        !username || 
        username.trim() === null || !
        password) {
            next({ message: "username and password required", status: 422 })
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
        next({ message: "username taken", status: 422 })
      }
    } catch (err) {
      next(err)
    }
  }

  module.exports = {
    checkUserAndPassword,
    checkUsername
  }