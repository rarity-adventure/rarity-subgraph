import {
  Transfer,
  summoned, leveled,
} from "../generated/Rarity/Rarity"
import {MetaData, Summoner} from "../generated/schema";
import { integer, ZERO_ADDRESS } from '@protofire/subgraph-toolkit'

export function handleTransfer(event: Transfer): void {
  if (event.params.from.toHex() !== ZERO_ADDRESS) {
    let summoner = Summoner.load(event.params.tokenId.toHex())
    if (summoner !== null) {
      summoner.owner = event.params.to
      summoner.save()
    }
  }
}

export function handleLeveled(event: leveled): void {
  let summoner = Summoner.load(event.params.summoner.toHex())
  if (summoner !== null) {
    summoner._level = summoner._level.plus(integer.ONE)
    summoner.save()
  }
}

export function handleSummoned(event: summoned): void {
  let summoner = new Summoner(event.params.summoner.toHex());
  summoner.owner = event.params.owner;
  summoner._class = event.params._class
  summoner._level = integer.ONE;
  summoner.save();

  // Fill metadata
  let metadata = MetaData.load("metadata")

  if (metadata === null) {
    metadata = new MetaData("metadata")
  }

  metadata.summoners = metadata.summoners.plus(integer.ONE)

  if (summoner._class.toI32() == 1) {
    metadata.barbarians = metadata.barbarians.plus(integer.ONE)
  } else if (summoner._class.toI32() == 2) {
    metadata.bards = metadata.bards.plus(integer.ONE)
  } else if (summoner._class.toI32() == 3) {
    metadata.clerics = metadata.clerics.plus(integer.ONE)
  } else if (summoner._class.toI32() == 4) {
    metadata.druids = metadata.druids.plus(integer.ONE)
  } else if (summoner._class.toI32() == 5) {
    metadata.fighters = metadata.fighters.plus(integer.ONE)
  } else if (summoner._class.toI32() == 6) {
    metadata.monks = metadata.monks.plus(integer.ONE)
  } else if (summoner._class.toI32() == 7) {
    metadata.paladins = metadata.paladins.plus(integer.ONE)
  } else if (summoner._class.toI32() == 8) {
    metadata.rangers = metadata.rangers.plus(integer.ONE)
  } else if (summoner._class.toI32() == 9) {
    metadata.rogues = metadata.rogues.plus(integer.ONE)
  } else if (summoner._class.toI32() == 10) {
    metadata.sorcerers = metadata.sorcerers.plus(integer.ONE)
  } else if (summoner._class.toI32() == 11) {
    metadata.wizards = metadata.wizards.plus(integer.ONE)
  }

  metadata.save()
}
