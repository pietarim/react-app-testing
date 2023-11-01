describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', { name: 'Ville', username: 'Pietari Murtomaki', password: 'salis' })
    cy.visit('http://localhost:5173/')
  })

  it('Login form is shown by default', function() {
    cy.contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#login-visible').click()
      cy.get('#username').type('Pietari Murtomaki')
      cy.get('#password').type('salis')
      cy.get('#login-button').click()
      cy.contains('Ville logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#login-visible').click()
      cy.get('#username').type('Pietareee')
      cy.get('#password').type('vaara')
      cy.get('#login-button').click()
      cy.contains('Wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'Pietari Murtomaki', password: 'salis' })
      cy.wait(50)
      cy.visit('http://localhost:5173/')
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('https://docs.cypress.io/')
      cy.get('#create-button').click()
      cy.contains('a blog created by cypress')
    })

    it('A blog can be liked', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('https://docs.cypress.io/')
      cy.get('#create-button').click()
      cy.contains('a blog created by cypress')
      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('Likes: 1')
    })

    it('A blog can be deleted', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('https://docs.cypress.io/')
      cy.get('#create-button').click()
      cy.contains('a blog created by cypress')
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.contains('blog a blog created by cypress by cypress removed')
    })

    it('Cant delete blog if not creator', function() {
      cy.createUser()
      cy.login({ username: 'testi', password: 'testi' })
      cy.createBlog({ title: '1likes', author: 'Author', url: 'www.internet.com' })
      cy.login({ username: 'Pietari Murtomaki', password: 'salis' })
      cy.contains('view').click()
      cy.contains('remove').should('not.exist')
    })

    it('Blogs are ordered by likes', function() {
      cy.createBlog({ title: 'alot', author: 'Tupu', url: 'www.url.fi', likes: 1 })
      cy.createBlog({ title: 'more', author: 'Hupu', url: 'www.url.fi', likes: 2 })
      cy.createBlog({ title: 'most', author: 'Lupu', url: 'www.url.fi', likes: 3 })
      cy.get('#Hupu-view').click()
      cy.wait(50)
      cy.get('#Hupu-like').click()
      cy.wait(50)
      cy.get('#Hupu-like').click()
      cy.wait(50)
      cy.get('.blog').then(blogs => {
        cy.wrap(blogs[0]).contains('more')
        cy.wrap(blogs[1]).contains('most')
        cy.wrap(blogs[2]).contains('alot')
      })
    })
  })
})