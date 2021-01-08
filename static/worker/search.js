// https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.min.js
// https://cdn.jsdelivr.net/npm/idb-keyval
self.importScripts('https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.min.js')

onmessage = function receiver(e) {
  const {searchData, options, value} = e.data

  const results = new Fuse(searchData, options)
    .search(String(value))
    .filter(result => typeof result.item !== 'undefined')
    .map(result => result.item)

  // console.log({results})
  postMessage(results)
}
