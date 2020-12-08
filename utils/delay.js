export default () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, 200)
  })
