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

export function toEmptyCharacterObject(character) {
  return {
    id: character.id || 'empty',
    name: character.name || '',
    image: character.image || '',
    gender: character.gender || '',
    class: character.class || '',
    race: character.race || '',
    level: character.level || 0,
    experience: character.experience || 0,
    experienceToLevelUp: character.experienceToLevelUp || 10,
    perkPoints: character.perkPoints || 0,
    health: character.health || [],
    characteristics: character.characteristics || {},
    customFields: character.customFields || {},
    effects: character.effects || [],
    adminNotes: character.adminNotes || '',
    playerNotes: character.playerNotes || '',
    session: character.session,
    quests: character.quests || [],
    weapons: character.weapons || [],
    armor: character.armor || [],
    perks: character.perks || [],
    medicines: character.medicines || [],
    inventory: character.inventory || []
  }
}

export function toHealthObjectField(health) {
  return {
    name: health.name || "Здоров'я",
    min: health.min || 0,
    max: health.max || 25,
    value: health.value || 25,
    healing: health.healing || 0,
    colors: health.colors || ["#3E5F44", "#FABC3F", "#8E1616"]
  }
}