const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
})

describe('when there are no users in db', () => {
  test('creating a user is successful', async () => {
    const newUser = {
      "blogs": [],
      "username": "Brooklyn",
      "name": "Dog",
      "password": "woof"
    }
    const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(200)

    const users = await helper.usersInDb()
    const usernames = users.map(user => user.username)
    expect(users.length).toEqual(1)
    expect(usernames).toContain('Brooklyn')
  })

  test('creating user with invalid username fails', async () => {
    const newUser = {
      "blogs": [],
      "username": "Br",
      "name": "Dog",
      "password": "woof"
    }
    const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

    expect(response.body.error).toContain('is shorter than the minimum allowed length')
  })

  test('creating user with invalid password fails', async () => {
    const newUser = {
      "blogs": [],
      "username": "Brooklyn",
      "name": "Dog",
      "password": "wf"
    }
    const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

    expect(response.body.error).toContain('password missing or')
  })
})

afterAll(() => {
  mongoose.connection.close()
})