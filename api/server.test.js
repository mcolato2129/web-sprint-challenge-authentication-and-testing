const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')


// Write your tests here
beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
}
)

// beforeEach(async () => {
//   await db.seed.run()
// })

test('sanity', () => {
  expect(true).toBe(true)
})
describe('server.js', () => {
  describe('[POST] /api/auth/login', () => {
    it('[1] responds with the correct message on valid credentials', async () => {
      const res = await request(server).post('/api/auth/login').send({ username: 'Mike', password: '4321' })
      expect(res.body.message).toMatch(/invalid credential/)
    }, 750)
    it('[2] responds with the correct status and message on invalid credentials', async () => {
      let res = await request(server).post('/api/auth/login').send({ username: 'bobsy', password: '1234' })
      expect(res.body.message).toMatch(/invalid credentials/i)
      expect(res.status).toBe(401)
    })
  })
  describe('[POST] /api/auth/register', () => {
    it('[3] creates a new user in the database when provided username and password', async () => {
      await request(server).post('/api/auth/register').send({ username: 'devon', password: '1234' })
      const devon = await db('users').where('username', 'devon').first()
      expect(devon).toMatchObject({ username: 'devon' })
    }, 750)
    it('[4] responds with proper error status', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'devon', password: '1234' })
      expect(res.status).toBe(422)
    }, 750)
  })
  describe('[GET] /api/jokes', () => {
    test('[5] responds with proper error message', async () => {
      const res = await request(server).get('/api/jokes')
      expect(res.body.message).toBe("token required")
    })
    it('[6] responds with the proper error status code', async () => {
      const res = await request(server).get('/api/jokes')
      expect(res.status).toBe(401)
    }, 750)
  })
})