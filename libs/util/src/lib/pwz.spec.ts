import { isValidPwz } from './pwz'; 

describe('PWZ', () => {

  it('PWZ 5425740 should be valid', () => {
    expect(isValidPwz('5425740')).toBeTruthy();
  });

  it('PWZ 5425741 should be invalid', () => {
    expect(isValidPwz('5425741')).toBeFalsy();
  });

});
