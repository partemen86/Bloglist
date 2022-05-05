import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const submitBlog = (event) => {
    event.preventDefault()
    addBlog({
      title,
      author,
      url
    })
    setUrl('')
    setAuthor('')
    setTitle('')
  }

  const dispatch = useDispatch()

  const addBlog = async (blogObject) => {
    const addedSuccessfully = await dispatch(createBlog(blogObject))
    if (addedSuccessfully) {
      dispatch(setNotification(`added blog ${blogObject.title}`, true))
    } else {
      dispatch(setNotification('Unable to add blog', false))
    }
  }

  return (
    <form onSubmit={submitBlog}>
      <h2>Create new blog</h2>
      <div>
        title:
        <input
          id='title'
          type="text"
          value={title}
          name="title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          id='author'
          type="author"
          value={author}
          name="author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          id='url'
          type="text"
          value={url}
          name="url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button id='submit-blog' type="submit">Create</button>
    </form>
  )
}

export default BlogForm