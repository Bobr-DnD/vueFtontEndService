import { computed } from "vue"

export default function useFilteredArray(sourceArray, searchQuery, filterTypeName = 'all', options = {}) {
    const {
        groupFn = (v) => v,
        transformFn = null,
        searchField = 'name',
    } = options

    return computed(() => {
        const filter = filterTypeName.value.find(el => !el.hidden)
        let data = sourceArray.value.filter(el => el.type === filter.name || el.type?.name === filter.name || filter.id === 'all')

        if (transformFn) {
            data = transformFn()
            data.forEach(el => el.count++)  
        }
        if (groupFn) data = groupFn(data)
        if (!searchQuery.value.trim()) return data

        const query = searchQuery.value.trim().toLowerCase()
        return data.filter(el => el[searchField]?.toLowerCase().includes(query))
    })
}