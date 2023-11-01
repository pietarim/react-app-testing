import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (blogObject) => {
  const response = await axios.post(baseUrl, blogObject, {
    headers: {
      Authorization: `${token}`
    }
  })
  return response.data
}

const update = async (blogObject) => {
  const response = await axios.put(`${baseUrl}/${blogObject._id}`, blogObject, {
    headers: {
      Authorization: `${token}`
    }
  })
  return response.data
}

const remove = async (blogId) => {
  return await axios.delete(`${baseUrl}/${blogId}`, {
    headers: {
      Authorization: `${token}`
    }
  })
}

export default { setToken, getAll, create, update, remove }