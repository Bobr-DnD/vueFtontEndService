<script setup>
import { ref, toRaw, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '@utils/asyncHandler';
import { socket } from '@ws/webSocket'
import { notify } from '@utils/notification';
import { toNewPerk } from '@utils/objects.dto';
import { checkObjectFieldExisting } from '@utils/entityHelper';
import { useSessionStore } from '@/stores/sessionStore';

import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue';
import Loader from 'vue-spinner/src/SyncLoader.vue'
import SearchInputBlack from '@/components/reusable/SearchInputs/SearchInputBlack.vue';
import Header2 from '@/components/reusable/Titles/Header1.vue';
import PlusButton from '@/components/reusable/Buttons/PlusButton.vue';
import PerkTile from '@/components/reusable/EntityTiles/PerkTile.vue';
import InputTextReactive from '@/components/reusable/Inputs/InputTextReactive.vue';
import DropDownPerks from '@/components/reusable/DropDowns/DropDownPerks.vue';
import TextAreaReactive from '@/components/reusable/Inputs/TextAreaReactive.vue';
import ArraySingleStringForm from '@/components/reusable/Forms/ArraySingleStringForm.vue';
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue';
import UnsavedLabel from '@/components/reusable/UnsavedLabel.vue';
import GraySelectorButton from '@/components/reusable/Buttons/GraySelectorButton.vue';

const sessionId = useRoute().params.sessionId
const store = useSessionStore()
const activeTab = ref('base')

const tabs = [
    { id: 'base', label: 'Список навичок' },
    { id: 'edit', label: "Створити/Редагувати річ" }
]

const searchQuery = ref('')
const selectedPerk = ref(toNewPerk({}))
const selectedType = ref('')
const perkNewRequirement = ref({})
const unsavedChanges = ref(false)
const copied = ref(false)


const filteredPerks = computed(() => {
    let perks = toRaw(store.session.perks);

    if (selectedType.value) perks = perks.filter(el => el.type.id === selectedType.value)

    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        perks = perks.filter(el =>
            el.name.toLowerCase().includes(query)
        );
    }

    return perks
});

// API functions

async function savePerk() {
    const perk = toRaw(selectedPerk.value)

    if (!checkObjectFieldExisting(perk.type)) {
        notify({ message: 'перк повинен мати тип' })
        return
    }

    if (perk.id === 'new') {

        perk.session = sessionId
        const [res, err] = await asyncHandler(
            RepositoryFactory.create('perk', perk)
        )
        if (err) return
        reloadPerk(res.data.id, res.data)
    }
    else {
        const [res, err] = await asyncHandler(
            RepositoryFactory.update('perk', perk.id, perk)
        )
        if (err) return
        reloadPerk(res.data.id, res.data)
    }
    socket.emit('session:updateDataNotify', sessionId);
}

async function deletePerk() {
    const [resPerk, errPerk] = await asyncHandler(
        RepositoryFactory.delete('perk', toRaw(selectedPerk.value.id))
    )
    if (errPerk) return

    socket.emit('session:updateDataNotify', sessionId);
    notify({ message: 'Навичку видалено', type: 'info' })
    reloadPerk('new')
}

// service functions

function discardChanges() {
    markSaved()

    if (selectedPerk.value.id === 'new') selectedPerk.value = toNewPerk({})
    else selectedPerk.value = toNewPerk(structuredClone(toRaw(store.session.perks.find(el => el.id === selectedPerk.value.id))))

    notify({ message: 'Зміни анульовані', type: 'warning' })
}

function markUnsaved() {
    unsavedChanges.value = true;
}

function markSaved() {
    unsavedChanges.value = false
    copied.value = true
}

function reloadPerk(id, data = { id }) {
    markSaved()

    if (id === 'new') selectedPerk.value = toNewPerk({})
    else selectedPerk.value = toNewPerk(data)
}

function selectPerk(id) {
    if (selectedPerk.value?.id === id) return
    if (unsavedChanges.value) {
        const confirmSwitch = confirm('Є незбережені зміни. Вийти без збереження?')
        if (!confirmSwitch) return
    }

    markSaved()

    if (id === 'new') selectedPerk.value = toNewPerk({})
    else selectedPerk.value = toNewPerk(structuredClone(toRaw(store.session.perks.find(el => el.id === id))))

    perkNewRequirement.value = { name: perkNewRequirement.value.name }
    activeTab.value = 'edit'
}

watch(() => selectedPerk.value, () => {

    if (copied.value) {
        copied.value = false
        return
    }
    selectedPerk.value.ranks = selectedPerk.value.levels.length
    markUnsaved()
}, { deep: true, immediate: false })

</script>

<template>

    <MasterPageNavigation />

    <section v-if="!store.isLoading"
        class="h-full p-2 grid grid-cols-[25%_1fr] gap-2 justify-start overflow-hidden font-gothic">

        <section class="p-2 w-full h-full overflow-y-auto space-y-2">

            <div class="w-full flex flex-col justify-start gap-2">

                <GraySelectorButton class="w-full" v-for="type in tabs" :key="type.id" @click="activeTab = type.id"
                    :id="type.id" :label="type.label" :active="activeTab === type.id ? true : false" />

            </div>

            <div v-if="activeTab === 'edit'" class="w-full flex flex-col gap-2">

                <AprroveButtonWithText @click="savePerk" text="Зберегти зміни"
                    :class="[!unsavedChanges && 'pointer-events-none opacity-50']" class="w-full" />


                <RejectButtonWithText @click="discardChanges" text="Відмінити зміни"
                    :class="[!unsavedChanges && 'pointer-events-none opacity-50']" class="w-full" />

                <RejectButtonWithText v-if="selectedPerk.id !== 'new'" @click="deletePerk" text="Видалити"
                    class="w-full" />

                <UnsavedLabel v-if="unsavedChanges" class="w-full" />
            </div>

        </section>

        <section class="h-full overflow-y-auto">

            <section v-if="activeTab === 'base'" class="space-y-2 w-full grid grid-cols-1">

                <div class="w-full flex flex-wrap justify-center items-center gap-2 justify-self-start">

                    <GraySelectorButton class="w-full basis-32" @click="selectedType = ''" id="all" label="Всі"
                        :active="selectedType === '' ? true : false" />

                    <GraySelectorButton class="w-full basis-32" v-for="type in store.session.perkTypes" :key="type.id"
                        @click="selectedType = type.id" :id="type.id" :label="type.name"
                        :active="selectedType === type.id ? true : false" />

                </div>

                <div class="flex justify-center">
                    <SearchInputBlack v-model:searchQuery="searchQuery" class="w-1/2" />
                </div>

                <div class="grid grid-cols-4 gap-4 p-2 max-h-[512px] overflow-y-scroll auto-hide-scroll">
                    <div @click="selectPerk('new')"
                        :class="selectedPerk.id === 'new' && 'outline outline-4 outline-offset-[-1px] outline-darkred-red'"
                        class="border-8 border-darkred-dark bg-darkred-dark rounded-2xl flex justify-center items-center hover:cursor-pointer">
                        <PlusButton class="w-20 text-darkred-light" />
                    </div>

                    <PerkTile v-for="perk in filteredPerks" :key="perk.id" :perk="perk" @click="selectPerk(perk.id)"
                        :class="selectedPerk.id === perk.id && 'outline outline-4 outline-offset-[-1px] outline-darkred-red'" />
                </div>

            </section>

            <section v-if="activeTab === 'edit'" class="grid grid-cols-4 gap-2 items-center justify-start">

                <InputTextReactive class="col-span-3" placeholder="Назва" fieldName="name"
                    v-model:inputValue="selectedPerk.name" type="text" :important="true" />

                <DropDownPerks label="Тип перку" entity_name="perkType" v-model:selected="selectedPerk.type"
                    :entity_array="store.session.perkTypes" :important="true" />

                <InputTextReactive class="col-span-full" placeholder="Опис" fieldName="description"
                    v-model:inputValue="selectedPerk.description" type="text" />

                <TextAreaReactive class="col-span-full" label="Записки Майстра" v-model:value="selectedPerk.notes" />

                <Header2 class="justify-self-start col-span-full mx-2"
                    :label="'Рівні перку(' + selectedPerk.ranks + '):'" />

                <ArraySingleStringForm class="col-span-full" v-model:array="selectedPerk.levels" array_name="levels"
                    label="Опис кожного рівня" />

            </section>

        </section>


    </section>

    <div v-if="store.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>