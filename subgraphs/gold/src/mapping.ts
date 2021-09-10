import {Transfer} from "../generated/Rarity/Gold";
import { integer, ZERO_ADDRESS } from '@protofire/subgraph-toolkit'
import {Globals, Summoner} from "../generated/schema";

const global_state_id = "global"

export function handleTransfer(event: Transfer): void {

    // Check if is a minting
    if (event.params.from.toHex() == ZERO_ADDRESS) {

        let globals = Globals.load(global_state_id)
        if (!globals) {
            globals = new Globals(global_state_id)
            globals.supply = integer.ZERO
            globals.holders = integer.ZERO
        }

        // Assign balance to receiver and increase supply
        let receiver = Summoner.load(event.params.to.toHex())
        if (!receiver) {
            receiver = new Summoner(event.params.to.toHex())
            receiver.balance = integer.ZERO
            globals.holders = globals.holders.plus(integer.ONE)
        }

        globals.supply = globals.supply.plus(event.params.amount)
        receiver.balance = receiver.balance.plus(event.params.amount)
        receiver.save()
        globals.save()


    } else {

        let globals = Globals.load(global_state_id)
        if (!globals) {
            globals = new Globals(global_state_id)
            globals.supply = integer.ZERO
            globals.holders = integer.ZERO
        }

        // Reduce balance from sender
        let sender = Summoner.load(event.params.from.toHex())
        if (sender) {
            sender.balance = sender.balance.minus(event.params.amount)
            if (sender.balance == integer.ZERO) {
                globals.holders = globals.holders.minus(integer.ONE)
            }

            sender.save()

            // Assign balance to receiver
            let receiver = Summoner.load(event.params.to.toHex())
            if (!receiver) {
                receiver = new Summoner(event.params.to.toHex())
                receiver.balance = integer.ZERO
                globals.holders = globals.holders.plus(integer.ONE)
            }

            receiver.balance = receiver.balance.plus(event.params.amount)
            receiver.save()
            globals.save()

        }

    }

}
