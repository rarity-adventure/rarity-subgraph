import {
  Transfer,
  summoned, leveled,
} from "../generated/Rarity/Rarity"
import {Class, Global, Level, Summoner, User} from "../generated/schema";
import { integer, ZERO_ADDRESS } from '@protofire/subgraph-toolkit'
import {classToString} from "../constants";


const global_state_id = "global"

export function handleTransfer(event: Transfer): void {

    if (event.params.from.toHexString() != ZERO_ADDRESS) {
        let summoner = Summoner.load(event.params.tokenId.toHex())
        if (summoner) {
            summoner.owner = event.params.to.toHex()
            summoner.save()

            let global = Global.load(global_state_id)
            if (global) {
                let oldUser = User.load(event.params.from.toHex())
                if (oldUser) {
                    oldUser.count = oldUser.count.minus(integer.ONE)
                    oldUser.save()
                    if (oldUser.count == integer.ZERO) {
                        global.owners = global.owners.minus(integer.ONE)
                        global.save()
                    }
                }
                let newUser = User.load(event.params.to.toHex())
                if (!newUser) {
                    newUser = new User(event.params.to.toHex())
                    newUser.count = integer.ZERO
                    global.owners = global.owners.plus(integer.ONE)
                    global.save()
                }
                newUser.count = newUser.count.plus(integer.ONE)
                newUser.save()
            }
        }
  }
}

export function handleLeveled(event: leveled): void {
    let summoner = Summoner.load(event.params.summoner.toHex())
    if (summoner) {
        let newLevel = summoner._level.plus(integer.ONE)
        let oldLevel = summoner._level
        summoner._level = newLevel
        summoner.save()

        let oldLvlEntity = Level.load(oldLevel.toString())
        if (oldLvlEntity) {
            oldLvlEntity.count = oldLvlEntity.count.minus(integer.ONE)
            oldLvlEntity.save()
        }

        let newLvlEntity = Level.load(newLevel.toString())
        if (!newLvlEntity) {
            newLvlEntity = new Level(newLevel.toString())
            newLvlEntity.count = integer.ZERO
        }
        newLvlEntity.count = newLvlEntity.count.plus(integer.ONE)
        newLvlEntity.save()
    }

}

export function handleSummoned(event: summoned): void {
    let summoner = new Summoner(event.params.summoner.toHex())
    summoner.owner = event.params.owner.toHex()
    summoner._level = integer.ONE
    summoner._class = event.params._class
    summoner.save()

    let global = Global.load(global_state_id)
    if (!global) {
      global = new Global(global_state_id)
    }

    let user = User.load(event.params.owner.toHex())
    if (!user) {
      user = new User(event.params.owner.toHex())
      user.count = integer.ZERO
      global.owners = global.owners.plus(integer.ONE)
    }
    user.count = user.count.plus(integer.ONE)
    user.save()

    let gameClass = Class.load(classToString(event.params._class.toString()))
    if (!gameClass) {
      gameClass = new Class(classToString(event.params._class.toString()))
      gameClass.count = integer.ZERO
    }
    gameClass.count = gameClass.count.plus(integer.ONE)
    gameClass.save()

    let level = Level.load("1")
    if (!level) {
      level = new Level("1")
      level.count = integer.ZERO
    }

    level.count = level.count.plus(integer.ONE)
    level.save()

    global.summoners = global.summoners.plus(integer.ONE)

    global.save()
}
