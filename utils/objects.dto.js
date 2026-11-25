export function toEffectObjectField(effect) {
  return {
    id: effect.id,
    timeLeft: effect.timeLeft
  };
}

export function toObject(objectField) {
  return {
    [objectField.name]: objectField.value
  }
}

export function toNewCharacterObject(character) {
  return {
    id: character.id ?? 'new',
    name: character.name ?? '',
    image: character.image ?? '',
    gender: character.gender ?? '',
    class: character.class ?? '',
    race: character.race ?? '',
    level: character.level ?? 0,
    experience: character.experience ?? 0,
    experienceToLevelUp: character.experienceToLevelUp ?? 10,
    perkPoints: character.perkPoints ?? 0,
    health: character.health ?? [],
    characteristics: character.characteristics ?? [],
    characteristicsComputed: character.characteristicsComputed ?? {},
    currency: character.currency ?? [],
    customFields: character.customFields ?? [],
    effects: character.effects ?? [],
    adminNotes: character.adminNotes ?? '',
    playerNotes: character.playerNotes ?? '',
    session: character.session,
    perks: character.perks ?? [],
    entities: character.entities ?? [],
    loadouts: character.loadouts ?? []
  }
}

export function toHealthObjectField(health) {
  return {
    name: health.name ?? "Здоров'я",
    min: health.min || 0,
    max: health.max || 25,
    value: health.value || 0,
    colors: health.colors ?? ["#3E5F44", "#FABC3F", "#8E1616"],
    id: health.id ?? Math.random().toString(24).slice(2)
  }
}

export function toNewTheme(theme) {
  return {
    presetId: theme?.presetId ?? 'crimson-keep',
    colors: {
      page: theme?.colors?.page ?? '#0D0D0D',
      base: theme?.colors?.base ?? '#1A1A1A',
      ink: theme?.colors?.ink ?? '#1A1A1A',
      surface: theme?.colors?.surface ?? '#262220',
      muted: theme?.colors?.muted ?? '#8A8178',
      subtle: theme?.colors?.subtle ?? '#C9C2B8',
      faint: theme?.colors?.faint ?? '#C9C2B8',
      accent: theme?.colors?.accent ?? '#A61C1C',
      accentHover: theme?.colors?.accentHover ?? '#E63946',
      text: theme?.colors?.text ?? '#F2E9E4',
      surfaceInverted: theme?.colors?.surfaceInverted ?? '#F2E9E4',
      accentSecondary: theme?.colors?.accentSecondary ?? '#40201A'
    },
    faviconUrl: theme?.faviconUrl ?? ''
  }
}

export function toNewSession(session){
  return {
    id: session.id ?? 'new',
    name: session.name ?? '',
    image: session.image ?? '',
    theme: toNewTheme(session.theme),
    customFields: session.customFields ?? [],
    notes: session.notes ?? '',
    entityTypes: session.entityTypes ?? [],
    enemyTypes: session.enemyTypes ?? [],
    characteristicsList: session.characteristicsList ?? [],
    currencyTypes: session.currencyTypes ?? [],
    perkTypes: session.perkTypes ?? [],
    characters: session.characters ?? [],
    entities: session.entities ?? [],
    enemies: session.enemies ?? [],
    perks: session.perks ?? [],
    effects :session.effects ?? [],
    fractions: session.fractions ?? [],
    loadoutsLimit: {
      loadouts: session.loadoutsLimit?.loadouts ?? null,
      items: session.loadoutsLimit?.items ?? null,
      perks: session.loadoutsLimit?.perks ?? null
    }
  }
}

export function toNewEffect(effect){
  return {
    id: effect.id || effect._id || 'new',
    name: effect.name ?? '',
    description: effect.description ?? '',
    effect: effect.effect ?? {}
  }
}

export function toNewPerk(perk){
  return {
    id: perk.id ?? perk._id ?? 'new',
    name: perk.name ?? '',
    description: perk.description ?? '',
    levels: perk.levels ?? [],
    effects: perk.effects ?? [],
    requirement: perk.requirement ?? {},
    ranks: perk.ranks ?? 0,
    type: perk.type ?? {},
    notes: perk.notes ?? ''
  }
}

export function toNewFight(fight = {}) {
  return {
    id: fight.id ?? 'new',
    session: fight.session ?? null,
    name: fight.name ?? '',
    isActive: fight.isActive ?? false,
    background: {
      image: fight.background?.image ?? null,
      width: fight.background?.width ?? null,
      height: fight.background?.height ?? null
    },
    overlay: {
      type: fight.overlay?.type ?? 'grid',
      grid: {
        cols: fight.overlay?.grid?.cols ?? 10,
        rows: fight.overlay?.grid?.rows ?? 10,
        x: fight.overlay?.grid?.x ?? 0,
        y: fight.overlay?.grid?.y ?? 0,
        w: fight.overlay?.grid?.w ?? 100,
        h: fight.overlay?.grid?.h ?? 100
      },
      radial: {
        cx: fight.overlay?.radial?.cx ?? 50,
        cy: fight.overlay?.radial?.cy ?? 50,
        rings: fight.overlay?.radial?.rings ?? 5,
        sectorsPerRing: fight.overlay?.radial?.sectorsPerRing ?? 8,
        maxRadius: fight.overlay?.radial?.maxRadius ?? 50
      }
    },
    enemies: fight.enemies ?? [],
    participants: fight.participants ?? []
  }
}

export function toNewFightEnemy(enemy = {}) {
  return {
    id: enemy.id ?? crypto.randomUUID(),
    name: enemy.name ?? '',
    image: enemy.image ?? null,
    notes: enemy.notes ?? '',
    stats: enemy.stats ?? {},
    perks: enemy.perks ?? [],
    entities: enemy.entities ?? [],
    health: enemy.health ?? [],
    position: { tileId: enemy.position?.tileId ?? null },
    visibleToPlayers: enemy.visibleToPlayers ?? true
  }
}

export function toNewEntity(entity){
  return {
    id: entity.id ?? entity._id ?? 'new',
    name: entity.name ?? '',
    type: entity.type ?? '',
    image: entity.image ?? '',
    notes: entity.notes ?? '',
    characteristics: entity.characteristics ?? {},
    requirement: entity.requirement ?? {},
    effects: entity.effects ?? [],
    description: entity.description ?? '',
    price: entity.price ?? 0,
    usage: entity.usage ?? 0,
    rarity: entity.rarity ?? ''

  }
}