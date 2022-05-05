import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import CommentForm from './CommentForm'
import { likeBlog } from '../reducers/blogReducer'


const Blog = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const blogs = useSelector(state => state.blogs)
  const blog = blogs.find(blog => blog.id === id)

  const handleLike = () => {
    dispatch(likeBlog(blog))
  }

  if (!blog) {
    return null
  }

  return (
    <div>
      <h1>{blog.title}</h1>
      <a href={blog.url}>{blog.url}</a>
      <p>{blog.likes} likes <button onClick={handleLike}>like</button></p>
      <p>Added by {blog.user.username}</p>
      <CommentForm blogId={blog.id}/>
      <ul>
        {blog.comments.map((comment, idx) =>
          <li key={idx}>{comment}</li>)}
      </ul>
    </div>
  )
}

export default Blog