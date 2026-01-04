export function groupById(items, idKey = 'id') {
  const map = new Map()

  items.forEach((item) => {
    const key = item[idKey]
    if (map.has(key)) {
      map.get(key).count++
    } else {
      map.set(key, { ...item, count: 1 })
    }
  })

  let grouped = Array.from(map.values())

  grouped.sort((a, b) => {
    const nameA = (a.name || '').toString().toLowerCase()
    const nameB = (b.name || '').toString().toLowerCase()
    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    else return 0
  })

  return grouped
}

export function filterPerksByRank(perks, allPerks) {
  const grouped = groupById(perks);

  return allPerks
    .map(perk => {
      const found = grouped.find(p => p.id === perk.id);

      return {
        ...perk,
        count: found?.count ?? 0
      };
    })
    .filter(perk => perk.count < perk.ranks);
}

export function filterPerksByRankWithoutCount(perks, allPerks) {
  const grouped = groupById(perks);

  return allPerks.filter(perk => {
    const found = grouped.find(p => p.id === perk.id);
    const count = found?.count ?? 0;

    return count < perk.ranks;
  });
}

export function removeRow(entityArray, id) {
  const index = entityArray.findIndex(entity => entity.id === id)
  if (index !== -1) entityArray.splice(index, 1)
}

export function addRow(entitiesAll, entitiesArray, id) {
  const entity = entitiesAll.find(entity => entity.id === id)
  entitiesArray.push(entity)
}

export function useItem(entityArray, effectsArray, entityEffects, sessionMove, entityId, effectId) {
  const index = entityArray.findIndex(entity => entity.id === entityId)
  if (index !== -1) entityArray.splice(index, 1)
  const effect = effectsArray.find(effect => effect.id === effectId)
  entityEffects.push({
    effect: effect.id,
    deathTime: sessionMove + effect.duration
  })
}

export function checkObjectFieldExisting(field) {
  return (field !== undefined && field !== null && Object.keys(field).length > 0)
}

export function checkArrayFieldExisting(field) {
  return field.length
}

export function sortByTwoFields(array, primaryField, secondaryField) {
  array.sort((a, b) => {
    const keyA = `${a[primaryField]}-${a[secondaryField]}`
    const keyB = `${b[primaryField]}-${b[secondaryField]}`
    return keyA.localeCompare(keyB, 'uk')
  })
}

export function sortByMainField(array, primaryField) {
  array.sort((a, b) => a[primaryField].localeCompare(b[primaryField], 'uk'));
}