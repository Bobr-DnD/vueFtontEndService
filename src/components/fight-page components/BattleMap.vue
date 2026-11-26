<script setup>
import { computed, ref } from 'vue'
import { tileCenterPercent, gridTileSizePercent, buildTiles } from '@utils/tileGraph'

const props = defineProps({
    fight: { type: Object, required: true },
    characters: { type: Array, default: () => [] },
    pickedToken: { type: Object, default: null }, // { type: 'character'|'enemy', id }
    canMoveToken: { type: Function, default: () => false }, // (token) => boolean
    selectedTileId: { type: String, default: null }, // externally-selected tile (e.g. admin preview) to highlight, independent of hover
    myCharacterId: { type: String, default: null } // the viewer's own character (player mode only) - drawn with a distinct ring so it's unmistakable in a cluster
})

const emit = defineEmits(['pick-token', 'move-to-tile', 'tile-click'])

const hoveredTileId = ref(null)

const overlay = computed(() => props.fight.overlay)
// There's no persisted tile data anymore (no weight/blocked - nothing costs
// AP or gets blocked) - the grid is purely a visual/snapping aid generated
// straight from the overlay's own dimensions.
const tiles = computed(() => buildTiles(overlay.value))
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
        position: p.position
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

// Any number of tokens can share a tile - without this they'd render as one
// opaque stack with only the last one paintable/clickable. Group by tileId
// and spread each group into a small grid of pixel offsets around the
// tile's own center, so every icon stays visible and individually clickable.
const CLUSTER_SPACING_PX = 20

function clusterOffset(index, count) {
    if (count <= 1) return { dx: 0, dy: 0 }

    const cols = Math.ceil(Math.sqrt(count))
    const rows = Math.ceil(count / cols)
    const row = Math.floor(index / cols)
    const col = index % cols

    return {
        dx: (col - (cols - 1) / 2) * CLUSTER_SPACING_PX,
        dy: (row - (rows - 1) / 2) * CLUSTER_SPACING_PX
    }
}

const tokenLayout = computed(() => {
    const groups = new Map()
    for (const token of allTokens.value) {
        const tileId = token.position?.tileId
        if (!tileId) continue
        if (!groups.has(tileId)) groups.set(tileId, [])
        groups.get(tileId).push(token)
    }

    const layout = new Map()
    groups.forEach((group) => {
        group.forEach((token, index) => {
            layout.set(`${token.type}-${token.id}`, clusterOffset(index, group.length))
        })
    })
    return layout
})

function tokenStyle(token) {
    if (!token.position?.tileId) return { display: 'none' }

    const { x, y } = tilePosition(token.position.tileId)
    const { dx, dy } = tokenLayout.value.get(`${token.type}-${token.id}`) ?? { dx: 0, dy: 0 }

    return {
        left: `calc(${x}% + ${dx}px)`,
        top: `calc(${y}% + ${dy}px)`
    }
}

function tileClass(tile) {
    return [
        'battle-tile',
        hoveredTileId.value === tile.id && 'battle-tile--hover',
        props.selectedTileId === tile.id && 'battle-tile--selected'
    ]
}

function onTileClick(tile) {
    emit('tile-click', tile.id)

    if (!props.pickedToken) return
    emit('move-to-tile', tile.id)
}

function onTokenClick(token) {
    if (!props.canMoveToken(token)) return
    emit('pick-token', { type: token.type, id: token.id })
}

function isMine(token) {
    return token.type === 'character' && props.myCharacterId && token.id === props.myCharacterId
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
    <div class="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden border-4 border-brand-base bg-brand-surface select-none">

        <img v-if="fight.background?.image" :src="fight.background.image" alt="Карта бою" draggable="false"
            class="absolute inset-0 w-full h-full object-contain pointer-events-none" />

        <div v-else class="absolute inset-0 flex items-center justify-center text-brand-faint font-gothic">
            Фон карти не завантажено
        </div>

        <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100"
            preserveAspectRatio="none">
            <template v-if="isGrid">
                <line v-for="(l, i) in gridLines" :key="`gl${i}`" :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2"
                    stroke="rgba(242,233,228,0.4)" stroke-width="0.15" vector-effect="non-scaling-stroke" />
            </template>
            <template v-else>
                <circle v-for="(c, i) in radialCircles" :key="`rc${i}`" :cx="c.cx" :cy="c.cy" :r="c.r" fill="none"
                    stroke="rgba(242,233,228,0.4)" stroke-width="0.15" vector-effect="non-scaling-stroke" />
                <line v-for="(l, i) in radialSpokes" :key="`rs${i}`" :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2"
                    stroke="rgba(242,233,228,0.4)" stroke-width="0.15" vector-effect="non-scaling-stroke" />
            </template>
        </svg>

        <template v-if="isGrid">
            <div v-for="tile in tiles" :key="tile.id" :class="tileClass(tile)" :style="{
                left: `${tilePosition(tile.id).x - gridSize.w / 2}%`,
                top: `${tilePosition(tile.id).y - gridSize.h / 2}%`,
                width: `${gridSize.w}%`,
                height: `${gridSize.h}%`
            }" @click="onTileClick(tile)" @mouseenter="hoveredTileId = tile.id" @mouseleave="hoveredTileId = null">
                <span class="battle-tile__dot" />
            </div>
        </template>

        <template v-else>
            <div v-for="tile in tiles" :key="tile.id" :class="[...tileClass(tile), 'battle-tile--radial']" :style="{
                left: `${tilePosition(tile.id).x}%`,
                top: `${tilePosition(tile.id).y}%`
            }" @click="onTileClick(tile)" @mouseenter="hoveredTileId = tile.id" @mouseleave="hoveredTileId = null">
                <span class="battle-tile__dot" />
            </div>
        </template>

        <div v-for="token in allTokens" :key="`${token.type}-${token.id}`" class="battle-token-wrapper"
            :class="canMoveToken(token) && 'battle-token-wrapper--movable'" :style="tokenStyle(token)"
            @click.stop="onTokenClick(token)" :title="token.name">

            <div class="battle-token" :class="[
                token.type === 'enemy' ? 'battle-token--enemy' : 'battle-token--character',
                pickedToken?.type === token.type && pickedToken?.id === token.id && 'battle-token--picked',
                isMine(token) && 'battle-token--mine'
            ]">
                <img v-if="token.image" :src="token.image" :alt="token.name" draggable="false"
                    class="w-full h-full object-cover rounded-full pointer-events-none" />
                <span v-else class="battle-token__initial">{{ token.name?.[0] ?? '?' }}</span>
            </div>

            <span class="battle-token__label">{{ token.name }}</span>
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

/* Always-visible marker at the tile's center, independent of hover/selected
   state - those still layer an outline on .battle-tile itself, this is just
   "a clickable point exists here". */
.battle-tile__dot {
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    background: rgba(242, 233, 228, 0.75);
    border: 1px solid rgba(13, 13, 13, 0.7);
    pointer-events: none;
}

.battle-tile--hover {
    outline: 2px solid rgb(var(--brand-accent-hover));
    outline-offset: -2px;
}

.battle-tile--selected {
    outline: 2px solid rgb(var(--brand-accent-hover));
    outline-offset: -2px;
    background: rgba(230, 57, 70, 0.2);
}

.battle-token-wrapper {
    position: absolute;
    width: 36px;
    height: 36px;
    margin-left: -18px;
    margin-top: -18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 5;
    transition: left 0.25s ease, top 0.25s ease;
    cursor: default;
}

.battle-token {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    border: 2px solid rgb(var(--brand-page));
    overflow: hidden;
}

.battle-token--character {
    background: #3E5F44;
    color: #F2E9E4;
}

.battle-token--enemy {
    background: rgb(var(--brand-accent));
    color: #F2E9E4;
}

.battle-token-wrapper--movable {
    cursor: pointer;
}

.battle-token--picked {
    box-shadow: 0 0 0 3px rgb(var(--brand-accent-hover));
}

/* Persistent, independent of hover/picked state - always marks which token
   on the board is the current player's own, so it's unmistakable even when
   several characters are clustered tightly on the same tile. */
.battle-token--mine {
    box-shadow: 0 0 0 3px #FABC3F;
}

.battle-token--mine.battle-token--picked {
    box-shadow: 0 0 0 3px #FABC3F, 0 0 0 6px rgb(var(--brand-accent-hover));
}

.battle-token__label {
    margin-top: 2px;
    padding: 0 4px;
    font-size: 10px;
    line-height: 1.3;
    color: #F2E9E4;
    background: rgba(13, 13, 13, 0.75);
    border-radius: 4px;
    white-space: nowrap;
    max-width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
    pointer-events: none;
}
</style>
