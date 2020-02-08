describe('admin test - create an online doctor', function () {
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

      cy.url().should('include', '/user/doctor/list')

      // różowy plusik do dodawania
      cy.get('[data-cy=addDoctor]').click()
      cy.url().should('include', '/user/doctor/create')

      // formularz powinien być pusty, przycisk Zapisz  disabled, Anuluj enabled
      cy.get('[data-cy=email').should('be.empty')
      cy.get('[data-cy=firstName').should('be.empty')
      cy.get('[data-cy=lastName]').should('be.empty')
      cy.get('[data-cy=qualificationsNo]').should('be.empty')
      cy.get('[data-cy=pesel]').should('be.empty')
      cy.get('[data-cy=nip]').should('be.empty')
      cy.get('[data-cy=officeName]').should('be.empty')
      cy.get('[data-cy=officeAddress]').should('be.empty')
      cy.get('[data-cy=examFormat]').should('contain', 'jpeg')
      cy.get('[data-cy=submit]').should('be.disabled')
      cy.get('[data-cy=cancel]').should('be.enabled')
      // teraz tworzymy doktora
      cy.get('[data-cy=email').type('doctor001@zabek.pl')
      cy.get('[data-cy=firstName').type('Dr Jan Maria')
      cy.get('[data-cy=lastName]').type('Rokita')
      cy.get('[data-cy=qualificationsNo]').type('2644577')
      cy.get('[data-cy=pesel]').type('34111806970')
      cy.get('[data-cy=nip]').type('7594670066')
      cy.get('[data-cy=officeName]').type('Zabkowy Gigant Poudnia')
      cy.get('[data-cy=officeAddress]').type('Blotna 123/4; Krakow i Okolice')

      cy.get('form').submit()
      cy.url().should('include', '/user/doctor/list')

    })

  })

})