'use strict';

/**
 * @param {string} nip NIP you want to check.
 * @return {boolean} Whether the provided NIP is valid.
 */
const isValidNIP = (nip: string): boolean => {

  const reg = /^[0-9]{10}$/;
  if (reg.test(nip) === false) {
    return false;
  } else {
	const arr = nip.split('').map(e => Number(e));
	const checksum =
      (6 * arr[0] +
        5 * arr[1] +
        7 * arr[2] +
        2 * arr[3] +
        3 * arr[4] +
        4 * arr[5] +
        5 * arr[6] +
        6 * arr[7] +
        7 * arr[8]) %
      11;

    return (arr[9]) === checksum;
  }
};

export { isValidNIP };
