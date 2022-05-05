import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blogs from './components/BlogList'
import Users from './components/UserList'
import Notification from './components/Notification'
import Togglable from './components/Toggleable'
import BlogForm from './components/AddBlogForm'
import LoginForm from './components/LoginForm'
import User from './components/User'
import Blog from './components/Blog'
import Navigation from './components/Navigation'
import { setLoggedInUser, initializeUsers } from './reducers/userReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { Switch, Route } from 'react-router-dom'

const App = () => {
  const loggedInUser = useSelector((state) => state.users.loggedIn)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const userInfo = JSON.parse(loggedUserJSON)
      dispatch(setLoggedInUser(userInfo))
    }
  }, [])

  if (loggedInUser) {
    return (
      <div className='container'>
        <Notification />
        <Navigation />
        <Switch>
          <Route path='/blogs/:id'>
            <Blog />
          </Route>
          <Route path='/users/:id'>
            <User />
          </Route>
          <Route path='/users'>
            <Users />
          </Route>
          <Route path='/'>
            <div>
              <h1>Blogs App</h1>
            </div>
            <div>
              <Togglable buttonLabel='Create New Blog'>
                <BlogForm />
              </Togglable>
              <Blogs />
            </div>
          </Route>
        </Switch>
      </div>
    )
  } else {
    return (
      <Togglable buttonLabel='login'>
        <Notification />
        <LoginForm />
      </Togglable>
    )
  }
}

export default App