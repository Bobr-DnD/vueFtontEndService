<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/24/solid'

import { reconnectCount } from '@ws/webSocket'
import { useSessionStore } from '@/stores/sessionStore'
import { useFightStore } from '@/stores/fightStore'

import DesktopOnlyGate from '@/components/reusable/DesktopOnlyGate.vue'
import BattleMap from '@/components/fight-page components/BattleMap.vue'
import EnemyBar from '@/components/fight-page components/EnemyBar.vue'
import FightStatsPanel from '@/components/fight-page components/FightStatsPanel.vue'
import DiceRollerModal from '@/components/character-page components/DiceRollerModal.vue'
import DiceLoader from '@/components/reusable/Loaders/DiceLoader.vue'

// Mode is derived from the route: a characterId param means this is the
// player's own view (bound to that one character); its absence means this
// is the admin/GM live view (/admin/:sessionId/fight/:fightId/live).
const route = useRoute()
const router = useRouter()
const sessionId = computed(() => route.params.sessionId)
const characterId = computed(() => route.params.characterId ?? null)
const isGM = computed(() => !characterId.value)

const sessionStore = useSessionStore()
const fightStore = useFightStore()

const pickedToken = ref(null)
const selectedEnemyId = ref(null)
const diceModalHidden = ref(true)

onMounted(() => {
    fightStore.joinFight(sessionId.value)
})

onBeforeUnmount(() => {
    fightStore.leaveFight()
})

// A dropped connection (phone screen lock, flaky wifi) rejoins the session
// room automatically elsewhere (AdminGenericView/SessionGenericView), but
// the fight subscription is separate and needs its own re-join or the map
// silently stops updating after a reconnect.
watch(reconnectCount, () => {
    fightStore.joinFight(sessionId.value)
})

const fight = computed(() => fightStore.fight)

const myCharacter = computed(() => {
    if (!characterId.value) return null
    return sessionStore.session.characters.find(c => c.id === characterId.value) ?? null
})

const selectedEnemy = computed(() => {
    if (!fight.value) return null
    return fight.value.enemies.find(e => e.id === selectedEnemyId.value) ?? null
})

// Only the admin arranges the board - players just watch it update.
function canMoveToken() {
    return isGM.value
}

function onPickToken(token) {
    pickedToken.value = (pickedToken.value?.type === token.type && pickedToken.value?.id === token.id)
        ? null
        : token
}

function onMoveToTile(tileId) {
    if (!pickedToken.value || !fight.value) return
    fightStore.move(sessionId.value, fight.value.id, pickedToken.value.type, pickedToken.value.id, tileId)
    pickedToken.value = null
}

function onUpdateEnemyHealth({ healthId, value }) {
    if (!selectedEnemy.value) return

    const enemies = fight.value.enemies.map(e => e.id !== selectedEnemy.value.id ? e : {
        ...e,
        health: e.health.map(h => h.id === healthId ? { ...h, value } : h)
    })

    fightStore.adminUpdate(sessionId.value, fight.value.id, [{ op: 'replace', path: '/enemies', value: enemies }])
}

function goBack() {
    router.back()
}
</script>

<template>
    <DesktopOnlyGate>
        <div class="min-h-screen bg-brand-page flex flex-col">

            <div v-if="fightStore.isLoading" class="flex-1 flex items-center justify-center">
                <DiceLoader />
            </div>

            <div v-else-if="!fight" class="flex-1 flex items-center justify-center text-brand-text font-gothic text-xl">
                Активного бою немає
            </div>

            <template v-else>
                <EnemyBar :enemies="fight.enemies" :participants="fight.participants"
                    :allCharacters="sessionStore.session.characters" :isAdmin="isGM" :selectedEnemyId="selectedEnemyId"
                    @select="selectedEnemyId = $event">
                    <template #actions>
                        <button @click="goBack"
                            class="flex items-center gap-1 px-3 h-10 rounded-lg bg-brand-surface text-brand-text md:hover:cursor-pointer">
                            <ArrowLeftIcon class="w-5 h-5" />
                            <span class="text-sm">Назад</span>
                        </button>
                    </template>
                </EnemyBar>

                <div class="flex-1 p-2 min-h-0">
                    <BattleMap :fight="fight" :characters="sessionStore.session.characters" :pickedToken="pickedToken"
                        :canMoveToken="canMoveToken" @pick-token="onPickToken" @move-to-tile="onMoveToTile" />
                </div>

                <div class="p-2 grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-2">
                    <FightStatsPanel :isAdmin="isGM" :selectedEnemy="selectedEnemy" :character="myCharacter"
                        :perks="sessionStore.session.perks" :entities="sessionStore.session.entities"
                        @update-enemy-health="onUpdateEnemyHealth" />

                    <button @click="diceModalHidden = false"
                        class="h-full min-h-[96px] flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-brand-surface bg-brand-base text-brand-text font-gothic md:hover:bg-brand-surface md:hover:cursor-pointer">
                        <span class="text-3xl">🎲</span>
                        <span class="text-sm">Кинути кубик</span>
                    </button>
                </div>
            </template>

            <DiceRollerModal v-if="!diceModalHidden" @close="diceModalHidden = true" />
        </div>
    </DesktopOnlyGate>
</template>
