import { BigInt } from "@graphprotocol/graph-ts"
import {
  TokenSeller,
  CoinRedeemed,
  CoinStaked,
  OwnershipTransferred,
  UserBlacklisted,
  UserRemovedFromBlacklist
} from "../generated/TokenSeller/TokenSeller"
import { StakingVault } from "../generated/schema"

export function handleCoinRedeemed(event: CoinRedeemed): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = StakingVault.load(event.params.id.toString())

  if (!entity) {
    return;
  }

  entity.redeemed = true;
  entity.redemptionTimestamp = event.block.timestamp;

  // Entities can be written to the store with `.save()`
  entity.save()
}

export function handleCoinStaked(event: CoinStaked): void {

  let entity = new StakingVault(
    event.params.id.toString()
  );



  entity.stakingVault = event.params.stakingVault;
  entity.redeemed = false;
  entity.user = event.params.user;
  entity.unlockTime = event.params.unlockTime;
  entity.value = event.params.value;

  entity.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void { }

export function handleUserBlacklisted(event: UserBlacklisted): void { }

export function handleUserRemovedFromBlacklist(
  event: UserRemovedFromBlacklist
): void { }
