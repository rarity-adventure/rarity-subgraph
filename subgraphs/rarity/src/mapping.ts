import {
  Transfer,
  summoned, leveled,
} from "../generated/Rarity/Rarity"
import {Global, Summoner, User} from "../generated/schema";
import { integer } from '@protofire/subgraph-toolkit'

export function handleTransfer(event: Transfer): void {}
export function handleLeveled(event: leveled): void {}

const global_state_id = "global"
const unique_owners_state_id = "owners"

export function handleSummoned(event: summoned): void {
    let summoner = new Summoner(event.params.summoner.toHex())
    summoner.owner = event.params.owner.toHex()
    summoner._level = integer.ONE
    summoner._class = event.params._class
    summoner.save()

    // Load the global state
    let global = Global.load(global_state_id)

    // Create the global state no exists
    if (!global) {
      global = new Global(global_state_id)
    }

    // Load this specific user data
    let user = User.load(event.params.owner.toHex())

    // If doesnt exist create it
    if (!user) {
      user = new User(event.params.owner.toHex())
      user.count = integer.ZERO
      global.owners = global.owners.plus(integer.ONE)
    }

    user.count = user.count.plus(integer.ONE)
    user.save()

    global.summoners = global.summoners.plus(integer.ONE)

    // Save states
    global.save()

}


/*

export function handleTransfer(event: Transfer): void {

  // Check that transfer is not a minting (for summoned event)
  if (event.params.from.toHex() != ZERO_ADDRESS) {

    // Attempt to load the transferred summoner
    let summoner = Summoner.load(event.params.tokenId.toHex())

    // Make sure the summoner is correctly loaded
    if (summoner != null) {

      // Change the owner from transfer event
      summoner.owner = event.params.to.toHex()
      summoner.save()
    }
  }
}

export function handleLeveled(event: leveled): void {

  // Attempt to load the transferred summoner
  let summoner = Summoner.load(event.params.summoner.toHex())

  // Make sure the summoner is correctly loaded
  if (summoner != null) {

    let currentLevel = summoner._level
    let newLevel = summoner._level.plus(integer.ONE)

    // Increase level
    // Use previous lvl since it is not possible to get the new level from event
    // https://github.com/andrecronje/rarity/issues/12
    summoner._level = newLevel
    summoner.save()

    // Load the metadata
    let metadata = MetaData.load("metadata")

    // Make sure the metadata is correctly loaded
    if (metadata != null) {

      // Get the index of the old level in the array
      let oldLevelIndex = metadata.levels.indexOf(currentLevel.toString())

      // We assume oldLevel is already created
      if (oldLevelIndex != -1) {
        // Load the lvl metadata
        let lvlData = Level.load(currentLevel.toString())

        // Make sure it is properly loaded
        if (lvlData != null) {
          lvlData.count = lvlData.count.minus(integer.ONE)
          lvlData.save()
        }
      }

      // Get the index of the new level in the array
      let newLevelIndex = metadata.levels.indexOf(newLevel.toString())

      // If the new level no exist create it.
      if (newLevelIndex === -1) {
        // Create new lvl instance
        let lvlData = new Level(newLevel.toString())

        // Initialize with 1 summoner
        lvlData.count = integer.ONE
        lvlData.save()

        // Store it over the metadata array
        metadata.levels.push(newLevel.toString())
      } else {

        // Load the lvl metadata
        let lvlData = Level.load(newLevel.toString())

        // Make sure it is properly loaded
        if (lvlData != null) {
          lvlData.count = lvlData.count.plus(integer.ONE)
          lvlData.save()
        }

      }

      metadata.save()
    }
  }

}

export function handleSummoned(event: summoned): void {

  // Create a new summoner
  let summoner = new Summoner(event.params.summoner.toHex());

  // Fill data and store the summoner
  summoner.owner = event.params.owner.toHex();
  summoner._class = event.params._class
  summoner._level = integer.ONE;
  summoner.save();

  // Load metadata

  let metadata = MetaData.load("metadata")

  // Create if metadata no exists
  if (metadata == null) {
    metadata = new MetaData("metadata")
    metadata.classes = "classes"
  }

  // Load the lvl 1 array
  let level = Level.load("1")
  if (level == null) {
    level = new Level("1")
    level.count = integer.ONE
  }

  level.count = level.count.plus(integer.ONE)
  level.save()

  // Load the owners internal information
  let owners = Owners.load("owners")
  if (owners == null) {
    owners = new Owners("owners")
  }

  // Check if the summoner owner is already registered
  let currOwnerIndex = owners.owners.indexOf(event.params.owner.toHex())

  // If is not registered, increase the counter and add it to the registry
  if (currOwnerIndex == -1) {
    metadata.owners = metadata.owners.plus(integer.ONE)
    owners.owners.push(event.params.owner.toHex())
    owners.save()
  }

  // Add new summoner to metadata
  metadata.summoners = metadata.summoners.plus(integer.ONE)

  // Load classes
  let classes = Classes.load("classes")

  // Create if not exist
  if (classes == null) {
    classes = new Classes("classes")
  }

  // Switch to fill classes metadata
  if (summoner._class.toI32() == 1) {
    classes.barbarians = classes.barbarians.plus(integer.ONE)
  } else if (summoner._class.toI32() == 2) {
    classes.bards = classes.bards.plus(integer.ONE)
  } else if (summoner._class.toI32() == 3) {
    classes.clerics = classes.clerics.plus(integer.ONE)
  } else if (summoner._class.toI32() == 4) {
    classes.druids = classes.druids.plus(integer.ONE)
  } else if (summoner._class.toI32() == 5) {
    classes.fighters = classes.fighters.plus(integer.ONE)
  } else if (summoner._class.toI32() == 6) {
    classes.monks = classes.monks.plus(integer.ONE)
  } else if (summoner._class.toI32() == 7) {
    classes.paladins = classes.paladins.plus(integer.ONE)
  } else if (summoner._class.toI32() == 8) {
    classes.rangers = classes.rangers.plus(integer.ONE)
  } else if (summoner._class.toI32() == 9) {
    classes.rogues = classes.rogues.plus(integer.ONE)
  } else if (summoner._class.toI32() == 10) {
    classes.sorcerers = classes.sorcerers.plus(integer.ONE)
  } else if (summoner._class.toI32() == 11) {
    classes.wizards = classes.wizards.plus(integer.ONE)
  }

  metadata.levels.push("1")
  classes.save()
  metadata.save()
}
*/
