export const delayResponse =  () => { return new Promise((resolve, _) => {
    setTimeout(() => { resolve()}, 1000)
  });
}
