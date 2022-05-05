describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user1 = {
      name: 'Pavlo Artemenko',
      username: 'Superuser',
      password: 'sekret'
    }
    const user2 = {
      name: 'Muhammed Ali',
      username: 'Boxer123',
      password: 'sekret'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user1)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Blogs App')
    cy.contains('login').click()
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('test')
      cy.get('#password').type('sekret')
      cy.get('#login-button').click()
      cy.contains('wrong username')
      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })

    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('Superuser')
      cy.get('#password').type('sekret')
      cy.get('#login-button').click()
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'Boxer123', password: 'sekret' })
      cy.createBlog({
        author: 'Goofy',
        title: 'Uh-yukh',
        url: 'www.notreallyadog.www',
      })
      cy.contains('Logout').click()
      cy.login({ username: 'Superuser', password: 'sekret' })
      cy.createBlog({
        author: 'Mickey Mouse',
        title: 'How to get the cheese',
        url: 'www.allthecheese.www',
      })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('Testing Blog App')
      cy.get('#author').type('Donald Duck')
      cy.get('#url').type('www.testing.www')
      cy.get('#submit-blog').click()
      cy.contains('Testing Blog App by Donald Duck')
    })

    it('A user can like a blog', function() {
      cy.contains('How to get the cheese').parents('.blogDiv').as('parentDiv')
        .contains('view').click()
      cy.get('@parentDiv').contains('like').click()
      cy.get('@parentDiv').contains('1')
    })

    it('A user can delete a blog posted by them', function() {
      cy.contains('How to get the cheese').parents('.blogDiv').as('parentDiv')
        .contains('view').click()
      cy.get('@parentDiv').contains('remove').click()
      cy.get('How to get the cheese').should('not.exist')
      cy.contains('Blog post deleted')
    })

    it('A user cannot delete a blog that they did not post', function() {
      cy.contains('Uh-yukh').parents('.blogDiv').as('parentDiv')
        .contains('view').click()
      cy.get('@parentDiv').contains('remove').click()
      cy.contains('Uh-yukh')
      cy.contains('Unable to delete blog, please check credentials')
    })

    it('blogs are ordered by number of likes', function() {
      cy.createBlog({
        author: 'Pluto',
        title: 'Woof',
        url: 'www.alsonotreallyadog.www',
      })
      cy.likeBlog({ title: 'How to get the cheese' })
      cy.get('.blogDiv:first').contains('How to get the cheese')
      cy.likeBlog({ title: 'Woof' })
      cy.likeBlog({ title: 'Woof' })
      cy.get('.blogDiv:first').contains('Woof')
    })
  })
})
