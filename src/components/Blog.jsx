import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ user, blog, handleRemove, handleLike }) => {
  const [visible, setVisible] = useState(false)

  let isOwner = false

  if (user && user.id === blog.user.id) {
    isOwner = true
  }

  if (!visible) {
    return (
      <div className='blog' style={{ border: 'solid 1px', margin: '2px', paddingLeft: '3px' }}>
        <p style={{ marginBottom: '2px' }}>{blog.title} {blog.author}<button onClick={() => setVisible(true)}>view</button></p>
      </div>
    )} else {
    return (
      <div className='blog' style={{ border: 'solid 1px', margin: '2px', paddingLeft: '3px' }}>
        Title: {blog.title}
        <br />
        {blog.url}
        <br />
        Likes: {blog.likes} <button onClick={() => handleLike(blog)}>like</button>
        <br />
        Author: {blog.author}
        <button onClick={() => setVisible(false)}>hide</button>
        {isOwner && <button onClick={() => handleRemove(blog)}>remove</button>}
      </div>
    )
  }
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleLike: PropTypes.func.isRequired
}

export default Blog