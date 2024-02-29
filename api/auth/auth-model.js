const db = require('../../data/dbConfig')

function getAll() {
    return db('users')
}

function findBy(filter) {
    return db('users').where(filter)
  }

async function findById(id) {
    const user = await db('users')
      .select('id', 'username', 'password')
      .where('id', id).first()

    const registeredUser = {
        id: user[0],
        username: user[0].username,
        password: user[0].password
    }

    return registeredUser
  }

async function add(user) {
    const [id] = await db('users').insert(user)
    return findById(id)
}


module.exports = {
    getAll,
    findBy,
    findById,
    add
}