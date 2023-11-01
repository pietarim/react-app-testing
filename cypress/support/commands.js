Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
    cy.visit('http://localhost:5173/')
  })
})

Cypress.Commands.add('createBlog', ( content ) => {
  cy.request({
    url: 'http://localhost:3003/api/blogs',
    method: 'POST',
    body: content,
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
    }
  })
  cy.visit('http://localhost:5173/')
})

Cypress.Commands.add('createUser', () => {
  cy.request({
    url: 'http://localhost:3003/api/users',
    method: 'POST',
    body: { username: 'testi', name: 'testi', password: 'testi' },
  })
  cy.visit('http://localhost:5173/')
})