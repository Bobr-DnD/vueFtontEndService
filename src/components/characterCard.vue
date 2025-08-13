<script setup>
const props = defineProps({
    character: {
        type: Object,
        type: true
    }
})

</script>

<template>
    <div class="m-4 p-2 rounded-xl border-4 border-darkred-dark font-gothic text-lg">
        <div class="w-full mb-3 flex flex-col items-center">
            <img class="w-full mb-3 h-32 object-cover rounded-xl" src="https://placehold.co/400x200?text=Character"
                alt="Session image" />
            <div class="font-semibold text-2xl">{{ props.character.name }}</div>
        </div>

        <div class="flex justify-around items-center mb-2 border-b-2 border-darkred-bright rounded-lg">
            <div>Стать: {{ props.character.gender }}</div>
            <div>Клас: {{ props.character.class }}</div>
        </div>

        <div
            class="grid auto-rows-max grid-cols-2 items-center justify-items-center mb-3 border-y-2 border-darkred-bright rounded-md">
            <div>Рівень: {{ props.character.level }}</div>
            <div>Досвід: {{ props.character.experience }}/{{ props.character.experienceToLevelUp }}</div>
            <div class="col-span-2">Здоров'я: {{ props.character.health }}/{{ props.character.maxHealth }}</div>
        </div>

        <div>
            <div class="text-center">Характеристики:</div>
            <div class="grid grid-cols-4">
                <div class="p-2" v-for="c, index in props.character.characteristics">
                    <div class="p-1 text-center border-2 rounded-md border-darkred-dark">{{ index }} - {{ c }}</div>
                </div>
            </div>
        </div>

        <div>
            <div>Додаткові характеристики:</div>
            <div class="flex flex-col items-start justify-center">
                <div class="p-2 w-full" v-for="c, index in props.character.customFields">
                    <div class="text-start text-lg p-1 border-2 rounded-md border-darkred-dark">•{{ index }}: {{ c }}</div>
                </div>
            </div>
        </div>
    </div>

</template>