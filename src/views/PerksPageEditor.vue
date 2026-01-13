<script setup>
import { reactive, ref, onMounted, toRaw, computed } from 'vue';
import { useRoute } from 'vue-router';
import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '@utils/asyncHandler';
import { notify } from '@utils/notification';
import { toNewPerk, toObject } from '@utils/objects.dto';
import { checkObjectFieldExisting } from '@utils/entityHelper';
import { socket } from '@ws/webSocket';

import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue';
import Loader from 'vue-spinner/src/SyncLoader.vue'
import SearchInputBlack from '@/components/reusable/SearchInputs/SearchInputBlack.vue';
import Header1 from '@/components/reusable/Titles/Header1.vue';
import Header2 from '@/components/reusable/Titles/Header2.vue';
import PlusButton from '@/components/reusable/Buttons/PlusButton.vue';
import PerkTile from '@/components/reusable/EntityTiles/PerkTile.vue';
import SingleFieldEditor from '@/components/reusable/SingleFieldEditor.vue';
import DropDownChoosen from '@/components/reusable/DropDowns/DropDownChoosen.vue';
import TextAreaEditor from '@/components/reusable/TextAreaEditor.vue';
import ArraySingleStringForm from '@/components/reusable/Forms/ArraySingleStringForm.vue';
import TextDropdown from '@/components/character-page components/TextDropdown.vue';
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue';
import UnsavedLabel from '@/components/reusable/UnsavedLabel.vue';
import DeleteButton from '@/components/reusable/Buttons/DeleteButton.vue';

const sessionId = useRoute().params.sessionId
const searchQuery = ref('')
const selectedPerk = ref(toNewPerk({}))
const perkNewRequirement = ref({})

const state = reactive({
    isLoading: true,
    session: {},
    unsavedChanges: false
})

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

const filteredPerks = computed(() => {
    const perks = state.session.perks;

    if (!searchQuery.value.trim()) {
        return [...perks];
    }

    const query = searchQuery.value.toLowerCase();

    return perks.filter(el =>
        el.name.toLowerCase().includes(query)
    );
});

async function savePerk() {
    if (selectedPerk.value.id === 'new') {

        const perk = toRaw(selectedPerk.value)
        perk.session = sessionId

        const [res, err] = await asyncHandler(
            RepositoryFactory.create('perk', perk)
        )
        if (err) return

        selectedPerk.value = toNewPerk({})
    }
    else {
        const perk = toRaw(selectedPerk.value)
        console.log(perk);
        
        const [res, err] = await asyncHandler(
            RepositoryFactory.update('perk', perk.id, perk)
        )
        if (err) return
    }

    const [res, err] = await asyncHandler(
        RepositoryFactory.getById('session', sessionId)
    )
    if (err) return

    state.session = res.data
    state.unsavedChanges = false
    selectedPerk.value = toNewPerk({})

    notify({ message: 'Зміни збережені', type: 'info' })
    socket.emit('session:updateEverywhere', sessionId)
}

async function deletePerk() {
    const [resPerk, errPerk] = await asyncHandler(
        RepositoryFactory.delete('perk', toRaw(selectedPerk.value.id))
    )
    if (errPerk) return

    const [resSession, errSession] = await asyncHandler(
        RepositoryFactory.getById('session', sessionId)
    )
    if (errSession) return

    state.session = resSession.data
    state.unsavedChanges = false
    selectedPerk.value = toNewPerk({})

    notify({ message: 'Ефект видалено', type: 'info' })
    socket.emit('session:updateEverywhere', sessionId)
}

function discardChanges() {
    selectedPerk.value = toNewPerk(structuredClone(toRaw(state.session.perks.find(perk => perk.id === selectedPerk.value.id))))
    state.unsavedChanges = false
    notify({ message: 'Зміни анульовані', type: 'warning' })
}

function selectPerk(perk) {
    if (state.unsavedChanges) {
        const confirmSwitch = confirm('Є незбережені зміни. Вийти без збереження?')
        if (!confirmSwitch) return
    }

    state.unsavedChanges = false
    perkNewRequirement.value = { name: perkNewRequirement.value.name }

    selectedPerk.value = toNewPerk(structuredClone(toRaw(perk)))
}

function markUnsaved() {
    state.unsavedChanges = true;
}

function updatePerkField(field, value) {
    selectedPerk.value[field] = value
    markUnsaved()
}

function getPerkType(id) {
    const type = state.session.perkTypes.find(el => el.id === id)

    selectedPerk.value.type.name = type.name
    selectedPerk.value.type.color = type.color

    if (selectedPerk.value.id !== 'new') markUnsaved()
}

function updatePerkDescriptions(field, array) {
    selectedPerk.value[field] = array
    selectedPerk.value.ranks = array.length
    markUnsaved()
}

function updateEffectCharacteristics() {
    if (perkNewRequirement.value.value)
        Object.assign(selectedPerk.value.requirement, toObject(perkNewRequirement.value))
    else notify({ message: 'Вкажіть значення', type: 'error' })
    markUnsaved()
}

function getCharacteristicType(id) {
    const type = state.session.characteristicsList.find(el => el.id === id)
    perkNewRequirement.value.name = type.name
}
function getCharacteristicValue(fieldName, value) {
    perkNewRequirement.value[fieldName] = value
}

function removePerkSingleRequirement(key) {
    delete selectedPerk.value.requirement[key]
    markUnsaved()
}

</script>

<template>

    <MasterPageNavigation />

    <section v-if="!state.isLoading" class="m-4 grid grid-cols-1 gap-4">
        <Header1 label="Усі перки:" />

        <SearchInputBlack v-model:searchQuery="searchQuery" />

        <div class="grid grid-cols-4 gap-4 py-2 max-h-[512px] overflow-y-scroll no-scrollbar">
            <div @click="selectPerk({})" :class="selectedPerk.id === 'new' && 'bg-darkred-dark_gray text-darkred-light'"
                class="border-8 border-darkred-dark rounded-2xl flex justify-center items-center hover:cursor-pointer">
                <PlusButton class="w-20" />
            </div>

            <PerkTile v-for="perk in filteredPerks" :perk="perk" @click="selectPerk(perk)"
                :class="selectedPerk.id === perk.id && 'outline outline-4 outline-offset-[-1px] outline-darkred-red'" />
        </div>

    </section>

    <section v-if="!state.isLoading" class="m-4 flex gap-2 items-center">
        <AprroveButtonWithText :class="[!state.unsavedChanges && 'pointer-events-none opacity-50']"
            text="Зберегти зміни" @click="savePerk" />

        <RejectButtonWithText :class="[!state.unsavedChanges && 'pointer-events-none opacity-50']" text="Відмінити"
            @click="discardChanges" />

        <RejectButtonWithText v-if="selectedPerk.id !== 'new'" text="Видалити ефект" @click="deletePerk" />

        <UnsavedLabel v-if="state.unsavedChanges" />
    </section>

    <section v-if="!state.isLoading" class="m-4 grid grid-cols-3 gap-4">
        <Header1 class="col-span-full" label="Створити\Редагувати перк:" />

        <SingleFieldEditor class="col-span-2" placeholder="Назва" fieldName="name" :value="selectedPerk.name"
            :callback="updatePerkField" type="text" :important="true" />

        <DropDownChoosen label="Тип перку" entity_name="perkType" :selected="selectedPerk.type.name"
            :entity_array="state.session.perkTypes" :callback="getPerkType" />

        <TextAreaEditor class="col-span-full" fieldName="notes" name="Записки" :value="selectedPerk.notes"
            :callback="updatePerkField" />

    </section>

    <section v-if="!state.isLoading" class="m-4 grid grid-cols-1 gap-4">

        <Header1 label="Вимоги перка для отримання:" />

        <div class="col-span-2 flex flex-wrap gap-4">
            <div v-if="checkObjectFieldExisting(selectedPerk.requirement)"
                v-for="value, key in selectedPerk.requirement"
                class="flex gap-3 items-center p-3 w-fit rounded-lg bg-darkred-dark text-darkred-light">
                <div>
                    {{ key }}: {{ value }}
                </div>
                <DeleteButton @click="removePerkSingleRequirement(key)" class="bg-darkred-red w-10" />

            </div>
            <div v-else class="">
                Пусто
            </div>

        </div>

        <div class="col-span-2 justify-self-center flex gap-2 items-center">
            <TextDropdown label="Характеристика" :entity_array="state.session.characteristicsList"
                entity_name="perkRequirement" :callback="getCharacteristicType" />
            <SingleFieldEditor placeholder="Значення" fieldName="value" type="number" :value="perkNewRequirement.value"
                :callback="getCharacteristicValue" />
            <div class="pb-2 self-end">
                <AprroveButtonWithText @click="updateEffectCharacteristics" text="Додати поле" />
            </div>

        </div>

    </section>

    <section v-if="!state.isLoading" class="m-4 grid grid-cols-1 gap-4 justify-items-center">

        <Header1 class="justify-self-start" :label="'Рівні перку(' + selectedPerk.ranks + '):'" />

        <ArraySingleStringForm class="w-[768px]" :array="selectedPerk.descriptions" array_name="descriptions"
            label="Опис кожного рівня" :callback="updatePerkDescriptions" />

    </section>


    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>