Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/login', {
    username, password
  }).then(response => {
    localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
    cy.visit('http://localhost:3000')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
  cy.request({
    url: 'http://localhost:3003/api/blogs',
    method: 'POST',
    body: { title, author, url },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
    }
  })
  cy.visit('http://localhost:3000')
})

Cypress.Commands.add("likeBlog", ({ title }) => {
  cy.wait(200)
  cy.contains(title).parents('.blogDiv').as("blogContainer")
  cy.get("@blogContainer").contains(title)
  cy.get("@blogContainer").contains("view").click()
  cy.get("@blogContainer").contains("like").click()
  cy.get("@blogContainer").contains("hide").click()
})