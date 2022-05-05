import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const { content, display, success } = useSelector(store => store.notifications)

  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    display
  }

  const failStyle = { ...successStyle, color: 'red' }

  const notificationStyle = success ? successStyle : failStyle

  return (
    <div className="error" style={notificationStyle}>
      {content}
    </div>
  )
}

export default Notification