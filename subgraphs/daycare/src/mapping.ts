import {registeredDaycare} from "../generated/Daycare/Daycare";
import {Register} from "../generated/schema";

export function handleRegistered(event: registeredDaycare): void {
  let registered = Register.load(event.params._summonerId.toHex())
  if (registered == null) {
      registered = new Register(event.params._summonerId.toHex())
  }

  registered.days = event.params._days
  registered.blocktime = event.block.timestamp

  registered.save()
}