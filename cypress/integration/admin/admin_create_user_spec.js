describe('admin test - create a user', function () {
  const username = 'admin@zabek.pl';
  const password = 'Qwerty.1';

  context('XHR form submission', function () {
    beforeEach(function () {
      cy.visit('/login')
    })

    it('successfully logs in', () => {

      cy.get('input[name=username]').type(username)
      cy.get('input[name=password]').type(password)
      cy.get('form').submit()

      // we should be in /user/doctor/list
      cy.url().should('include', '/user/doctor/list')
      
      // różowy plusik do dodawania
      cy.get('[data-cy=addDoctor]').click()
      cy.url().should('include', '/user/doctor/create')
    })

    it('creates a user with role=user', () => {
      // we should be in /user/doctor/list
      cy.visit('/user/user/list')
      // czemu musze tak??
      cy.get('input[name=username]').type(username)
      cy.get('input[name=password]').type(password)
      cy.get('form').submit()

      cy.url().should('include', '/user/user/list')
 
      // różowy plusik do dodawania
      cy.get('[data-cy=addUser]').click()
      cy.url().should('include', '/user/user/create')

    // formularz powinien być pusty, przycisk Zapisz użytkownika disabled, Anuluj enabled
      cy.get('[data-cy=email').should('be.empty')
      cy.get('[data-cy=role').should('contain', 'Technik RTG')
      cy.get('[data-cy=lab]').should('be.empty')
      cy.get('[data-cy=password1]').should('be.empty')
      cy.get('[data-cy=password2]').should('be.empty')
      cy.get('[data-cy=submit]').should('be.disabled')
      cy.get('[data-cy=cancel]').should('be.enabled')
      // teraz tworzymy usera
      cy.get('[data-cy=email').type('user101@zabek.pl')
      cy.get('[data-cy=password1]').type('Qwerty.1')
      cy.get('[data-cy=password2]').type('Qwerty.1')
      cy.get('[data-cy=submit]').should('be.enabled')
      cy.get('[data-cy=submit]').click()
    })
  })

})