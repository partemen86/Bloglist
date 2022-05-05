import blogServices from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogReducer = (state = [], action) => {
  switch(action.type) {
  case 'INIT_BLOGS':
    return action.data
  case 'NEW_BLOG':
    return [...state, action.data]
  case 'LIKE':
    return state.map(blog =>
      blog.id === action.data.id ? action.data : blog
    )
  case 'DELETE_BLOG':
    return state.filter(blog => blog.id !== action.data)
  case 'ADD_COMMENT':
    return state.map(blog =>
      blog.id === action.data.id ? action.data : blog
    )
  default:
    return state
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogServices.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    const response = await blogServices.create(blog)
    if (response.status === 201) {
      const newBlog = response.data
      dispatch({
        type: 'NEW_BLOG',
        data: newBlog
      })
      return true
    } else {
      return false
    }
  }
}

export const likeBlog = (blog) => {
  return async dispatch => {
    await blogServices.likeBlog(blog)
    dispatch({
      type: 'LIKE',
      data: { ...blog, likes: (blog.likes + 1) }
    })
    dispatch(setNotification(`You liked ${blog.title}`, true))
  }
}

export const deleteBlog = (id) => {
  return async dispatch => {
    let response = await blogServices.deleteBlog(id)
    if (response.status === 204) {
      dispatch({
        type: 'DELETE_BLOG',
        data: id
      })
      dispatch(setNotification('Blog deleted', true))
    } else {
      dispatch(setNotification('You are not authorized to delete that', false))
    }
  }
}

export const addComment = (id, comment) => {
  return async dispatch => {
    let response = await blogServices.addComment(id, comment)
    if (response.status === 201) {
      const blog = response.data
      dispatch({
        type: 'ADD_COMMENT',
        data: blog
      })
      dispatch(setNotification('Comment Added', true))
    } else {
      dispatch(setNotification('Blog not found', false))
    }
  }
}

export default blogReducer