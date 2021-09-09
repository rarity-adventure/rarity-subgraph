export let BARBARIAN = "1"
export let BARD = "2"
export let CLERIC = "3"
export let DRUID = "4"
export let FIGHTER = "5"
export let MONK = "6"
export let PALADIN = "7"
export let RANGER = "8"
export let ROGUE = "9"
export let SORCERER = "10"
export let WIZARD = "11"

export function classToString(id: string): string {
  if (id == BARBARIAN) {
    return "barbarian"
  } else if (id == BARD) {
    return "bard"
  } else if (id == CLERIC) {
    return "cleric"
  } else if (id == DRUID) {
    return "druid"
  } else if (id == FIGHTER) {
    return "fighter"
  } else if (id == MONK) {
    return "monk"
  } else if (id == PALADIN) {
    return "paladin"
  } else if (id == RANGER) {
    return "ranger"
  } else if (id == ROGUE) {
    return "rogue"
  } else if (id == SORCERER) {
    return "sorcerer"
  } else if (id == WIZARD) {
    return "wizard"
  } else {
    return "unknown"
  }
}