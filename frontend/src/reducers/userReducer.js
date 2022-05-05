import loginService from '../services/login'
import blogServices from '../services/blogs'
import userServices from '../services/users'

const initialState = {
  allUsers: [],
  loggedIn: null,
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'LOGIN_USER':
    return { ...state, loggedIn: action.data }
  case 'LOGOUT_USER':
    return { ...state, loggedIn: null }
  case 'SET_USERS':
    return { ...state, allUsers: action.data }
  default:
    return state
  }
}

export const loginUser = (username, password) => {
  return async dispatch => {
    const response = await loginService.login({
      username, password,
    })
    if (response.status === 200) {
      const user = response.data
      blogServices.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      dispatch({
        type: 'LOGIN_USER',
        data: user,
      })
      return true
    } else {
      console.log('failed login')
      return false
    }
  }
}

export const setLoggedInUser = user => {
  return async dispatch => {
    blogServices.setToken(user.token)
    dispatch({
      type: 'LOGIN_USER',
      data: user,
    })
  }
}

export const logoutUser = () => {
  return async dispatch => {
    dispatch({
      type: 'LOGOUT_USER',
    })
  }
}

export const initializeUsers = () => {
  return async dispatch => {
    const data = await userServices.getAllUsers()
    dispatch({
      type: 'SET_USERS',
      data,
    })
  }
}

export default userReducer