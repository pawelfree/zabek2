describe('sadmin login test', function () {
    it('otwiera strone logowania', function () {
        cy.visit('/');
        //TODO dodać sprawdzenie czy są pola  i przycisk do logowania
    })

    it('sadmin może się zalogować', function () {
        const username = Cypress.config('username');
        const password = Cypress.config('password');
    
        cy.visit('/login')
    
        cy.get('input[name=username]').type(username)
        cy.get('input[name=password]').type(`${password}{enter}`)

        cy.url().should('include', '/user/user/list')
    
        // w prawym górnym rogu powinien być login usera
        cy.get('a[name=loggedUser]').should('contain', username)
      })
})