import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { logoutUser } from '../reducers/userReducer'

const Navigation = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const loggedInUser = useSelector(state => state.users.loggedIn)

  const handleLogOut = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    dispatch(logoutUser())
    history.push('/')
  }
  const style = {
    paddingRight: 10
  }

  return (
    <nav>
      <Link style={style} to={'/'}>Blogs</Link>
      <Link style={style} to={'/users'}>Users</Link>
      <span>{loggedInUser.username} logged in <button onClick={handleLogOut}>Logout</button></span>
    </nav>
  )
}

export default Navigation