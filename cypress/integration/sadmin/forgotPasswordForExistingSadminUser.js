describe('Reset hasła przy logowaniu dla istniejącego usera sadmin', function () {
    it('Otwórz stronę logowania', function () {
        cy.visit('/');
    })

    it('Czy jest link do zmiany hasła otwiera okno zmiany hasła?', function () {
        cy.visit('/login')
        cy.get('a[href*="/resetpassword"]').click()
    })

    it('Zmień hasło dla sadmin@zabek.pl', function(){
        cy.get('form').within(() => {
            cy.get('input[name=email]').type('sadmin@zabek.pl')
            cy.get('button[name=resetpassword]').click()
          })
    })
})