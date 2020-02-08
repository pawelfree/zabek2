describe('sadmin login test', function () {
    it('Otworz strone logowania', function () {
        cy.visit('/');
    })

    it('Logowanie sadmin-a', function () {
        // destructuring assignment of the this.currentUser object
        const username = 'sadmin@zabek.pl';
        const password = 'sadmin';
    
        cy.visit('/login')
    
        cy.get('input[name=username]').type(username)
        cy.get('input[name=password]').type(`${password}{enter}`)

        cy.url().should('include', '/user/doctor/list')
    
        // w prawym górnym rogu powinien być login usera
        cy.get('a[name=loggedUser]').should('contain', username)
      })
})