<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { asyncHandler } from '@utils/asyncHandler'
import RepositoryFactory from '@http/RepositoryFactory'
import { notify } from '@utils/notification'
import CardsLoader from '@/components/reusable/Loaders/CardsLoader.vue'
import Navigation from '@/components/navigations/Navigation.vue'
import SessionCard from '@/components/reusable/SessionCard.vue'
import SearchInputBlack from '@/components/reusable/SearchInputs/SearchInputBlack.vue'
import PlusButton from '@/components/reusable/Buttons/PlusButton.vue'
import InputPassword from '@/components/reusable/Inputs/InputPassword.vue'
import InputName from '@/components/reusable/Inputs/InputName.vue'
import CloseButtonRedBG from '@/components/reusable/Buttons/CloseButtonRedBG.vue'
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue'
import Header1 from '@/components/reusable/Titles/Header1.vue'

const sessions = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const modalShow = ref(false)
const newPass = ref('')
const confirmPass = ref('')
const sessionName = ref('')

onMounted(async () => {
  const [res, err] = await asyncHandler(
    RepositoryFactory.get('session/details')
  )
  if (err) return

  sessions.value = res.data
  isLoading.value = false
})

const filteredSessions = computed(() => {
  if (!searchQuery.value.trim()) {
    return sessions.value
  }

  const query = searchQuery.value.toLowerCase()
  return sessions.value.filter(el =>
    el.name.toLowerCase().includes(query)
  )
})

async function createSession() {
  const validationErrors = validateForm()

  if (validationErrors.length > 0) {
    validationErrors.forEach(error => notify({ message: error, type: 'error' }))
    return
  }

  isLoading.value = true
  modalShow.value = false

  const [newSessionRes, newSessionErr] = await asyncHandler(
    RepositoryFactory.create('session', {
      password: newPass.value.trim(),
      name: sessionName.value.trim()
    })
  )
  if (newSessionErr) {
    isLoading.value = false
    return
  }

  const [res, err] = await asyncHandler(
    RepositoryFactory.get('session/details')
  )

  if (err) {
    isLoading.value = false
    return
  }

  sessions.value = res.data
  isLoading.value = false

  clearModalValues()
}

function validateForm() {
  const errors = []

  if (newPass.value.trim().length < 8) {
    errors.push('Мінімальна довжина пароля - 8 символів')
  }

  if (newPass.value !== confirmPass.value) {
    errors.push('Паролі не співпадають')
  }

  if (!sessionName.value.trim()) {
    errors.push('Введіть назву сесії')
  }

  return errors
}

function clearModalValues() {
  newPass.value = ''
  confirmPass.value = ''
  sessionName.value = ''
}

watch(modalShow, () => clearModalValues())
</script>

<template>
  <Navigation />

  <div v-if="!isLoading" class="mx-auto my-4 w-96 flex flex-col gap-2">
    <SearchInputBlack v-model:searchQuery="searchQuery" />

    <div @click="modalShow = !modalShow"
      class="border-8 border-darkred-dark rounded-2xl flex justify-center items-center hover:cursor-pointer hover:bg-darkred-dark_gray hover:text-darkred-light">
      <PlusButton class="w-20" />
    </div>
  </div>

  <div class="lg:w-full flex lg:flex-row flex-col gap-8 justify-center pb-4">
    <SessionCard v-if="!isLoading" v-for="session in filteredSessions" :key="session.id" :id="session.id"
      :name="session.name" :image="session.image" />
  </div>

  <div v-if="isLoading" class="h-full flex justify-center items-center">
    <CardsLoader />
  </div>

  <div v-if="modalShow" @click="modalShow = false" class="modal-overlay flex justify-center items-center">
    <div @click.stop
      class="max-w-[480px] w-full mx-2 p-2 grid grid-cols-1 gap-2 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative font-gothic md:hover:cursor-default">

      <CloseButtonRedBG @click="modalShow = false" />
      <Header1 label="Створити сесію:" class="px-1" />

      <form @submit.prevent="createSession" class="flex flex-col gap-2">
        <InputName v-model:nameString="sessionName" />
        <InputPassword :new="true" v-model:passString="newPass" />
        <InputPassword :confirm="true" v-model:passString="confirmPass" />
      </form>

      <AprroveButtonWithText @click="createSession" text="Створити сесію" />
    </div>
  </div>
</template>

<style scoped></style>