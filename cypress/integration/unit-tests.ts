/// <reference types="cypress" />

import { isValidPwz } from '@zabek/util';

describe('Cypress unit testing', function() {
  context('Prawo wykonywania zawodu', function() {
    it('validate PWZ 5425740', () => {
      expect( isValidPwz('5425740') ).to.be.true;
    })
  });
})