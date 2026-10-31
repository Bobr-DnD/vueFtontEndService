// Client-side mirror of WS-server's src/utils/tileGraph.js - used only to
// preview reachable tiles / movement cost before sending fight:move. The
// server re-runs the same logic authoritatively and will reject anything
// invalid, so this never needs to be perfectly in sync, just close enough
// for a responsive hover/highlight.

const GRID_ID = /^r(\d+)c(\d+)$/
const RADIAL_SECTOR_ID = /^ring(\d+)-sector(\d+)$/

export function parseTileId(tileId) {
  if (typeof tileId !== 'string') return null

  const gridMatch = GRID_ID.exec(tileId)
  if (gridMatch) return { kind: 'grid', row: Number(gridMatch[1]), col: Number(gridMatch[2]) }

  if (tileId === 'ring0') return { kind: 'radial', ring: 0, sector: null }

  const radialMatch = RADIAL_SECTOR_ID.exec(tileId)
  if (radialMatch) return { kind: 'radial', ring: Number(radialMatch[1]), sector: Number(radialMatch[2]) }

  return null
}

export function gridTileId(row, col) {
  return `r${row}c${col}`
}

export function radialTileId(ring, sector) {
  return ring === 0 ? 'ring0' : `ring${ring}-sector${sector}`
}

export function getCenterTileId(overlay) {
  if (overlay?.type === 'radial') return 'ring0'

  const cols = overlay?.grid?.cols ?? 10
  const rows = overlay?.grid?.rows ?? 10
  return gridTileId(Math.floor(rows / 2), Math.floor(cols / 2))
}

export function buildTiles(overlay, existingTiles = []) {
  const byId = new Map(existingTiles.map(t => [t.id, t]))
  const tiles = []

  if (overlay?.type === 'radial') {
    const rings = overlay?.radial?.rings ?? 5
    const sectorsPerRing = overlay?.radial?.sectorsPerRing ?? 8

    tiles.push(byId.get('ring0') ?? { id: 'ring0', weight: 1, blocked: false })
    for (let r = 1; r <= rings; r++) {
      for (let s = 0; s < sectorsPerRing; s++) {
        const id = radialTileId(r, s)
        tiles.push(byId.get(id) ?? { id, weight: 1, blocked: false })
      }
    }
  } else {
    const cols = overlay?.grid?.cols ?? 10
    const rows = overlay?.grid?.rows ?? 10

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const id = gridTileId(row, col)
        tiles.push(byId.get(id) ?? { id, weight: 1, blocked: false })
      }
    }
  }

  return tiles
}

function gridNeighbors(parsed, overlay) {
  const cols = overlay?.grid?.cols ?? 10
  const rows = overlay?.grid?.rows ?? 10
  const neighbors = []

  for (let dRow = -1; dRow <= 1; dRow++) {
    for (let dCol = -1; dCol <= 1; dCol++) {
      if (dRow === 0 && dCol === 0) continue
      const row = parsed.row + dRow
      const col = parsed.col + dCol
      if (row < 0 || row >= rows || col < 0 || col >= cols) continue
      neighbors.push(gridTileId(row, col))
    }
  }

  return neighbors
}

function radialNeighbors(parsed, overlay) {
  const rings = overlay?.radial?.rings ?? 5
  const sectorsPerRing = overlay?.radial?.sectorsPerRing ?? 8
  const neighbors = []

  if (parsed.ring === 0) {
    for (let s = 0; s < sectorsPerRing; s++) neighbors.push(radialTileId(1, s))
    return neighbors
  }

  const prevSector = (parsed.sector - 1 + sectorsPerRing) % sectorsPerRing
  const nextSector = (parsed.sector + 1) % sectorsPerRing
  neighbors.push(radialTileId(parsed.ring, prevSector))
  neighbors.push(radialTileId(parsed.ring, nextSector))

  neighbors.push(parsed.ring === 1 ? 'ring0' : radialTileId(parsed.ring - 1, parsed.sector))
  if (parsed.ring < rings) neighbors.push(radialTileId(parsed.ring + 1, parsed.sector))

  return neighbors
}

export function getNeighborTileIds(tileId, overlay) {
  const parsed = parseTileId(tileId)
  if (!parsed) return []

  return parsed.kind === 'grid' ? gridNeighbors(parsed, overlay) : radialNeighbors(parsed, overlay)
}

// Dijkstra shortest-cost path, mirrors the server rule: edge cost = weight of
// the tile being entered, blocked tiles are never reachable.
export function findPathCost(fromTileId, toTileId, overlay, tiles) {
  if (fromTileId === toTileId) return 0

  const tileById = new Map((tiles || []).map(t => [t.id, t]))
  const targetTile = tileById.get(toTileId)
  if (!targetTile || targetTile.blocked) return null

  const distances = new Map([[fromTileId, 0]])
  const visited = new Set()
  const queue = [[fromTileId, 0]]

  while (queue.length) {
    queue.sort((a, b) => a[1] - b[1])
    const [current, currentDist] = queue.shift()

    if (visited.has(current)) continue
    visited.add(current)

    if (current === toTileId) return currentDist

    for (const neighborId of getNeighborTileIds(current, overlay)) {
      const neighborTile = tileById.get(neighborId)
      if (!neighborTile || neighborTile.blocked) continue

      const cost = currentDist + (neighborTile.weight ?? 1)
      if (cost < (distances.get(neighborId) ?? Infinity)) {
        distances.set(neighborId, cost)
        queue.push([neighborId, cost])
      }
    }
  }

  return null
}

// Every tile reachable from `fromTileId` within `maxCost` AP, as a Map of
// tileId -> cost. Used to highlight the move range on the map.
export function reachableTiles(fromTileId, overlay, tiles, maxCost) {
  const tileById = new Map((tiles || []).map(t => [t.id, t]))
  const distances = new Map([[fromTileId, 0]])
  const visited = new Set()
  const queue = [[fromTileId, 0]]

  while (queue.length) {
    queue.sort((a, b) => a[1] - b[1])
    const [current, currentDist] = queue.shift()

    if (visited.has(current)) continue
    visited.add(current)

    for (const neighborId of getNeighborTileIds(current, overlay)) {
      const neighborTile = tileById.get(neighborId)
      if (!neighborTile || neighborTile.blocked) continue

      const cost = currentDist + (neighborTile.weight ?? 1)
      if (cost > maxCost) continue
      if (cost < (distances.get(neighborId) ?? Infinity)) {
        distances.set(neighborId, cost)
        queue.push([neighborId, cost])
      }
    }
  }

  return distances
}

// Center point of a tile as a {x,y} percentage (0-100) of the map container -
// used to position tokens and tile markers over the background image.
export function tileCenterPercent(tileId, overlay) {
  const parsed = parseTileId(tileId)
  if (!parsed) return { x: 50, y: 50 }

  if (parsed.kind === 'grid') {
    const cols = overlay?.grid?.cols ?? 10
    const rows = overlay?.grid?.rows ?? 10
    const gx = overlay?.grid?.x ?? 0
    const gy = overlay?.grid?.y ?? 0
    const gw = overlay?.grid?.w ?? 100
    const gh = overlay?.grid?.h ?? 100

    return {
      x: gx + ((parsed.col + 0.5) / cols) * gw,
      y: gy + ((parsed.row + 0.5) / rows) * gh
    }
  }

  const cx = overlay?.radial?.cx ?? 50
  const cy = overlay?.radial?.cy ?? 50
  const rings = overlay?.radial?.rings ?? 5
  const sectorsPerRing = overlay?.radial?.sectorsPerRing ?? 8
  const maxRadius = overlay?.radial?.maxRadius ?? 50

  if (parsed.ring === 0) return { x: cx, y: cy }

  const radius = ((parsed.ring - 0.5) / rings) * maxRadius
  const angle = ((parsed.sector + 0.5) / sectorsPerRing) * 2 * Math.PI

  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle)
  }
}

// Grid cell footprint as a {w,h} percentage of the overlay's own box - only
// meaningful for grid overlays, radial tiles are drawn as round markers instead.
export function gridTileSizePercent(overlay) {
  const cols = overlay?.grid?.cols ?? 10
  const rows = overlay?.grid?.rows ?? 10
  const gw = overlay?.grid?.w ?? 100
  const gh = overlay?.grid?.h ?? 100
  return { w: gw / cols, h: gh / rows }
}

// Parses a "2d6+3" style damage-dice string into a ready-attack dice config.
export function parseDiceNotation(notation) {
  if (typeof notation !== 'string' || !notation.trim()) return { dice: [], modifier: 0 }

  const dice = []
  let modifier = 0

  const diceRegex = /(\d*)d(\d+)/gi
  let match
  while ((match = diceRegex.exec(notation)) !== null) {
    const count = match[1] ? Number(match[1]) : 1
    dice.push({ die: `d${match[2]}`, count })
  }

  const modMatch = /([+-])\s*(\d+)(?!d)/i.exec(notation.replace(diceRegex, ''))
  if (modMatch) modifier = Number(`${modMatch[1]}${modMatch[2]}`)

  return { dice, modifier }
}
