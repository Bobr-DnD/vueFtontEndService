<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftIcon, HandRaisedIcon } from '@heroicons/vue/24/solid'

import { socket, reconnectCount } from '@ws/webSocket'
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
const fightIdParam = computed(() => route.params.fightId ?? null)
const isGM = computed(() => !characterId.value)

const sessionStore = useSessionStore()
const fightStore = useFightStore()

const pickedToken = ref(null)
const selectedEnemyId = ref(null)
const diceModalHidden = ref(true)
// Movement is opt-in: a stray click while just looking at the board (e.g.
// picking an enemy to check its stats) should never accidentally queue up a
// move. Toggling this off also cancels anything mid-pick.
const moveModeActive = ref(false)

function doJoin() {
    fightStore.joinFight(sessionId.value, isGM.value ? fightIdParam.value : null)
}

// CharacterPageView disconnects the character from the session member when
// it unmounts (session:disconnectCharacter) - which happens the moment the
// player navigates here via "Open Fight". Without reconnecting it, the room
// member's userId stays null, so the server never adds this character as a
// fight participant and never recognizes moves as "your own token". The ack
// callback matters: connectCharacter awaits a DB call before the userId is
// actually set, so joining the fight immediately after firing-and-forgetting
// the connect would race it.
const CONNECT_RETRY_DELAY_MS = 300
const CONNECT_RETRY_LIMIT = 5

function connectThenJoin(attempt = 0) {
    if (!characterId.value) {
        doJoin()
        return
    }

    socket.emit('session:connectCharacter', sessionId.value, characterId.value, (ack) => {
        // ok:false here most often means this socket isn't registered as a
        // session member *yet* - session:join (done by the parent
        // SessionGenericView) also awaits a DB call before the room
        // membership is actually in place, so a fresh page load can have
        // this fire before that's done. Retrying briefly covers that startup
        // race instead of silently never adding this character to the fight.
        if (ack?.ok === false && attempt < CONNECT_RETRY_LIMIT) {
            setTimeout(() => connectThenJoin(attempt + 1), CONNECT_RETRY_DELAY_MS)
            return
        }
        doJoin()
    })
}

onMounted(connectThenJoin)

onBeforeUnmount(() => {
    fightStore.leaveFight()
    if (characterId.value) socket.emit('session:disconnectCharacter', sessionId.value)
})

// A dropped connection (phone screen lock, flaky wifi) rejoins the session
// room automatically elsewhere (AdminGenericView/SessionGenericView), but
// that only restores room membership, not the connected-character link, and
// the fight subscription is separate too - both need their own re-join or
// the map silently stops updating / loses "move my own token" permission.
watch(reconnectCount, connectThenJoin)

const fight = computed(() => fightStore.fight)

const myCharacter = computed(() => {
    if (!characterId.value) return null
    return sessionStore.session.characters.find(c => c.id === characterId.value) ?? null
})

const selectedEnemy = computed(() => {
    if (!fight.value) return null
    return fight.value.enemies.find(e => e.id === selectedEnemyId.value) ?? null
})

// Admin can reposition anything on the board; a player can only reposition
// their own connected character token - and only while movement mode is on.
function canMoveToken(token) {
    if (!moveModeActive.value) return false
    if (isGM.value) return true
    return token.type === 'character' && token.id === characterId.value
}

function toggleMoveMode() {
    moveModeActive.value = !moveModeActive.value
    if (!moveModeActive.value) pickedToken.value = null
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
                        <button @click="toggleMoveMode" :class="moveModeActive ? 'bg-state-success text-state-text-white' : 'bg-brand-surface text-brand-text'"
                            class="flex items-center gap-1 px-3 h-10 rounded-lg md:hover:cursor-pointer">
                            <HandRaisedIcon class="w-5 h-5" />
                            <span class="text-sm">{{ moveModeActive ? 'Рух: увімкнено' : 'Рух: вимкнено' }}</span>
                        </button>

                        <button @click="goBack"
                            class="flex items-center gap-1 px-3 h-10 rounded-lg bg-brand-surface text-brand-text md:hover:cursor-pointer">
                            <ArrowLeftIcon class="w-5 h-5" />
                            <span class="text-sm">Назад</span>
                        </button>
                    </template>
                </EnemyBar>

                <div class="flex-1 p-2 min-h-0">
                    <BattleMap :fight="fight" :characters="sessionStore.session.characters" :pickedToken="pickedToken"
                        :canMoveToken="canMoveToken" :myCharacterId="characterId" @pick-token="onPickToken"
                        @move-to-tile="onMoveToTile" />
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
