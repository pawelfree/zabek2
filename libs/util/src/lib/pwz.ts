'use strict';

/**
* @param {string} pwz PWZ you want to check.
* @return {boolean} Whether the provided PWZ is valid.
*/
const isValidPwz = (pwz: string): boolean => {
	if (pwz.length !== 7) {
		return false;
	}

	const arr = pwz.split('').map(e => Number(e));
	const validate = arr.slice(1).reduce((prev, curr, index) => curr*(index+1) + prev, 0);
	
  return  (validate % 11) === arr[0];
};

export {
	isValidPwz
};