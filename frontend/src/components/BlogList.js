import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Blogs = () => {
  const blogs = useSelector(store =>
    store.blogs.sort((a, b) => b.likes - a.likes)
  )
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className='blogDiv' style={blogStyle}>
      {blogs.map(blog =>
        <p key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> by {blog.author}
        </p>
      )}
    </div>
  )
}

export default Blogs