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
    id: character.id ?? 'empty',
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
    characteristics: character.characteristics ?? {},
    currency: character.currency ?? [],
    customFields: character.customFields ?? {},
    effects: character.effects ?? [],
    adminNotes: character.adminNotes ?? '',
    playerNotes: character.playerNotes ?? '',
    session: character.session,
    quests: character.quests ?? [],
    perks: character.perks ?? [],
    entities: character.entities ?? []
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

export function toNewSession(session){
  return {
    id: session.id ?? 'new',
    name: session.name ?? '',
    image: session.image ?? null,
    move: session.move ?? 0,
    customFields: session.customFields ?? {},
    notes: session.notes ?? null,
    entityTypes: session.entityTypes ?? [],
    enemyTypes: session.enemyTypes ?? [],
    characteristicsList: session.characteristicsList ?? [],
    currencyTypes: session.currencyTypes ?? [],
    questTypes: session.questTypes ?? [],
    perkTypes: session.perkTypes ?? [],
    characters: session.characters ?? [],
    entities: session.entities ?? [],
    enemies: session.enemies ?? [],
    perks: session.perks ?? [],
    effects :session.effects ?? [],
    fractions: session.fractions ?? [],
    quests: session.quests ?? []
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

export function toNewQuest(quest){
  return {
    id: quest.id || quest._id || 'new',
    name: quest.name ?? '',
    description: quest.description ?? '',
    status: quest.status ?? '',
    reward: quest.reward ?? '',
    steps: quest.steps ?? [],
    notes: quest.notes ?? ''
  }
}

export function toNewPerk(perk){
  return {
    id: perk.id ?? perk._id ?? 'new',
    name: perk.name ?? '',
    descriptions: perk.descriptions ?? [],
    effects: perk.effects ?? [],
    requirement: perk.requirement ?? {},
    ranks: perk.ranks ?? 0,
    type: perk.type ?? {},
    notes: perk.notes ?? ''
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