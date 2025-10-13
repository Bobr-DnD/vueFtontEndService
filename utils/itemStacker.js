export default function groupById(items, idKey = 'id') {
  const map = new Map()

  items.forEach((item) => {
    const key = item[idKey]
    if (map.has(key)) {
      map.get(key).count++
    } else {
      map.set(key, { ...item, count: 1 })
    }
  })

  return Array.from(map.values())
}