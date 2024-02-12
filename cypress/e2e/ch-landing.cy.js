describe('landing page test', () => {
  it('checks the landing page', () => {
    cy.visit('http://localhost:5173/')
    cy.get('[data-cy="headline"]').contains('Cat Herder')
    cy.get('[data-cy="open-login-btn"]').click()
    cy.get('[data-cy="user-mail-input"]').type(Cypress.env('user_name'))
    cy.get('[data-cy="user-password-input"]').type(Cypress.env('user_password'))
    cy.get('[data-cy="login-button"]').click()
    cy.get('[data-cy="add-cat-btn"]').click()
  })
})
