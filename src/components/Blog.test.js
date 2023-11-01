import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('Renders container with non detailed info', () => {
  const blog = {
    title: 'How to code lines and fix bugs',
    author: 'Dale',
    url: 'www.coding.com',
    likes: 0
  }
  const mockHandler = jest.fn()
  const mockHandler2 = jest.fn()

  const { container } = render(<Blog blog={blog} handleRemove={mockHandler2} handleLike={mockHandler} />)

  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent(
    'How to code lines and fix bugs'
  )
  expect(div).toHaveTextContent(
    'Dale'
  )
  expect(div).not.toHaveTextContent(
    'www.coding.com'
  )
  expect(div).not.toHaveTextContent(
    '0'
  )
})

test('Renders container with detailed info', async () => {
  const blog = {
    title: 'How to code lines and fix bugs',
    author: 'Dale',
    url: 'www.coding.com',
    likes: 0,
  }
  const mockHandler = jest.fn()
  const mockHandler2 = jest.fn()

  const { container } = render(<Blog blog={blog} handleRemove={mockHandler2} handleLike={mockHandler} />)
  const div = container.querySelector('.blog')

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(div).toHaveTextContent(
    'How to code lines and fix bugs'
  )
  expect(div).toHaveTextContent(
    'Dale'
  )
  expect(div).toHaveTextContent(
    'www.coding.com'
  )
  expect(div).toHaveTextContent(
    '0'
  )
})

test('Clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'How to code lines and fix bugs',
    author: 'Dale',
    url: 'www.coding.com',
    likes: 0
  }

  const mockHandler = jest.fn()
  const mockHandler2 = jest.fn()

  render(<Blog blog={blog} handleRemove={mockHandler2} handleLike={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('like')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})