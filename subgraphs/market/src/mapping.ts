import {Buy} from "../generated/Market/Market";
import {Sale, Global} from "../generated/schema";
import { integer } from '@protofire/subgraph-toolkit'

const global_data_id = "globals"

export function handleBuy(event: Buy): void {
    let sale = new Sale(event.params.id.toString() + "_" + event.block.timestamp.toString())

    sale.summoner = event.params.id
    sale.txid = event.transaction.hash.toHexString()
    sale.timestamp = event.block.timestamp
    sale.seller = event.params.seller.toHexString()
    sale.buyer = event.params.buyer.toHexString()
    sale.price = event.params.price
    sale.fee = event.params.fee

    sale.save()

    let global = Global.load(global_data_id)
    if (!global) {
        global = new Global(global_data_id)
        global.trades = integer.ZERO
        global.fees = integer.ZERO
        global.volume = integer.ZERO
        global.save()
    }

    global.trades = global.trades.plus(integer.ONE)
    global.fees = global.fees.plus(event.params.fee)
    global.volume = global.volume.plus(event.params.price)

    global.save()
}
