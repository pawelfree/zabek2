describe('admin test - create an online doctor', function () {
  const username = 'admin@zabek.pl';
  const password = 'Qwerty.1';

  context('XHR form submission', function () {
    beforeEach(function () {
      cy.visit('/login')
    })

    it('successfully logs in', () => {
      cy.visit('/user/doctor/list')
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
      var now = new Date();
      var localDateTime = now.getFullYear() + "" + (now.getMonth()+1) + "" 
                        + (now.getDate()) + "" + (now.getHours()) + "" 
                        + (now.getMinutes()) + "" + (now.getSeconds());
      const newDoctor = localDateTime+'@zabek.pl'
      cy.get('[data-cy=email').type(newDoctor)
      cy.get('[data-cy=firstName').type('Dr Test ')
      cy.get('[data-cy=lastName]').type(localDateTime)
      
      // PWZ generator
      // TODO - check if pwz is already used in DB
      // 
      const n = Math.floor(100000 + Math.random() * 900000)
      var digits = (""+n).split("").map(Number);
      const interSum = digits.reduce((prev, curr, index) => curr*(index+1) + prev, 0);
      const controlDigit = (interSum % 11)
      digits.unshift(controlDigit)


      cy.get('[data-cy=qualificationsNo]').type(digits.join('')) 
      cy.get('[data-cy=pesel]').type('34111806970') 
      cy.get('[data-cy=nip]').type('7594670066') 
      cy.get('[data-cy=officeName]').type('Zabkowy Gigant Poułdnia')
      cy.get('[data-cy=officeAddress]').type('Zachlapana 123/4; Kraków i Okolice')

      cy.get('form').submit()
      cy.url().should('include', '/user/doctor/list')

    })

  })

})