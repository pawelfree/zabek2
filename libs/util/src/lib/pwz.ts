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

	const validate = ((4 * arr[1]) + (2 * arr[2]) + (5 * arr[3]) + (7 * arr[4]) + (4 * arr[5]));
	const checksum = validate % 11 ;

  return  checksum === arr[0];
};

export {
	isValidPwz
};