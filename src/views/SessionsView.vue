<script setup>
import { reactive, onMounted, computed, ref, toRaw } from 'vue'
import { asyncHandler } from '@utils/asyncHandler'
import RepositoryFactory from '@http/RepositoryFactory'
import { notify } from '@utils/notification'

import Loader from 'vue-spinner/src/SyncLoader.vue'
import Navigation from '@/components/navigations/Navigation.vue'
import SessionCard from '@/components/reusable/SessionCard.vue'
import SearchInputBlack from '@/components/reusable/SearchInputs/SearchInputBlack.vue'
import PlusButton from '@/components/reusable/Buttons/PlusButton.vue'
import InputPassword from '@/components/reusable/Inputs/InputPassword.vue'
import InputName from '@/components/reusable/Inputs/InputName.vue'
import CloseButtonRedBG from '@/components/reusable/Buttons/CloseButtonRedBG.vue'
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue'
import Header1 from '@/components/reusable/Titles/Header1.vue'

const state = reactive({
  sessions: [],
  isLoading: true
})

const searchQuery = ref('')
const modalShow = ref(false)
const newPass = ref('')
const confirmPass = ref('')
const sessionName = ref('')

onMounted(async () => {

  const [res, err] = await asyncHandler(
    RepositoryFactory.get('session')
  )
  if (err) return

  state.sessions = res.data
  state.isLoading = false
})

const filteredSessions = computed(() => {

  let sessions = toRaw(state.sessions)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    sessions = sessions.filter(el =>
      el.name.toLowerCase().includes(query)
    )
  }

  return sessions
})

async function createSession() {
  if (newPass.value.trim().length < 8) {
    notify({ message: 'Мінімальна довжина пароля - 8 символів', type: 'error' })
    return
  }

  if (newPass.value !== confirmPass.value) {
    notify({ message: 'Паролі не співпадають', type: 'error' })
    return
  }

  if (!sessionName.value.trim()) {
    notify({ message: 'Введіть назву сесії', type: 'error' })
    return
  }
  
  const [res, err] = await asyncHandler(
    RepositoryFactory.create('session', { password: toRaw(newPass.value.trim()), name: toRaw(sessionName.value.trim()) })
  )
  if(err) return

  state.sessions.push(res.data)
  modalShow.value = false
  
}

</script>

<template>
  <Navigation />

  <div v-if="!state.isLoading" class="mx-auto my-4 w-96 flex flex-col gap-2">
    <SearchInputBlack v-model:searchQuery="searchQuery" />

    <div @click="modalShow = !modalShow"
      class="border-8 border-darkred-dark rounded-2xl flex justify-center items-center hover:cursor-pointer hover:bg-darkred-dark_gray hover:text-darkred-light">

      <PlusButton class="w-20" />
    </div>

  </div>

  <SessionCard v-if="!state.isLoading" v-for="session in filteredSessions" :key="session.id" :id="session.id"
    :name="session.name" :image="session.image" />

  <div v-if="state.isLoading" class="text-center py-6">
    <Loader />
  </div>

  <div v-if="modalShow" @click="modalShow = false" class="modal-overlay flex justify-center items-center">

    <div @click.stop
      class="max-w-[480px] w-full mx-2 p-2 grid grid-cols-1 gap-2 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative font-gothic md:hover:cursor-default">

      <CloseButtonRedBG @click="modalShow = false" />
      <Header1 label="Свторити сесію:" class="px-1" />

      <InputName v-model:nameString="sessionName" />
      <InputPassword :new="true" v-model:passString="newPass" />
      <InputPassword :confirm="true" v-model:passString="confirmPass" />

      <AprroveButtonWithText @click="createSession" text="Створити сесію" />
    </div>

  </div>
</template>

<style scoped></style>