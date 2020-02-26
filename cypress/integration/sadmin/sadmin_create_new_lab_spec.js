import { concat } from "rxjs";

describe('sadmin login test', function () {
    const randomSuffix = getRandomInt(0,9999);
    console.log("Random suffix is = " + randomSuffix)
    const sadmin = Cypress.config('username');
    const passwordSadmin = Cypress.config('password');
    const lab = "pracowniaTest" + randomSuffix;
    const adminEmail = "admin"+randomSuffix+"@pracownia" + randomSuffix + ".zabek.pl"
    const technikEmail = "technik"+randomSuffix+"@pracownia" + randomSuffix + ".zabek.pl"

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    
    it('otwiera strone logowania', function () {
        cy.visit('/');
        //TODO dodać sprawdzenie czy są pola  i przycisk do logowania
    })

    it('sadmin może się zalogować', function () {

        cy.visit('/login')
    
        cy.get('input[name=username]').type(sadmin)
        cy.get('input[name=password]').type(`${passwordSadmin}{enter}`)

        cy.url().should('include', '/user/user/list')
    
        // w prawym górnym rogu powinien być login usera
        cy.get('a[name=loggedUser]').should('contain', sadmin)

      })

      it('sadmin może stworzyć pracownię', function(){
        cy.get('a[name=pracownieMenu').click()
        cy.url().should('include', '/user/lab/list')
        cy.get('button[name=addLab').click()
        cy.url().should('include', '/user/lab/create')

        cy.get('input[name=name]').type(lab)
        cy.get('input[name=email]').type("test1@zabek.pl")
        cy.get('input[name=address]').type("ulica i miasto nieznane 1")

        cy.get('button[name=saveLab').click()
        cy.url().should('include', '/user/lab/list')
        cy.get('table').contains('td', lab).should('be.visible');
      })

      it('sadmin może stworzyć admina dla pracowni', function(){
        cy.get('a[name=uzytkownicyMenu').click()
        cy.url().should('include', '/user/user/list')
        cy.get('button[name=addUser').click()
        cy.url().should('include', '/user/user/create')

        cy.get('input[name=email]').type(adminEmail)
        cy.get('mat-select[formControlName=role]').click().get('mat-option').contains('Administrator').click();

        cy.get('input[name=labForSadmin]').click()
        cy.get('table').contains('td', lab).click()

        cy.get('input[name=password1]').type("Qwerty.1")
        cy.get('input[name=password2]').type("Qwerty.1")

        cy.get('button[name=saveUser').click()

        cy.url().should('include', '/user/user/list')
        cy.get('table').contains('td', adminEmail).should('be.visible');

      }) 

      it('sadmin może stworzyć technika dla pracowni', function(){
        cy.get('a[name=uzytkownicyMenu').click()
        cy.url().should('include', '/user/user/list')
        cy.get('button[name=addUser').click()
        cy.url().should('include', '/user/user/create')

        cy.get('input[name=email]').type(technikEmail)
        cy.get('mat-select[formControlName=role]').click().get('mat-option').contains('Technik RTG').click();

        cy.get('input[name=labForSadmin]').click()
        cy.get('table').contains('td', lab).click()

        cy.get('input[name=password1]').type("Qwerty.1")
        cy.get('input[name=password2]').type("Qwerty.1")

        cy.get('button[name=saveUser').click()

        cy.url().should('include', '/user/user/list')
        cy.get('table').contains('td', technikEmail).should('be.visible');

      })
})