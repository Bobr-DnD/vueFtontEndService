<script setup>
import { ref, watch, toRaw, onMounted } from 'vue';
import { removeRow } from '@utils/entityHelper';
import AprroveButtonWithText from '../reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '../reusable/Buttons/RejectButtonWithText.vue';
import PlusButton from '../reusable/Buttons/PlusButton.vue';
import DeleteButton from '../reusable/Buttons/DeleteButton.vue';
import UnsavedLabel from '../reusable/UnsavedLabel.vue';

const stepsCopy = ref(null)
const unsavedChanges = ref(false)

const props = defineProps({
    steps: {
        type: Array,
        required: true
    },
    types: {
        type: Array,
        required: true
    },
    callback: {
        type: Function,
        required: true
    }
})

onMounted(() => {
    discardChanges()
})

watch(() => props.steps, () => {
    discardChanges()
})

function discardChanges() {
    stepsCopy.value = structuredClone(toRaw(props.steps))
    unsavedChanges.value = false
}

function getQuestType(typeId, stepId) {
    const type = props.types.find(el => el.id === typeId)
    stepsCopy.value.forEach(step => {
        if (step.id === stepId) step.status = type.name
    });
    unsavedChanges.value = true
}

function changeName(stepId, value) {
    stepsCopy.value.forEach(step => {
        if (step.id === stepId) step.name = value
    });
    unsavedChanges.value = true
}

function removeStep(id) {
    removeRow(stepsCopy.value, id)
    unsavedChanges.value = true
}

function addStep() {
    stepsCopy.value.push({ name: '', id: Math.random().toString(24).slice(2), status: props.types[0].name })
    unsavedChanges.value = true
}

</script>

<template>

    <div class="flex flex-col gap-4">
        <div v-for="step in stepsCopy" class="flex gap-3">

            <form @submit.prevent class="flex flex-col items-start justify-center w-full">

                <input @change="changeName(step.id, $event.target.value)" :id="step.id" type="text" :value="step.name"
                    placeholder="Опис етапу"
                    class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full placeholder-darkred-gray transition-all duration-200" />

            </form>

            <div class="text-lg font-gothic">

                <select @change="getQuestType($event.target.value, step.id)" :id="step.id"
                    class="w-fit appearance-none px-2 py-1 bg-darkred-light border-4 border-darkred-dark rounded-lg text-darkred-dark font-gothic focus:outline-none focus:ring-2 focus:ring-darkred-dark transition cursor-pointer">

                    <option v-for="entity in props.types" :value="entity.id" :selected="entity.name === step.name">
                        {{ entity.name }}
                    </option>

                </select>

            </div>

            <DeleteButton class="bg-darkred-red text-darkred-light w-16" @click="removeStep(step.id)" />

        </div>

        <div class="flex gap-4 items-center">

            <PlusButton @click="addStep" class="w-12 border-4 border-darkred-dark rounded-lg" />

            <AprroveButtonWithText @click="props.callback(stepsCopy)" text="Зберегти зміни" class="w-fit" />

            <RejectButtonWithText @click="discardChanges" text="Відхилити зміни" class="w-fit" />

            <UnsavedLabel v-if="unsavedChanges" />

        </div>

    </div>

</template>