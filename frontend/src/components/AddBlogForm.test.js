import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import AddBlogForm from './AddBlogForm'

describe('adding blogs tests', () => {
  test('add blog form correctly calls event handler with the correct values', () => {
    const mockHandler = jest.fn()
    const component = render(<AddBlogForm addBlog={mockHandler} />)
    const author = component.container.querySelector('#author')
    const title = component.container.querySelector('#title')
    const url = component.container.querySelector('#url')

    expect(author).toBeDefined
    expect(title).toBeDefined
    expect(url).toBeDefined
    let submit = component.getByText('Create')

    fireEvent.change(title, {
      target: { value: 'This is a test blog' },
    })

    fireEvent.change(author, {
      target: { value: 'Mickey Mouse' },
    })

    fireEvent.change(url, {
      target: { value: 'www.www.com' },
    })

    component.debug()
    fireEvent.click(submit)
    console.log(mockHandler.mock.calls[0])

    expect(mockHandler).toHaveBeenCalledTimes(1)
    expect(mockHandler.mock.calls[0][0].title).toBe('This is a test blog')
    expect(mockHandler.mock.calls[0][0].author).toBe('Mickey Mouse')
    expect(mockHandler.mock.calls[0][0].url).toBe('www.www.com')
  })
})
