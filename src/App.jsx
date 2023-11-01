import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginFrom'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import auth from './services/login'
import Togglable from './components/Togglable'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const userFromStore = JSON.parse(loggedUserJSON)
      setUser(userFromStore)
      if (userFromStore) {
        blogService.setToken(userFromStore.token)
      }
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await auth.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setErrorMessage([`User ${user.name} logged in`, 'notification'])
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage(['Wrong credentials', 'error'])
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button id='login-visible' onClick={() => setLoginVisible(true)}>login</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button id='cancle-login' onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const handleLike = (newBlog) => {
    const blogObject = {
      _id: newBlog.id,
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
      likes: newBlog.likes + 1,
      user: user.id
    }
    blogService.update(blogObject)
      .then(() => {
        setErrorMessage([`blog ${newBlog.title} by ${newBlog.author} liked`, 'notification'])
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        const newBlogs = blogs.map(b => b.id !== newBlog.id ? b : { ...newBlog, likes: newBlog.likes + 1 })
        const sortedBlogs = newBlogs.sort((a, b) => b.likes - a.likes)
        setBlogs(sortedBlogs)
      }
      )
      .catch(error => {
        setErrorMessage([`blog ${newBlog.title} by ${newBlog.author} not liked`, 'error'])
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
      )
  }

  const handleRemove = async (blogToRemove) => {
    if (window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}?`)) {
      try {
        const response = await blogService.remove(blogToRemove.id)
        if (response.status === 204) {
          const newBlogs = blogs.filter(b => b.id !== blogToRemove.id)
          setBlogs(newBlogs)
          setErrorMessage([`blog ${blogToRemove.title} by ${blogToRemove.author} removed`, 'notification'])
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        }
      } catch (error) {
        setErrorMessage([`blog ${blogToRemove.title} by ${blogToRemove.author} not removed`, 'error'])
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat({ ...returnedBlog, user: { id: user.id } }))
        blogsFromRef.current.toggleVisibility()
        setErrorMessage([`a new blog ${blogObject.title} by ${blogObject.author} added`, 'notification'])
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
      .catch(() => {
        setErrorMessage([`Saving blog ${blogObject.title} by ${blogObject.author} failed`, 'error'])
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const blogsFromRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogsFromRef}>
      <BlogForm
        handleSubmit={addBlog}
      />
    </Togglable>
  )

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification info={errorMessage} />

      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in <button onClick={logout}>logout</button></p>
        {blogForm()}
      </div>}
      {blogs.map(blog =>
        <Blog key={blog.id} user={user} blog={blog} handleLike={handleLike} handleRemove={handleRemove} />
      )}
    </div>
  )
}

export default App