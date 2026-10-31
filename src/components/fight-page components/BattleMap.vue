<script setup>
import { computed, ref } from 'vue'
import { tileCenterPercent, gridTileSizePercent, reachableTiles, findPathCost } from '@utils/tileGraph'

const props = defineProps({
    fight: { type: Object, required: true },
    characters: { type: Array, default: () => [] },
    pickedToken: { type: Object, default: null }, // { type: 'character'|'enemy', id }
    canMoveToken: { type: Function, default: () => false }, // (token) => boolean
    moverBudget: { type: Number, default: null }, // AP available for the picked token - null means unconstrained (admin)
    selectedTileId: { type: String, default: null } // externally-selected tile (e.g. the admin editor's weight editor) to highlight, independent of hover/reachable
})

const emit = defineEmits(['pick-token', 'move-to-tile', 'tile-click'])

const hoveredTileId = ref(null)

const overlay = computed(() => props.fight.overlay)
const tiles = computed(() => props.fight.tiles ?? [])
const isGrid = computed(() => overlay.value?.type !== 'radial')
const gridSize = computed(() => gridTileSizePercent(overlay.value))

function tilePosition(tileId) {
    return tileCenterPercent(tileId, overlay.value)
}

const characterTokens = computed(() => (props.fight.participants ?? []).map(p => {
    const character = props.characters.find(c => c.id === p.character)
    return {
        type: 'character',
        id: p.character,
        name: character?.name ?? '?',
        image: character?.image ?? null,
        position: p.position,
        ready: p.ready,
        ap: p.actionPoints
    }
}))

const enemyTokens = computed(() => (props.fight.enemies ?? []).map(e => ({
    type: 'enemy',
    id: e.id,
    name: e.name,
    image: e.image,
    position: e.position
})))

const allTokens = computed(() => [...characterTokens.value, ...enemyTokens.value])

const pickedPosition = computed(() => {
    if (!props.pickedToken) return null
    const token = allTokens.value.find(t => t.type === props.pickedToken.type && t.id === props.pickedToken.id)
    return token?.position?.tileId ?? null
})

const reachable = computed(() => {
    if (!pickedPosition.value || props.moverBudget === null) return new Map()
    return reachableTiles(pickedPosition.value, overlay.value, tiles.value, props.moverBudget)
})

function tileClass(tile) {
    return [
        'battle-tile',
        tile.blocked && 'battle-tile--blocked',
        reachable.value.has(tile.id) && 'battle-tile--reachable',
        hoveredTileId.value === tile.id && 'battle-tile--hover',
        props.selectedTileId === tile.id && 'battle-tile--selected'
    ]
}

function hoverCost(tileId) {
    if (!pickedPosition.value) return null
    return findPathCost(pickedPosition.value, tileId, overlay.value, tiles.value)
}

function onTileClick(tile) {
    emit('tile-click', tile.id)

    if (!props.pickedToken || tile.blocked) return
    emit('move-to-tile', tile.id)
}

function onTokenClick(token) {
    if (!props.canMoveToken(token)) return
    emit('pick-token', { type: token.type, id: token.id })
}

// Grid/radial line overlay, drawn in the same 0-100 percent coordinate space
// the tiles themselves use, so it lines up with them without any extra math.
const gridLines = computed(() => {
    if (!isGrid.value) return []

    const g = overlay.value?.grid ?? {}
    const cols = g.cols ?? 10
    const rows = g.rows ?? 10
    const x = g.x ?? 0
    const y = g.y ?? 0
    const w = g.w ?? 100
    const h = g.h ?? 100

    const lines = []
    for (let i = 0; i <= cols; i++) {
        const lx = x + (i / cols) * w
        lines.push({ x1: lx, y1: y, x2: lx, y2: y + h })
    }
    for (let j = 0; j <= rows; j++) {
        const ly = y + (j / rows) * h
        lines.push({ x1: x, y1: ly, x2: x + w, y2: ly })
    }
    return lines
})

const radialCircles = computed(() => {
    if (isGrid.value) return []

    const r = overlay.value?.radial ?? {}
    const cx = r.cx ?? 50
    const cy = r.cy ?? 50
    const rings = r.rings ?? 5
    const maxRadius = r.maxRadius ?? 50

    return Array.from({ length: rings }, (_, i) => ({ cx, cy, r: ((i + 1) / rings) * maxRadius }))
})

const radialSpokes = computed(() => {
    if (isGrid.value) return []

    const r = overlay.value?.radial ?? {}
    const cx = r.cx ?? 50
    const cy = r.cy ?? 50
    const sectorsPerRing = r.sectorsPerRing ?? 8
    const maxRadius = r.maxRadius ?? 50

    return Array.from({ length: sectorsPerRing }, (_, s) => {
        const angle = (s / sectorsPerRing) * 2 * Math.PI
        return { x1: cx, y1: cy, x2: cx + maxRadius * Math.cos(angle), y2: cy + maxRadius * Math.sin(angle) }
    })
})
</script>

<template>
    <div class="relative w-full rounded-xl overflow-hidden border-4 border-darkred-dark bg-darkred-dark_gray select-none"
        style="aspect-ratio: 16 / 9">

        <img v-if="fight.background?.image" :src="fight.background.image" alt="Карта бою" draggable="false"
            class="absolute inset-0 w-full h-full object-contain pointer-events-none" />

        <div v-else class="absolute inset-0 flex items-center justify-center text-darkred-light_gray font-gothic">
            Фон карти не завантажено
        </div>

        <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100"
            preserveAspectRatio="none">
            <template v-if="isGrid">
                <line v-for="(l, i) in gridLines" :key="`gl${i}`" :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2"
                    stroke="rgba(238,238,238,0.4)" stroke-width="0.15" vector-effect="non-scaling-stroke" />
            </template>
            <template v-else>
                <circle v-for="(c, i) in radialCircles" :key="`rc${i}`" :cx="c.cx" :cy="c.cy" :r="c.r" fill="none"
                    stroke="rgba(238,238,238,0.4)" stroke-width="0.15" vector-effect="non-scaling-stroke" />
                <line v-for="(l, i) in radialSpokes" :key="`rs${i}`" :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2"
                    stroke="rgba(238,238,238,0.4)" stroke-width="0.15" vector-effect="non-scaling-stroke" />
            </template>
        </svg>

        <template v-if="isGrid">
            <div v-for="tile in tiles" :key="tile.id" :class="tileClass(tile)" :style="{
                left: `${tilePosition(tile.id).x - gridSize.w / 2}%`,
                top: `${tilePosition(tile.id).y - gridSize.h / 2}%`,
                width: `${gridSize.w}%`,
                height: `${gridSize.h}%`
            }" @click="onTileClick(tile)" @mouseenter="hoveredTileId = tile.id" @mouseleave="hoveredTileId = null">
                <span class="battle-tile__dot" :class="tile.blocked && 'battle-tile__dot--blocked'" />
                <span v-if="hoveredTileId === tile.id && pickedToken && hoverCost(tile.id) !== null"
                    class="battle-tile__cost">{{ hoverCost(tile.id) }}</span>
            </div>
        </template>

        <template v-else>
            <div v-for="tile in tiles" :key="tile.id" :class="[...tileClass(tile), 'battle-tile--radial']" :style="{
                left: `${tilePosition(tile.id).x}%`,
                top: `${tilePosition(tile.id).y}%`
            }" @click="onTileClick(tile)" @mouseenter="hoveredTileId = tile.id" @mouseleave="hoveredTileId = null">
                <span class="battle-tile__dot" :class="tile.blocked && 'battle-tile__dot--blocked'" />
                <span v-if="hoveredTileId === tile.id && pickedToken && hoverCost(tile.id) !== null"
                    class="battle-tile__cost">{{ hoverCost(tile.id) }}</span>
            </div>
        </template>

        <div v-for="token in allTokens" :key="`${token.type}-${token.id}`" class="battle-token" :class="[
            token.type === 'enemy' ? 'battle-token--enemy' : 'battle-token--character',
            pickedToken?.type === token.type && pickedToken?.id === token.id && 'battle-token--picked',
            canMoveToken(token) && 'battle-token--movable'
        ]" :style="token.position?.tileId ? {
            left: `${tilePosition(token.position.tileId).x}%`,
            top: `${tilePosition(token.position.tileId).y}%`
        } : { display: 'none' }" @click.stop="onTokenClick(token)" :title="token.name">

            <img v-if="token.image" :src="token.image" :alt="token.name" draggable="false"
                class="w-full h-full object-cover rounded-full pointer-events-none" />
            <span v-else class="battle-token__initial">{{ token.name?.[0] ?? '?' }}</span>

            <span v-if="token.type === 'character' && token.ready" class="battle-token__ready-dot"
                title="Готовий до атаки" />
        </div>

    </div>
</template>

<style scoped>
.battle-tile {
    position: absolute;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.battle-tile--radial {
    width: 28px;
    height: 28px;
    border-radius: 9999px;
    transform: translate(-50%, -50%);
}

/* Always-visible marker at the tile's center, independent of hover/reachable/
   selected state - those still layer a colored background on .battle-tile
   itself, this is just "a clickable point exists here". */
.battle-tile__dot {
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    background: rgba(238, 238, 238, 0.75);
    border: 1px solid rgba(29, 22, 22, 0.7);
    pointer-events: none;
}

.battle-tile__dot--blocked {
    background: rgba(216, 64, 64, 0.85);
}

.battle-tile--blocked {
    background: rgba(142, 22, 22, 0.35);
    cursor: not-allowed;
}

.battle-tile--reachable {
    background: rgba(94, 147, 108, 0.35);
}

.battle-tile--hover {
    outline: 2px solid #D84040;
    outline-offset: -2px;
}

.battle-tile--selected {
    outline: 2px solid #FABC3F;
    outline-offset: -2px;
    background: rgba(250, 188, 63, 0.25);
}

.battle-tile__cost {
    font-size: 11px;
    font-weight: 700;
    color: #EEEEEE;
    background: rgba(29, 22, 22, 0.8);
    padding: 1px 4px;
    border-radius: 6px;
}

.battle-token {
    position: absolute;
    width: 36px;
    height: 36px;
    margin-left: -18px;
    margin-top: -18px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    border: 2px solid #1D1616;
    z-index: 5;
    overflow: hidden;
    transition: left 0.25s ease, top 0.25s ease;
}

.battle-token--character {
    background: #3E5F44;
    color: #EEEEEE;
}

.battle-token--enemy {
    background: #8E1616;
    color: #EEEEEE;
}

.battle-token--movable {
    cursor: pointer;
    box-shadow: 0 0 0 2px #FABC3F;
}

.battle-token--picked {
    box-shadow: 0 0 0 3px #D84040;
}

.battle-token__ready-dot {
    position: absolute;
    top: -3px;
    right: -3px;
    width: 10px;
    height: 10px;
    border-radius: 9999px;
    background: #FABC3F;
    border: 2px solid #1D1616;
}
</style>
