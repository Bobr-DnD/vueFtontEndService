<script setup>
const props = defineProps({
    character: {
        type: Object,
        type: true
    }
})

console.log(Object.keys(props.character.characteristics)[1]);

</script>

<template>
    <div class="w-80">
        <div class="w-full mb-3 flex flex-col items-center">
            <img class="w-full h-32 object-cover border-2 border-fallout-brown rounded-lg shadow-lg"
                src="https://placehold.co/400x200?text=Character" alt="Session image" />
            <div class="">{{ props.character.name }}</div>
        </div>
        <div class="flex justify-around items-center">
            <div>Стать: {{ props.character.gender }}</div>
            <div>Клас: {{ props.character.class }}</div>
        </div>
        <div class="flex justify-around items-center">
            <div>Рівень: {{ props.character.level }}</div>
            <div>Досвід: {{ props.character.experience }}/{{ props.character.experienceToLevelUp }}</div>
            <div>Здоров'я: {{ props.character.health }}/{{ props.character.maxHealth }}</div>
        </div>
        <div>
            <div>Характеристики:</div>
            <div class="grid ">
                <div v-for="c, index in props.character.characteristics">
                    <div>{{ index }}</div>
                    <div>{{ c }}</div>
                </div>
            </div>
            <div>Додаткові характеристики:</div>
            <div>
                <div v-for="c in props.character.customFields">{{ c }}</div>
            </div>
        </div>
    </div>

</template>