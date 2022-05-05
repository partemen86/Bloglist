import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addComment } from '../reducers/blogReducer'

const CommentForm = ({ blogId }) => {
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = async (event) => {
    event.preventDefault()
    dispatch(addComment(blogId, comment))
    setComment('')
  }

  return (
    <div>
      <h3>Comments</h3>
      <form onSubmit={handleSubmit}>
        <input
          id='comment'
          type="text"
          value={comment}
          name="Comment"
          onChange={({ target }) => setComment(target.value)}
        />
        <button id='submit-comment' type='submit'>Add Comment</button>
      </form>
    </div>
  )
}



export default CommentForm