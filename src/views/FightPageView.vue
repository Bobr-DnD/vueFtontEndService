<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { reconnectCount } from '@ws/webSocket'
import { useSessionStore } from '@/stores/sessionStore'
import { useFightStore } from '@/stores/fightStore'

import DesktopOnlyGate from '@/components/reusable/DesktopOnlyGate.vue'
import BattleMap from '@/components/fight-page components/BattleMap.vue'
import EnemyBar from '@/components/fight-page components/EnemyBar.vue'
import FightSidePanel from '@/components/fight-page components/FightSidePanel.vue'
import CharacterSheetStrip from '@/components/fight-page components/CharacterSheetStrip.vue'
import DiceRollerModal from '@/components/character-page components/DiceRollerModal.vue'
import DiceLoader from '@/components/reusable/Loaders/DiceLoader.vue'
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue'

// Mode is derived from the route: a characterId param means this is the
// player's own view (bound to that one character); its absence means this
// is the admin/GM live view (/admin/:sessionId/fight/:fightId/live).
const route = useRoute()
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

const myParticipant = computed(() => {
    if (!fight.value || !characterId.value) return null
    return fight.value.participants.find(p => p.character === characterId.value) ?? null
})

const myCharacter = computed(() => {
    if (!characterId.value) return null
    return sessionStore.session.characters.find(c => c.id === characterId.value) ?? null
})

function canMoveToken(token) {
    if (isGM.value) return true
    return token.type === 'character' && token.id === characterId.value
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

const moverBudget = computed(() => {
    if (isGM.value || pickedToken.value?.type !== 'character') return null
    return myParticipant.value?.actionPoints?.current ?? 0
})

function onResolve({ characterId: cid, approve }) {
    fightStore.resolveAttack(sessionId.value, fight.value.id, cid, approve)
}

function onSetAP({ characterId: cid, current, max }) {
    fightStore.adminSetAP(sessionId.value, fight.value.id, cid, current, max)
}

function newRound() {
    fightStore.newRound(sessionId.value, fight.value.id)
}

function onSetActiveLoadout(loadoutId) {
    fightStore.setActiveLoadout(sessionId.value, fight.value.id, loadoutId)
}

function onSetActiveWeapon(entityId) {
    fightStore.setActiveWeapon(sessionId.value, fight.value.id, entityId)
}

function onReadyAttack(payload) {
    fightStore.readyAttack(sessionId.value, fight.value.id, payload)
}

function onCancelReady() {
    fightStore.cancelReady(sessionId.value, fight.value.id)
}
</script>

<template>
    <DesktopOnlyGate>
        <div class="min-h-screen bg-darkred-dark_gray flex flex-col">

            <div v-if="fightStore.isLoading" class="flex-1 flex items-center justify-center">
                <DiceLoader />
            </div>

            <div v-else-if="!fight" class="flex-1 flex items-center justify-center text-darkred-light font-gothic text-xl">
                Активного бою немає
            </div>

            <template v-else>
                <EnemyBar :enemies="fight.enemies" :isAdmin="isGM" :selectedEnemyId="selectedEnemyId"
                    @select="selectedEnemyId = $event">
                    <template v-if="isGM" #actions>
                        <AprroveButtonWithText text="Новий раунд" class="h-10 px-4 flex items-center justify-center"
                            @click="newRound" />
                    </template>
                </EnemyBar>

                <div class="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-2 p-2 min-h-0">
                    <BattleMap :fight="fight" :characters="sessionStore.session.characters" :pickedToken="pickedToken"
                        :canMoveToken="canMoveToken" :moverBudget="moverBudget" @pick-token="onPickToken"
                        @move-to-tile="onMoveToTile" />

                    <FightSidePanel :sessionId="sessionId" :isGM="isGM" :participants="fight.participants"
                        :characters="sessionStore.session.characters" :enemies="fight.enemies"
                        @resolve="onResolve" @set-ap="onSetAP" />
                </div>

                <div class="p-2 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-2">
                    <CharacterSheetStrip v-if="!isGM && myCharacter && myParticipant" :character="myCharacter"
                        :participant="myParticipant" :fight="fight" :allEntities="sessionStore.session.entities"
                        @set-active-loadout="onSetActiveLoadout" @set-active-weapon="onSetActiveWeapon"
                        @ready-attack="onReadyAttack" @cancel-ready="onCancelReady" />
                    <div v-else class="hidden lg:block" />

                    <button @click="diceModalHidden = false"
                        class="h-full min-h-[96px] flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-darkred-dark_gray bg-darkred-dark text-darkred-light font-gothic md:hover:bg-darkred-dark_gray md:hover:cursor-pointer">
                        <span class="text-3xl">🎲</span>
                        <span class="text-sm">Кинути кубик</span>
                    </button>
                </div>
            </template>

            <DiceRollerModal v-if="!diceModalHidden" @close="diceModalHidden = true" />
        </div>
    </DesktopOnlyGate>
</template>
