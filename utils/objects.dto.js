export function toEffectObjectField(effect) {
  return {
    id: effect.id,
    timeLeft: effect.timeLeft
  };
}

export function toCustomFieldObjectField(customField) {
  return {
    [customField.name]: customField.value
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
    adminNotes: session.adminNotes ?? null,
    entityTypes: session.entityTypes ?? [],
    enemyTypes: session.enemyTypes ?? [],
    characteristicsList: session.characteristicsList ?? [],
    currencyTypes: session.currencyTypes ?? [],
    characters: session.characters ?? [],
    entities: session.entities ?? [],
    enemies: session.enemies ?? [],
    perks: session.perks ?? [],
    effects :session.effects ?? [],
    fractions: session.fractions ?? [],
    quests: session.quests ?? []
  }
}