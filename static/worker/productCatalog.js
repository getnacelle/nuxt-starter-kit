onmessage = async function () {
  console.time('search data')

  const response = await fetch('/data/search.json')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  const data = await response.json()

  console.timeEnd('search data')
  postMessage(data)
}
