import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'
// import { prettyDOM } from '@testing-library/react'

describe('Blog component', () => {
  let blog

  beforeEach(() => {
    blog = {
      title: 'This is for testing',
      author: 'donald duck',
      url: 'quack.com',
      likes: 5,
      user: {
        username: 'Blog component testing',
        name: 'Mickey'
      }
    }
  })

  test('displays blog title and author, and nothing else', () => {
    const component = render(
      <Blog blog={blog} />
    )

    expect(component.container).toHaveTextContent(
      `${blog.title} by ${blog.author}`
    )

    const div = component.container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('displays url and number of likes when view expanded', () => {
    const mockHandler = jest.fn()
    const component = render(
      <Blog blog={blog} handleLike={mockHandler} handleRemove={mockHandler} />
    )

    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent(
      `${blog.title} ${blog.author}`
    )

    expect(component.container).toHaveTextContent(
      `${blog.likes}`
    )

    expect(component.container).toHaveTextContent(
      `${blog.url}`
    )
  })

  test('if like button is clicked twice, event handler is called twice', () => {
    const mockHandler = jest.fn()
    const component = render(
      <Blog blog={blog} handleLike={mockHandler} />
    )

    let viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    let likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})

