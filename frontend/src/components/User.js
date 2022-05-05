import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

const User = () => {
  const { id } = useParams()
  const users = useSelector(state => state.users.allUsers)
  const user = users.find(user => user.id === id)
  if (!user) {
    return null
  }
  return (
    <div>
      <h1>{user.username}</h1>
      <h3>Added Blogs</h3>
      <ul>
        {user.blogs.map(blog =>
          <li key={blog.id}>{blog.title}</li>)}
      </ul>
    </div>
  )
}

export default User