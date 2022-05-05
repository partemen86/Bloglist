const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  const newUser = {
    "blogs": [],
    "username": "Brooklyn",
    "name": "Dog",
    "password": "woof"
  }
  await api
  .post('/api/users')
  .send(newUser)

  const user = await User.find({})
  const id = user[0]._id

  const blogs = helper.initialBlogs.map(blog => {
    blog.user = id
    return new Blog(blog)
  })

  const promiseArray = blogs.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blog posts have an id attribute', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  blogs.forEach(blog => expect(blog.id).toBeDefined())
})

test('a new blog can be created', async () => {
  const token = await helper.getUserToken("Brooklyn", "woof")

  const newBlog = {
    author: 'myself',
    title: 'testing POST API',
    url: 'localhost',
    likes: '1',
  }

  await api
    .post('/api/blogs')
    .set('authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(blog => blog.title)
  expect(titles).toContain('testing POST API')
})

test('if likes field is missing, it defaults to 0', async () => {
  const token = await helper.getUserToken("Brooklyn", "woof")

  const newBlog = {
    author: 'myself',
    title: 'testing POST API',
    url: 'localhost',
  }

  await api
    .post('/api/blogs')
    .set('authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  
    const likes = blogsAtEnd.map(blog => blog.likes).filter(val => val === 0)
    expect(likes).toHaveLength(2)  
})

test('POST requests missing title or url return status 400', async () => {
  const token = await helper.getUserToken("Brooklyn", "woof")
  const newBlog = {
    author: 'myself',
    url: 'localhost',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .set('authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const anotherNewBlog = {
    author: 'myself',
    title: 'testing POST API',
    likes: 7
  }

  await api
    .post('/api/blogs')
    .set('authorization', `bearer ${token}`)
    .send(anotherNewBlog)
    .expect(400)
})

test('POST requests with missing or incorrect auth token fail', async () => {
  const newBlog = {
    title: 'this should fail',
    author: 'myself',
    url: 'localhost',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const token = await helper.getUserToken("test", "fails")

  const anotherNewBlog = {
    title: 'this should also fail',
    author: 'myself',
    title: 'testing POST API',
    likes: 7
  }

  await api
    .post('/api/blogs')
    .set('authorization', `bearer ${token}`)
    .send(anotherNewBlog)
    .expect(401)
})

test('a specific blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToBeDeleted = blogsAtStart[0]
  const token = await helper.getUserToken("Brooklyn", "woof")

  await api
    .delete(`/api/blogs/${blogToBeDeleted.id}`)
    .set('authorization', `bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(r => r.title)

  expect(titles).not.toContain(blogToBeDeleted.title)
})

test('blogs can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToBeUpdated = blogsAtStart[0]
  const oldTitle = blogsAtStart[0].title
  const newBlogTitle = { title: 'A new title' }

  await api
    .put(`/api/blogs/${blogToBeUpdated.id}`)
    .send(newBlogTitle)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map(blog => blog.title)
  expect(titles).not.toContain(oldTitle)
  expect(titles).toContain(newBlogTitle.title)
})

afterAll(() => {
  mongoose.connection.close()
})