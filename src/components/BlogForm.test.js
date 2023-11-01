import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('Adding blog works', async () => {

  const mockHandler = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm handleSubmit={mockHandler} />)

  const nameInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')
  const button = screen.getByText('create')

  await user.type(nameInput, 'How to stay up to date with software')
  await user.type(authorInput, 'New Author')
  await user.type(urlInput, 'www.youtube.com')

  await user.click(button)

  expect(mockHandler.mock.calls[0][0]).toEqual({
    title: 'How to stay up to date with software',
    author: 'New Author',
    url: 'www.youtube.com'
  })

  await user.click(button)
})