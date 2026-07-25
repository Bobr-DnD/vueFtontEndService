import { isEqual } from "lodash"

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
    .filter(perk => perk.count < (perk.levels?.length || 1));
}

export function filterPerksByRankWithoutCount(perks, allPerks) {
  const grouped = groupById(perks);

  return allPerks.filter(perk => {
    const found = grouped.find(p => p.id === perk.id);
    const count = found?.count ?? 0;

    return count < perk.ranks;
  });
}

export function filterDuplicates(arrayA, arrayB, key = 'id') {
  const setBValues = new Set(arrayB.map(item => item[key]));
  return arrayA.filter(item => !setBValues.has(item[key]));
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

export function checkEqualByKeys(originalArray, copyArray, keys) {
  const isChanged = keys.some(key =>
    !isEqual(originalArray[key], copyArray[key])
  )

  return isChanged
}