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