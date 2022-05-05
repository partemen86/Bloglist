const initialState = {
  content: '',
  success: true,
  display: 'none'
}

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return {
      content: action.notification,
      success: action.success,
      display: ''
    }
  case 'CLEAR_NOTIFICATION':
    return { content: '', display: 'none' }
  default:
    return state
  }
}

export const setNotification = (message, success) => {
  return async dispatch => {
    clearTimeout(window.notificationTimeoutID)
    window.notificationTimeoutID = setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 5000)
    dispatch({
      type: 'SET_NOTIFICATION',
      notification: message,
      success
    })
  }
}

export default notificationReducer