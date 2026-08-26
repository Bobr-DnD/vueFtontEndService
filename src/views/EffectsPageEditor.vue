<script setup>
import { ref, computed, toRaw, watch } from 'vue'
import { useRoute } from 'vue-router'

import RepositoryFactory from '@http/RepositoryFactory'
import { asyncHandler } from '@utils/asyncHandler'
import { socket } from '@ws/webSocket'
import { notify } from '@utils/notification'
import { toNewEffect, toObject } from '@utils/objects.dto'
import { checkObjectFieldExisting } from '@utils/entityHelper'
import { useSessionStore } from '@/stores/sessionStore'

import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue'
import EffectTile from '@/components/reusable/EntityTiles/EffectTile.vue'
import Loader from 'vue-spinner/src/SyncLoader.vue'
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue'
import Header2 from '@/components/reusable/Titles/Header2.vue'
import InputTextReactive from '@/components/reusable/Inputs/InputTextReactive.vue'
import DeleteButton from '@/components/reusable/Buttons/DeleteButton.vue'
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue'
import UnsavedLabel from '@/components/reusable/UnsavedLabel.vue'
import PlusButton from '@/components/reusable/Buttons/PlusButton.vue'
import GraySelectorButton from '@/components/reusable/Buttons/GraySelectorButton.vue'
import SearchInputBlack from '@/components/reusable/SearchInputs/SearchInputBlack.vue'
import DropDownList from '@/components/reusable/DropDowns/DropDownList.vue'

const sessionId = useRoute().params.sessionId
const store = useSessionStore()
const activeTab = ref('base')

const tabs = [
    { id: 'base', label: 'Список ефектів' },
    { id: 'edit', label: "Створити/Редагувати річ" }
]

const newEffect = ref({
    name: '',
    value: ''
})
const searchQuery = ref('')
const selectedEffect = ref(toNewEffect({}))
const unsavedChanges = ref(false)
const copied = ref(false)

const filteredEffects = computed(() => {
    const effects = toRaw(store.session.effects);

    if (!searchQuery.value.trim()) {
        return [...effects];
    }

    const query = searchQuery.value.toLowerCase();

    return effects.filter(el =>
        el.name.toLowerCase().includes(query)
    );
});

// API functions

async function saveEffect() {

    const effect = toRaw(selectedEffect.value)

    if (effect.id === 'new') {

        effect.session = sessionId

        const [res, err] = await asyncHandler(
            RepositoryFactory.create(`effect`, effect)
        )
        if (err) return
        reloadEffect(res.data.id, res.data)
    }
    else {

        const [res, err] = await asyncHandler(
            RepositoryFactory.update('effect', effect.id, effect)
        )
        if (err) return
        reloadEffect(res.data.id, res.data)
    }
    socket.emit('session:updateDataNotify', sessionId);
}

async function deleteEffect() {

    const [resEffect, errEffect] = await asyncHandler(
        RepositoryFactory.delete('effect', selectedEffect.value.id)
    )
    if (errEffect) return
    socket.emit('session:updateDataNotify', sessionId);
    reloadEffect('new')
}

// service functions

function markUnsaved() {
    unsavedChanges.value = true
}

function markSaved() {
    unsavedChanges.value = false
    copied.value = true
}

function discardChanges() {
    markSaved()

    if (selectedEffect.value.id === 'new') selectedEffect.value = toNewEffect({})
    else selectedEffect.value = toNewEffect(structuredClone(toRaw(store.session.effects.find(el => el.id === selectedEffect.value.id))))

    notify({ message: 'Зміни анульовані', type: 'warning' })
}

function reloadEffect(id, data = { id }) {
    markSaved()
    if (id === 'new') selectedEffect.value = toNewEffect({})
    else selectedEffect.value = toNewEffect(data)
}

function selectEffect(id) {
    if (selectedEffect.value?.id === id) return
    if (unsavedChanges.value) {
        const confirmSwitch = confirm('Є незбережені зміни. Вийти без збереження?')
        if (!confirmSwitch) return
    }

    markSaved()

    if (id === 'new') selectedEffect.value = toNewEffect({})
    else selectedEffect.value = toNewEffect(structuredClone(toRaw(store.session.effects.find(el => el.id === id))))

    activeTab.value = 'edit'
}

watch(() => selectedEffect.value, () => {

    if (copied.value) {
        copied.value = false
        return
    }
    markUnsaved()
}, { deep: true, immediate: false })

</script>

<template>

    <MasterPageNavigation />

    <section v-if="!store.isLoading"
        class="p-2 grid grid-cols-[25%_1fr] gap-2 items-center justify-start overflow-hidden font-gothic">

        <section class="h-full p-2 space-y-2 overflow-y-auto">

            <div class="w-full flex flex-col gap-2">

                <GraySelectorButton class="w-full" v-for="type in tabs" :key="type.id" @click="activeTab = type.id"
                    :id="type.id" :label="type.label" :active="activeTab === type.id ? true : false" />

            </div>

            <div v-if="activeTab === 'edit'" class="w-full flex flex-col gap-2">

                <AprroveButtonWithText @click="saveEffect" text="Зберегти зміни"
                    :class="[!unsavedChanges && 'pointer-events-none opacity-50']" class="w-full" />


                <RejectButtonWithText @click="discardChanges" text="Відмінити зміни"
                    :class="[!unsavedChanges && 'pointer-events-none opacity-50']" class="w-full" />

                <RejectButtonWithText v-if="selectedEffect.id !== 'new'" @click="deleteEffect" text="Видалити"
                    class="w-full" />

                <UnsavedLabel v-if="unsavedChanges" class="w-full" />
            </div>

        </section>

        <section class="h-full space-y-2 grid grid-cols-4 gap-4 overflow-y-auto">

            <section v-if="activeTab === 'base'" class="col-span-4 space-y-2">

                <div class="flex justify-center col-span-full">
                    <SearchInputBlack v-model:searchQuery="searchQuery" class="w-1/2" />
                </div>

                <div
                    class="w-full p-2 max-h-[512px] overflow-y-scroll auto-hide-scroll grid grid-cols-4 gap-4 col-span-full">

                    <div @click="selectEffect('new')"
                        :class="selectedEffect.id === 'new' && 'outline outline-4 outline-offset-[-1px] outline-darkred-red'"
                        class="border-8 border-darkred-dark bg-darkred-dark rounded-2xl flex justify-center items-center hover:cursor-pointer">
                        <PlusButton class="w-20 text-darkred-light" />
                    </div>


                    <EffectTile v-for="effect in filteredEffects" :key="effect.id"
                        :class="selectedEffect.id === effect.id && 'outline outline-4 outline-offset-[-1px] outline-darkred-red'"
                        class="hover:cursor-pointer" @click="selectEffect(effect.id)" :effect="effect" />
                </div>

            </section>

            <section v-if="activeTab === 'edit'" class="h-full col-span-full grid grid-cols-2">

                <InputTextReactive placeholder="Назва" fieldName="name" type="text"
                    v-model:inputValue="selectedEffect.name" :important="true" class="" />

                <InputTextReactive placeholder="Опис" fieldName="description" type="text"
                    v-model:inputValue="selectedEffect.description" :important="true" class="" />

                <Header2 label="Характеристики, на які впливає ефект:" class="col-span-full" />

                <div class="col-span-full flex flex-wrap gap-4 hover:cursor-pointer">
                    <div v-if="checkObjectFieldExisting(selectedEffect.effect)"
                        v-for="value, key in selectedEffect.effect" :key="key"
                        class="flex gap-3 items-center p-3 w-fit rounded-lg bg-darkred-dark text-darkred-light">
                        <div>
                            {{ key }}: {{ value }}
                        </div>
                        <DeleteButton @click="delete selectedEffect.effect[key]" class="bg-darkred-red w-10" />

                    </div>
                    <div v-else class="">
                        Пусто
                    </div>

                </div>


                <div class="w-full grid grid-cols-1 gap-2 ">

                    <DropDownList v-model:selected="newEffect.name" label="Виберіть характеристику"
                        entity_name="CharacteristicName" :entity_array="store.session.characteristicsList" />

                    <InputTextReactive v-model:inputValue="newEffect.value" placeholder="Значення"
                        fieldName="CharacteristicValue" />

                    <AprroveButtonWithText class="flex justify-center items-center text-lg"
                        @click="Object.assign(selectedEffect.effect, toObject(toRaw(newEffect)))"
                        text="Додати вимогу" />
                </div>

            </section>

        </section>

    </section>

    <div v-if="store.isLoading" class="text-center py-6">
        <Loader />
    </div>


</template>