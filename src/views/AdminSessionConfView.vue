<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import Session from '@http/sessionRepository'
import MasterPageNavigation from '@/components/MasterPageNavigation.vue';
import FormNumber from '@/components/FormNumber.vue';
import FormString from '@/components/FormString.vue';
import FormList from '@/components/FormList.vue';

const id = useRoute().params.id
const state = reactive({
    session: {}
})

let currency = ref([])
let fields = ref([])

onMounted(async () => {
    try {
        const res = await Session.getById(id)
        state.session = res.data

        currency = Object.entries(state.session.currency).map(([key]) => `${key}`)
        fields = Object.entries(state.session.customFields).map(([key]) => `${key}`)

    } catch (err) {
        console.error(err)
    }
})
</script>

<template>
    <MasterPageNavigation />

    <FormString v-if="state.session.name" label="sessionName" :entity_name="state.session.name"
        v-model:value="state.session.name" />
    <FormNumber v-if="state.session.currency" v-for="c in currency" label="currency" :entity_name="c" v-model:value="state.session.currency[c]" />
    <FormNumber v-if="state.session.move" label="move" entity_name="Хід" v-model:value="state.session.move" />
    <FormNumber v-if="state.session.customFields" v-for="field in fields" label="customFields" :entity_name="field" v-model:value="state.session.customFields[field]" />

    <FormList v-if="state.session.characters" :options="state.session.characters"/>

    <h1>Ім'я {{ state.session.name }}</h1>
    <h1>Валюта {{ state.session.currency }}</h1>
    <h1>Хід {{ state.session.move }}</h1>
    <h1>Кастомні поля {{ state.session.customFields }}</h1>
    <br>
    <h1 v-for="character in state.session.characters">Персонаж {{ character.name }}</h1>
    <h1 v-for="fraction in state.session.fractions">Фракціz {{ fraction.name }}</h1>
    <h1 v-for="quest in state.session.quests">Квест {{ quest.name }}</h1>

</template>

<style scoped></style>
