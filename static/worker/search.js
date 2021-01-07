self.importScripts('fuse.min.js')

onmessage = function receiver(e) {
  const {searchData, options, value} = e.data

  const results = new Fuse(searchData, options)
    .search(String(value))
    .filter(result => typeof result.item !== 'undefined')
    .map(result => result.item)

  // console.log({results})
  postMessage(results)
}
