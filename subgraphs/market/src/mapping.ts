import {Buy} from "../generated/Market/Market";
import {Sale} from "../generated/schema";

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
}
