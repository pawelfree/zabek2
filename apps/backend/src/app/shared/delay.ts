export const delayResponse =  () => { return new Promise((resolve, reject) => {
    setTimeout(() => { resolve()}, 1000)
  });
}
