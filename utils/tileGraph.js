// Client-side mirror of WS-server's src/utils/tileGraph.js tile-id scheme.
// With no AP/movement cost anymore, this is purely about turning a tileId
// into a screen position (and generating the grid to draw/click on) - no
// pathfinding needed.

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

// The full set of clickable tile ids for the current overlay, generated
// fresh from its dimensions - there's nothing persisted per tile anymore.
export function buildTiles(overlay) {
  const tiles = []

  if (overlay?.type === 'radial') {
    const rings = overlay?.radial?.rings ?? 5
    const sectorsPerRing = overlay?.radial?.sectorsPerRing ?? 8

    tiles.push({ id: 'ring0' })
    for (let r = 1; r <= rings; r++) {
      for (let s = 0; s < sectorsPerRing; s++) {
        tiles.push({ id: radialTileId(r, s) })
      }
    }
  } else {
    const cols = overlay?.grid?.cols ?? 10
    const rows = overlay?.grid?.rows ?? 10

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        tiles.push({ id: gridTileId(row, col) })
      }
    }
  }

  return tiles
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
