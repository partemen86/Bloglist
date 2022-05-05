const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const user = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {username: 1, name: 1})
  response.json(blog)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const user = request.user

  if (!user) { return response.status(401).json({ error: 'token missing or invalid' })}

  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await User.findByIdAndUpdate(user._id, {blogs: user.blogs})

  response.status(201).json(savedBlog)
})

blogsRouter.post('/:id/comments', async (request, response, next) => {
  if (!request.body.comment) {
    return response.status(401).end();
  }
  const blog = await Blog.findById(request.params.id)
  if (!blog) { return response.status(204).end() }
  blog.comments = [ ...blog.comments, request.body.comment ]
  let updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog,
    {new: true, runValidators: true})
  response.status(201).json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  if (!user) { return response.status(401).json({ error: 'token missing or invalid' })}
  const blog = await Blog.findById(request.params.id)
  if (!blog) { return response.status(204).end() }

  if (user._id.toString() === blog.user.toString()) {
    const userBlogs = user.blogs.filter(savedBlog => savedBlog.toString() !== blog._id.toString())
    await User.findByIdAndUpdate(user._id, {blogs: userBlogs})
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'You do not have persmission to delete this post' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    author: body.author,
    title: body.title,
    likes: body.likes,
    url: body.url
  }
  let updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog,
    {new: true, runValidators: true})
  response.json(updatedBlog)
})

module.exports = blogsRouter