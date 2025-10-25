<script setup>
import { ref } from 'vue';
import DeleteButton from '@/components/reusable/DeleteButton.vue';

const props = defineProps({
    characters: {
        type: Array,
        required: true
    },
    effects: {
        type: Array,
        required: true
    },
    callbackAdd: {
        type: Function,
        required: true
    },
    callbackRemove: {
        type: Function,
        required: true
    }
})

let effect_id = ref(props.effects[0].id)
let character_id = ref(props.characters[0].id)
let character = ref(props.characters[0])

function changeCharacter(event) {
    character_id.value = event.target.value
    props.characters.forEach(ch => {
        if (ch.id === character_id.value) character.value = ch
    })
}
</script>

<template>

    <select @change="changeCharacter" name="Effect_Characters" class="block w-64 px-4 py-2 my-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-xl font-gothic font-medium shadow-sm
         focus:outline-none focus:ring-2 focus:ring-darkred-bright focus:border-darkred-bright">
        <option v-for="character in props.characters" :key="character.id" :value="character.id"
            class="bg-darkred-light text-darkred-dark font-gothic font-medium">
            {{ character.name }}
        </option>
    </select>

    <select @change="event => effect_id = event.target.value" name="Effects" class="block w-64 px-4 py-2 my-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-xl font-gothic font-medium shadow-sm
         focus:outline-none focus:ring-2 focus:ring-darkred-bright focus:border-darkred-bright">
        <option v-for="effect in props.effects" :key="effect.id" :value="effect.id"
            class="bg-darkred-light text-darkred-dark font-gothic font-medium">
            {{ effect.name }}
        </option>
    </select>

    <button @click="props.callbackAdd(character_id, effect_id)" class="px-6 py-3 my-2 rounded-xl border-4 border-darkred-red text-darkred-dark font-univers font-semibold text-lg
         hover:bg-darkred-red hover:text-darkred-light transition-colors duration-300">Додати еффект</button>

    <div class="bg-darkred-gray rounded-lg shadow-[rgba(0,0,0,0.5)_0px_8px_20px_4px] p-4 my-4 text-darkred-light">

        <div
            class="grid grid-cols-4 gap-2 justify-items-center items-center  rounded-lg font-medium text-lg bg-darkred-dark_gray">
            <div class="rounded-md p-2 w-full text-center">Назва</div>
            <div class="rounded-md p-2 w-full text-center">Інформація</div>
            <div class="rounded-md p-2 w-full text-center">Тривалість</div>
            <div class="rounded-md p-2 w-full text-center">Видалити</div>
        </div>

        <div class="grid grid-cols-4 gap-2 justify-items-center items-center font-medium text-md rounded-lg bg-darkred-dark_gray p-2 mt-2"
            v-for="effect in character.effects">
            <div class="p-2 rounded-md  w-full text-center">{{ effect.effect.description }}</div>
            <div class="p-2 rounded-md w-full text-center">{{ effect.effect.name }}</div>
            <div class="p-2 rounded-md w-full text-center">{{ effect.timeLeft }}</div>
            <DeleteButton @click="props.callbackRemove(character_id, effect.effect.id)" class="text-center w-16" />

        </div>
    </div>

</template>