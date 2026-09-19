import { ref, toRaw, watch } from 'vue'
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
    const copied = ref(false)

    function markUnsaved() {
        unsavedChanges.value = true
    }

    function markSaved() {
        unsavedChanges.value = false
        copied.value = true
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
        if (selected.value?.id === id) return
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

    watch(selected, () => {
        if (copied.value) {
            copied.value = false
            return
        }
        markUnsaved()
    }, { deep: true, immediate: false })

    return {
        selected,
        unsavedChanges,
        copied,
        markUnsaved,
        markSaved,
        load,
        select,
        discardChanges,
        syncFromRemote
    }
}
