/// <reference types="cypress" />



describe('Cypress unit testing', function() {
  context('Prawo wykonywania zawodu', function() {
    it('validate PWZ 5425740', () => {
      cy.visit("http://localhost:3001")
    })
  });
})