import { isValidPwz } from './pwz'; 

describe('PWZ', () => {

  it('PWZ 5425740 should be valid', () => {
    expect(isValidPwz('5425740')).toBeTruthy();
  });

  it('PWZ 5425741 should be invalid', () => {
    expect(isValidPwz('5425741')).toBeFalsy();
  });

});

//pawel tadeusz dudek 2581386
//pawel bogdan dudek 3473831
//pawel adam dudek 1368479