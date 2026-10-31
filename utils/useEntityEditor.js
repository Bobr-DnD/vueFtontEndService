import { ref, toRaw } from 'vue'
import { notify, notifySyncSuccess } from './notification'

export default function useEntityEditor({
    toNew,
    getSourceList,
    buildNew = () => ({}),
    afterSelect = () => { },
    confirmSwitchMessage = 'Є незбережені зміни. Вийти без збереження?',
    confirmRemoteUpdateMessage = 'Дані оновлено іншим користувачем. Незбережені зміни буде втрачено. Оновити дані?'
}) {
    const selected = ref(toNew({}))
    const unsavedChanges = ref(false)
    const dirtyFields = ref(new Set())

    function markUnsaved() {
        unsavedChanges.value = true
    }

    function markDirty(field) {
        dirtyFields.value.add(field)
        markUnsaved()
    }

    function markSaved() {
        unsavedChanges.value = false
        dirtyFields.value = new Set()
    }

    function buildPatchOps() {
        return [...dirtyFields.value].map(field => ({
            op: 'replace',
            path: `/${field}`,
            value: toRaw(selected.value)[field]
        }))
    }

    function load(id, data) {
        markSaved()

        if (id === 'new') {
            selected.value = toNew(buildNew())
            return
        }

        const source = data ?? getSourceList().find(el => el.id === id)
        selected.value = toNew(structuredClone(toRaw(source)))
    }

    function select(id) {
        // 'new' is special-cased: the initial `selected` ref is already a bare
        // toNew({}) with id 'new' by coincidence (before buildNew() ever ran),
        // so the usual "already selected" short-circuit would silently skip
        // populating required fields (e.g. `session`) on someone's very first
        // "create" click - always rebuild a fresh draft instead.
        if (id !== 'new' && selected.value?.id === id) return
        if (unsavedChanges.value && !confirm(confirmSwitchMessage)) return

        load(id)
        afterSelect(id)
    }

    function discardChanges() {
        load(selected.value.id)
        afterSelect(selected.value.id)
        notify({ message: 'Зміни анульовані', type: 'warning' })
    }

    // For reactive/remote updates (e.g. websocket session sync) - guards
    // against silently clobbering in-progress unsaved edits.
    function syncFromRemote(id, data) {
        if (!selected.value || selected.value.id === 'new') return
        if (unsavedChanges.value && !confirm(confirmRemoteUpdateMessage)) return

        load(id, data)
    }

    return {
        selected,
        unsavedChanges,
        dirtyFields,
        markUnsaved,
        markDirty,
        markSaved,
        buildPatchOps,
        load,
        select,
        discardChanges,
        syncFromRemote
    }
}
