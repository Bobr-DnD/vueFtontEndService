<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import RepositoryFactory from '@http/RepositoryFactory';
import Loader from 'vue-spinner/src/SyncLoader.vue'
import SessionViewNavigtaion from '@/components/SessionViewNavigtaion.vue';

const state = reactive({
    character: {},
    session: {},
    isLoading: true
})

let connected = ref(false)
let weapons_hidden = ref(false)
const id = useRoute().params.id

onMounted(async () => {
    try {
        let res = await RepositoryFactory.getById('character', id)
        state.character = res.data
        res = await RepositoryFactory.getById('session', state.character.session)
        state.session = res.data

    } catch (err) {
        console.error(err)
    }
    finally {
        state.isLoading = false
    }
})

function addExperience() {
    state.character.experience++;
    if (state.character.experience >= state.character.experienceToLevelUp) {
        state.character.experience = 0;
        state.character.perkPoints++;
    }
}
function deleteRow(index) {
    state.character.weapons.splice(index, 1) 
}
function addRow(){
    const weapon = state.session.weapons.filter(w=> w.id === event.target.value)[0]
    state.character.weapons.push(weapon)
    event.target.value = 'default'
}
</script>

<template>
    <SessionViewNavigtaion />

    <div v-if="!state.isLoading" class="w-80 mx-auto my-6 space-y-2 font-univers">

        <img class="w-full h-64 object-cover rounded-xl border-4 border-darkred-red shadow-md"
            src="https://placehold.co/400x200?text=Character" alt="Character image" />

        <h1 class="p-2 bg-darkred-dark text-darkred-light text-3xl font-bold text-center rounded-lg shadow font-gothic">
            {{ state.character.name }}
        </h1>

        <div class="flex flex-wrap items-center justify-center p-2 bg-darkred-dark_gray rounded-lg shadow-sm">
            <div class="grow text-center text-darkred-light font-medium text-lg">
                Стать: <span class="font-semibold">{{ state.character.gender }}</span>
            </div>
            <div class="grow text-center text-darkred-light font-medium text-lg">
                Клас: <span class="font-semibold">{{ state.character.class }}</span>
            </div>
        </div>

        <section>
            <h2 class="text-center text-2xl font-bold text-darkred-red mb-1">Характеристики</h2>
            <div class="flex flex-wrap items-center justify-center gap-2">
                <div v-for="c, index in state.character.characteristics"
                    class="grow p-2 text-center rounded-lg border-2 border-darkred-red bg-darkred-dark text-darkred-light font-semibold">
                    {{ index }} — {{ c }}
                </div>
            </div>
        </section>

        <section>
            <h2 class="text-center text-lg font-semibold text-gray-600 mb-2">Додаткові характеристики</h2>
            <div class="flex flex-grow items-center justify-center gap-2">
                <div v-for="c, index in state.character.customFields"
                    class="grow p-2 text-center rounded-md border border-gray-300 bg-gray-50 text-gray-700 text-sm">
                    {{ index }} — {{ c }}
                </div>
            </div>
        </section>

        <div class="flex flex-wrap items-center justify-start">
            <div class="p-1 grow ">
                <div class="p-2 border-2 rounded-md border-darkred-dark">
                    <div class="text-sm mb-1 text-center font-medium">
                        Здоров'я: {{ state.character.health }}/{{ state.character.maxHealth }}
                    </div>
                    <div class="w-full h-5 bg-gray-300 rounded overflow-hidden">
                        <div class="h-full transition-all duration-300" :class="{
                            'bg-green-500': state.character.health / state.character.maxHealth > 0.6,
                            'bg-yellow-400': state.character.health / state.character.maxHealth <= 0.6 && state.character.health / state.character.maxHealth > 0.3,
                            'bg-red-500': state.character.health / state.character.maxHealth <= 0.3
                        }" :style="{ width: (state.character.health / state.character.maxHealth * 100) + '%' }"></div>
                    </div>
                </div>
            </div>

            <div class="p-1 grow">
                <div class="p-1 grow ">
                    <div class="p-2 border-2 rounded-md border-darkred-dark">
                        <div class="text-sm mb-1 text-center font-medium">
                            Досвід: {{ state.character.experience }}/{{ state.character.experienceToLevelUp }}
                        </div>
                        <div class="w-full h-5 bg-gray-300 rounded overflow-hidden">
                            <div class="h-full transition-all duration-300" :class="{
                                'bg-green-500': state.character.experience / state.character.experienceToLevelUp > 0.6,
                                'bg-yellow-400': state.character.experience / state.character.experienceToLevelUp <= 0.6 && state.character.experience / state.character.experienceToLevelUp > 0.3,
                                'bg-red-500': state.character.experience / state.character.experienceToLevelUp <= 0.3
                            }"
                                :style="{ width: (state.character.experience / state.character.experienceToLevelUp * 100) + '%' }">
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="p-1 grow">
                <div class="p-2 text-center border-2 rounded-md border-darkred-dark"> Очки рівня: {{
                    state.character.perkPoints }} </div>
            </div>
            <div class="p-1 grow"> <button @click="addExperience" class="w-full h-full p-2 rounded-lg border-2 border-darkred-red bg-darkred-dark_gray 
                text-darkred-light font-semibold tracking-wide hover:bg-darkred-red hover:text-darkred-light active:bg-darkred-bright active:scale-95 
                transition-all duration-200 ease-in-out Fshadow-md hover:shadow-lg">
                    +1 досвід </button> </div>
        </div>
    </div>


    <div class="grid grid-cols-1 justify-items-center mx-auto min-w-fit max-w-sm">
        <h1
            class="w-4/5 text-center text-3xl font-bold text-darkred-dark_gray border-b-2 border-t-2 border-darkred-red rounded-lg mx-2">
            Інвентар</h1>

        <div class="mx-auto">
            <h1 @click="weapons_hidden = !weapons_hidden" class="mx-auto my-3 w-fit p-2 bg-gradient-to-tr from-darkred-bright to-darkred-dark_gray text-center text-3xl font-bold text-darkred-light border-2 
            rounded-md hover:cursor-pointer">Зброя</h1>
        </div>

        <div :class="['grid grid-cols-1 mx-2 max-w-full', weapons_hidden ? 'hidden' : '']">
            <div v-for="weapon, index in state.character.weapons" class="grid grid-cols-[1fr_1fr_1fr_1fr_30px] grid-rows-2 p-2 gap-2 items-center justify-items-center 
            bg-darkred-gray border-2 border-darkred-red rounded-lg text-darkred-dark text-sm font-medium my-2" :id="'Weapon' + `${index + 1}`">
                <div class="col-span-4 p2 text-clip ">{{ weapon.name }}</div>
                <div @click="deleteRow(index)"
                    class="row-span-2 p-2 text-clip w-full bg-darkred-red rounded-xl border-2 border-darkred-dark text-darkred-light font-medium hover:cursor-pointer">
                    X</div>
                <div class="col-span-2 p2 text-clip ">Урон: {{ weapon.damage }}</div>
                <div class="p2 text-clip ">Очки дії: {{ weapon.actionPoints }}</div>
                <div class="p2 text-clip ">Вимоги: {{Object.entries(weapon.requirement).map(([key, value]) =>
                    `${key}:${value}`).join(',')}}</div>

            </div>
        </div>
        <select name="Weapons" id="Weapons" @change="addRow"
            :class="[weapons_hidden ? 'hidden' : '', 'w-4/5 my-2 px-4 py-2 bg-darkred-light border border-darkred-dark rounded-md text-darkred-dark font-gothic', 
            'tracking-wide uppercase shadow-inner outline-none transition-all duration-200 focus:border-darkred-red focus:ring-2 focus:ring-darkred-red', 
            'hover:border-darkred-red text-center']">
            <option value="default" class="bg-darkred-dark text-darkred-bright">Виберіть зброю</option>
            <option v-for="weapon in state.session.weapons" :value="weapon.id"
                class="bg-darkred-dark text-darkred-bright">{{ weapon.name }} </option>
        </select>
    </div>


    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>