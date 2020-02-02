describe('Reset hasła przy logowaniu dla nieistniejącego usera', function () {
    it('Otwórz stronę logowania', function () {
        cy.visit('/');
    })

    it('Czy jest link do zmiany hasła otwiera okno zmiany hasła?', function () {
        cy.visit('/login')
        cy.get('a[href*="/resetpassword"]').click()
    })

    it('Zmień hasło dla 012345678@xyz.ab', function(){
        cy.get('form').within(() => {
            cy.get('input[name=email]').type('012345678@xyz.ab')
            cy.get('button[name=resetpassword]').click()
            //TODO zdecydować co przekazać do frontendu - i obsłużyć w teście
          })
    })
})