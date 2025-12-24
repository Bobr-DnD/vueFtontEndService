<script setup>
import { ref, onMounted, reactive, computed, toRaw } from 'vue';
import { useRoute } from 'vue-router';
import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '@utils/asyncHandler';
import { toNewQuest } from '@utils/objects.dto';
import { notify } from '@utils/notification';

import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue';
import SingleFieldEditor from '@/components/reusable/SingleFieldEditor.vue';
import SearchInputBlack from '@/components/reusable/SearchInputs/SearchInputBlack.vue';
import Header1 from '@/components/reusable/Titles/Header1.vue';
import Header2 from '@/components/reusable/Titles/Header2.vue';
import QuestTile from '@/components/reusable/EntityTiles/QuestTile.vue';
import PlusButton from '@/components/reusable/Buttons/PlusButton.vue';
import DropDownChoosen from '@/components/reusable/DropDowns/DropDownChoosen.vue';
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue';
import UnsavedLabel from '@/components/reusable/UnsavedLabel.vue';
import TextAreaEditor from '@/components/reusable/TextAreaEditor.vue';
import QuestsStepsFieldEditor from '@/components/admin-page components/QuestsStepsFieldEditor.vue';

const state = reactive({
    isLoading: true,
    session: {},
    unsavedChanges: false
})

const sessionId = useRoute().params.sessionId
const searchQuery = ref('')
const selectedQuest = ref(toNewQuest({}))


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

const filteredQuests = computed(() => {
    const quests = state.session.quests;

    if (!searchQuery.value.trim()) {
        return [...quests];
    }

    const query = searchQuery.value.toLowerCase();

    return quests.filter(el =>
        el.name.toLowerCase().includes(query)
    );
});

async function saveQuest() {

    const quest = selectedQuest.value
    quest.session = sessionId

    if (selectedQuest.value.id === 'new') {

        const [res, err] = await asyncHandler(
            RepositoryFactory.create('quest', quest)
        )
        if (err) return
        selectedQuest.value = toNewQuest({})
    }
    else {
        const [res, err] = await asyncHandler(
            RepositoryFactory.update('quest', quest.id, quest)
        )
        if (err) return
    }

    const [res, err] = await asyncHandler(
        RepositoryFactory.getById('session', sessionId)
    )
    if (err) return

    state.session = res.data
    state.unsavedChanges = false

    notify({ message: 'Зміни збережені', type: 'info' })
}

async function deleteQuest() {
    const [questRes, questErr] = await asyncHandler(
        RepositoryFactory.delete('quest', selectedQuest.value.id)
    )
    if (questErr) return

    const [sessionRes, sessionErr] = await asyncHandler(
        RepositoryFactory.getById('session', sessionId)
    )
    if (sessionErr) return

    state.session = sessionRes.data
    state.unsavedChanges = false
    selectedQuest.value = toNewQuest({})

    notify({ message: 'Квест видалено', type: 'info' })
}

async function discardChanges() {
    if (selectedQuest.value.id === 'new') selectedQuest.value = toNewQuest({})
    else {
        selectedQuest.value = state.session.quests.find(el => el.id === selectedQuest.value.id)
    }

    state.unsavedChanges = false
    notify({ message: 'Зміни анульовані', type: 'warning' })
}

function selectQuest(quest) {
    if (state.unsavedChanges) {
        const confirmSwitch = confirm('Є незбережені зміни. Вийти без збереження?')
        if (!confirmSwitch) return
    }

    state.unsavedChanges = false;
    selectedQuest.value = toNewQuest(quest)
}

function markUnsaved() {
    state.unsavedChanges = true
}

function updateQuestFields(field, value) {
    selectedQuest.value[field] = value
    markUnsaved()
}

function updateQuestSteps(steps) {
    selectedQuest.value.steps = steps
    markUnsaved()
}

function getQuestType(id) {
    const type = state.session.questTypes.find(el => el.id === id)
    selectedQuest.value.status = type.name
    if (selectedQuest.value.id !== 'new') markUnsaved()
}

</script>

<template>

    <MasterPageNavigation />

    <section v-if="!state.isLoading" class="m-4 grid grid-cols-1 gap-4">

        <Header1 label="Усі квести:" />

        <SearchInputBlack v-model:searchQuery="searchQuery" />

        <div class="grid grid-cols-4 gap-4 py-2 max-h-[512px] overflow-y-scroll no-scrollbar">

            <div @click="selectQuest({})" :class="selectedQuest.id === 'new' && 'bg-darkred-gray text-darkred-light'"
                class="border-8 border-darkred-dark rounded-2xl flex justify-center items-center hover:cursor-pointer">
                <PlusButton class="w-20" />
            </div>

            <QuestTile v-for="quest in filteredQuests" :quest="quest" @click="selectQuest(quest)"
                :class="selectedQuest.id === quest.id && 'outline outline-4 outline-offset-[-1px] outline-darkred-red'"
                class="hover:cursor-pointer" />
        </div>

    </section>

    <section v-if="!state.isLoading" class="m-4 flex gap-2 items-center">
        <AprroveButtonWithText :class="[!state.unsavedChanges && 'pointer-events-none opacity-50']"
            text="Зберегти зміни" @click="saveQuest" />

        <RejectButtonWithText :class="[!state.unsavedChanges && 'pointer-events-none opacity-50']" text="Відмінити"
            @click="discardChanges" />

        <RejectButtonWithText v-if="selectedQuest.id !== 'new'" text="Видалити квест" @click="deleteQuest" />

        <UnsavedLabel v-if="state.unsavedChanges" />

    </section>

    <section v-if="!state.isLoading" class="m-4 grid grid-cols-3 gap-4 items-center">

        <Header1 class="col-span-full" label="Створити\Редагувати квест:" />

        <SingleFieldEditor placeholder="Назва" fieldName="name" type="text" :important="true"
            :value="selectedQuest.name" :callback="updateQuestFields" class="col-span-2" />

        <DropDownChoosen label="Статус квесту" entity_name="questStatus" :entity_array="state.session.questTypes"
            :callback="getQuestType" :selected="selectedQuest.status" />

        <SingleFieldEditor placeholder="Опис" fieldName="description" type="text" :important="true"
            :value="selectedQuest.description" :callback="updateQuestFields" class="col-span-full" />

        <SingleFieldEditor placeholder="Винагорода" fieldName="reward" type="text" :value="selectedQuest.reward"
            :callback="updateQuestFields" class="col-span-full" />

        <TextAreaEditor fieldName="notes" name="Записки" :value="selectedQuest.notes" :callback="updateQuestFields"
            class="col-span-full" />

    </section>

    <section v-if="!state.isLoading" class="m-4 p-2 grid grid-cols-1 gap-4">
        <Header2 class="col-span-full" label="Етапи квесту:" />

        <div>
            <QuestsStepsFieldEditor :steps="selectedQuest.steps" :types="state.session.questTypes"
                :callback="updateQuestSteps" />
        </div>

    </section>

</template>