<script setup>
const props = defineProps({
    character: {
        type: Object,
        type: true
    }
})

</script>

<template>
    <div class="w-md">
        <div class="w-full mb-3 flex flex-col items-center">
            <img class="w-4/5 mb-3 h-32 object-cover border-2 border-darkred-red rounded-lg shadow-lg"
                src="https://placehold.co/400x200?text=Character" alt="Session image" />
            <div class="">{{ props.character.name }}</div>
        </div>

        <div class="flex justify-around items-center mb-2">
            <div>Стать: {{ props.character.gender }}</div>
            <div>Клас: {{ props.character.class }}</div>
        </div>

        <div class="grid auto-rows-max grid-cols-2 items-center justify-items-center mb-3">
            <div>Рівень: {{ props.character.level }}</div>
            <div>Досвід: {{ props.character.experience }}/{{ props.character.experienceToLevelUp }}</div>
            <div class="col-span-2">Здоров'я: {{ props.character.health }}/{{ props.character.maxHealth }}</div>
        </div>

        <div>
            <div class="text-center">Характеристики:</div>
            <div class="flex items-center justify-start">
                <div class="p-2" v-for="c, index in props.character.characteristics">
                    <div class="text-center">{{ index }}</div>
                    <hr>
                    <div class="text-center">{{ c }}</div>
                </div>
            </div>
        </div>

        <div>
            <div>Додаткові характеристики:</div>
            <div class="flex flex-col items-start justify-center">
                <div class="p-2" v-for="c, index in props.character.customFields">
                    <div class="text-center">•{{ index }}: {{ c }}</div>
                </div>
            </div>
        </div>
    </div>

</template>