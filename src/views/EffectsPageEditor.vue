<script setup>
import { reactive, ref, onMounted, onBeforeUnmount, computed, toRaw, watch } from 'vue'
import { useRoute } from 'vue-router'

import RepositoryFactory from '@http/RepositoryFactory'
import { asyncHandler } from '@utils/asyncHandler'
import { notify } from '@utils/notification'
import { toNewEffect, toObject,toNewSession } from '@utils/objects.dto'
import { checkObjectFieldExisting } from '@utils/entityHelper'
import { socket } from '@ws/webSocket'

import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue'
import EffectTile from '@/components/reusable/EntityTiles/EffectTile.vue'
import Loader from 'vue-spinner/src/SyncLoader.vue'
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue'
import Header1 from '@/components/reusable/Titles/Header1.vue'
import Header2 from '@/components/reusable/Titles/Header2.vue'
import SingleFieldEditor from '@/components/reusable/SingleFieldEditor.vue'
import TextDropdown from '@/components/character-page components/TextDropdown.vue'
import DeleteButton from '@/components/reusable/Buttons/DeleteButton.vue'
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue'
import UnsavedLabel from '@/components/reusable/UnsavedLabel.vue'
import PlusButton from '@/components/reusable/Buttons/PlusButton.vue'


const state = reactive({
    session: {},
    isLoading: true,
    unsavedChanges: false
})

const sessionId = useRoute().params.sessionId
const searchQuery = ref('')
const selectedEffect = ref(toNewEffect({}))
const unsavedChanges = ref(false)

const newEffect = ref({})

onMounted(async () => {
    const [res, err] = await asyncHandler(
        RepositoryFactory.getById('session', sessionId)
    )
    if (err) {
        return
    }

    state.isLoading = false
    state.session = res.data
})

onBeforeUnmount(() => {
    const events = ['session:updateNotify']
    events.forEach(e => socket.off(e))
})

socket.on('session:updateNotify', (session) => {
    state.session = toNewSession(session)
    notify({ message: `Сесію було оновлено майстром`, type: 'warning' })
})

const filteredEffects = computed(() => {
    const effects = state.session.effects;

    if (!searchQuery.value.trim()) {
        return [...effects];
    }

    const query = searchQuery.value.toLowerCase();

    return effects.filter(el =>
        el.name.toLowerCase().includes(query)
    );
});

async function saveEffect() {

    const effect = toRaw(selectedEffect.value)

    if (selectedEffect.value.id === 'new') {

        effect.session = sessionId

        const [res, err] = await asyncHandler(
            RepositoryFactory.create(`effect`, effect)
        )
        if (err) return

        selectedEffect.value = toNewEffect({})
    }
    else {

        const [res, err] = await asyncHandler(
            RepositoryFactory.update('effect', effect.id, effect)
        )
        if (err) return

    }

    const [res, err] = await asyncHandler(
        RepositoryFactory.getById('session', sessionId)
    )
    if (err) return

    state.session = res.data
    unsavedChanges.value = false
    
    notify({ message: 'Зміни збережені', type: 'info' })
    socket.emit('session:updateNotify', sessionId)
}

async function removeEffect() {

    const [resEffect, errEffect] = await asyncHandler(
        RepositoryFactory.delete('effect', selectedEffect.value.id)
    )
    if (errEffect) return

    const [res, err] = await asyncHandler(
        RepositoryFactory.getById('session', sessionId)
    )
    if (err) return

    state.session = res.data
    unsavedChanges.value = false
    selectedEffect.value = toNewEffect({})

    notify({ message: 'Ефект видалено', type: 'info' })
    socket.emit('session:updateNotify', sessionId)
}

function markUnsaved() {
    unsavedChanges.value = true
}

function discardChanges() {

    if (selectedEffect.value.id === 'new') selectedEffect.value = toNewEffect({})
    else {
        selectedEffect.value = toNewEffect(structuredClone(toRaw(state.session.effects.find(el => el.id === selectedEffect.value.id))))
    }

    unsavedChanges.value = false
    notify({ message: 'Зміни анульовані', type: 'warning' })
}

function selectEffect(effect) {
    if (unsavedChanges.value) {
        const confirmSwitch = confirm('Є незбережені зміни. Вийти без збереження?')
        if (!confirmSwitch) return
    }

    unsavedChanges.value = false
    newEffect.value = {}
    selectedEffect.value = toNewEffect(structuredClone(toRaw(effect)))
}

function updateEffectField(fieldName, value) {
    selectedEffect.value[fieldName] = value
    markUnsaved()
}

function updateEffectCharacteristics() {
    if (newEffect.value.value)
        Object.assign(selectedEffect.value.effect, toObject(newEffect.value))
    else notify({ message: 'Вкажіть значення', type: 'error' })
    markUnsaved()
}

function getCharacteristicType(id) {
    const type = state.session.characteristicsList.find(el => el.id === id)
    newEffect.value.name = type.name

}
function getCharacteristicValue(fieldName, value) {
    newEffect.value[fieldName] = value
}

function removeEffectCharacteristic(key) {
    delete selectedEffect.value.effect[key]
    markUnsaved()
}

</script>

<template>

    <MasterPageNavigation />

    <section v-if="!state.isLoading" class="m-4 grid grid-cols-1 gap-4">
        <Header1 label="Всі ефекти:" />
        <div class="flex gap-2">

            <input v-model="searchQuery" placeholder="Пошук ..."
                class="h-12 w-full p-2 col-span-3 rounded-lg bg-darkred-dark_gray text-darkred-light" />

            <RejectButtonWithText v-if="searchQuery" @click="searchQuery = ''" text="Очистити" />
        </div>

        <div class="w-full py-2 max-h-[512px] overflow-y-scroll auto-hide-scroll grid grid-cols-4 gap-4">

            <div @click="selectEffect({})"
                :class="selectedEffect.id === 'new' && 'bg-darkred-dark_gray text-darkred-light'"
                class="border-8 border-darkred-dark rounded-2xl flex justify-center items-center hover:cursor-pointer">
                <PlusButton class="w-20" />
            </div>


            <EffectTile v-for="effect in filteredEffects"
                :class="selectedEffect.id === effect.id && 'outline outline-4 outline-offset-[-1px] outline-darkred-red'"
                class="hover:cursor-pointer" @click="selectEffect(effect)" :effect="effect" />
        </div>


    </section>

    <section v-if="!state.isLoading" class="m-4 flex gap-2 items-center">
        <AprroveButtonWithText :class="[!unsavedChanges && 'pointer-events-none opacity-50']" text="Зберегти зміни"
            @click="saveEffect" />

        <RejectButtonWithText :class="[!unsavedChanges && 'pointer-events-none opacity-50']" text="Відмінити"
            @click="discardChanges" />

        <RejectButtonWithText v-if="selectedEffect.id !== 'new'" text="Видалити ефект" @click="removeEffect" />

        <UnsavedLabel v-if="unsavedChanges" />

    </section>

    <section v-if="!state.isLoading" class="m-4 grid grid-cols-2 gap-4">
        <Header1 class="col-span-2" label="Створити\редагувати ефект" />

        <SingleFieldEditor placeholder="Назва" fieldName="name" type="text" :value="selectedEffect.name"
            :callback="updateEffectField" :important="true" class="p-0" />
        <SingleFieldEditor placeholder="Опис" fieldName="description" type="text" :value="selectedEffect.description"
            :callback="updateEffectField" :important="true" class="p-0" />

        <Header2 label="Характеристики, на які впливає ефект:" />

        <div class="col-span-2 flex flex-wrap gap-4 hover:cursor-pointer">
            <div v-if="checkObjectFieldExisting(selectedEffect.effect)" v-for="value, key in selectedEffect.effect"
                class="flex gap-3 items-center p-3 w-fit rounded-lg bg-darkred-dark text-darkred-light">
                <div>
                    {{ key }}: {{ value }}
                </div>
                <DeleteButton @click="removeEffectCharacteristic(key)" class="bg-darkred-red w-10" />

            </div>
            <div v-else class="">
                Пусто
            </div>

        </div>

        <div v-if="checkObjectFieldExisting(state.session.characteristicsList)"
            class="col-span-2 justify-self-center flex gap-2 items-center">
            <TextDropdown label="Характеристика" :entity_array="state.session.characteristicsList"
                entity_name="effectCharacteristic" :callback="getCharacteristicType" />
            <SingleFieldEditor placeholder="Значення" fieldName="value" type="number" :value="newEffect.value"
                :callback="getCharacteristicValue" />
            <div class="pb-2 self-end">
                <AprroveButtonWithText @click="updateEffectCharacteristics" text="Додати поле" />
            </div>

        </div>

        <div v-else>
            <Header2 label="В сесії відсутні характеристики" />
        </div>

    </section>

    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>


</template>