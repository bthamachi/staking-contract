import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  CoinRedeemed,
  CoinStaked,
  OwnershipTransferred,
  UserBlacklisted,
  UserRemovedFromBlacklist
} from "../generated/TokenSeller/TokenSeller"

export function createCoinRedeemedEvent(
  id: BigInt,
  stakingVault: Address,
  user: Address,
  redemptionTimestamp: BigInt,
  value: BigInt
): CoinRedeemed {
  let coinRedeemedEvent = changetype<CoinRedeemed>(newMockEvent())

  coinRedeemedEvent.parameters = new Array()

  coinRedeemedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  coinRedeemedEvent.parameters.push(
    new ethereum.EventParam(
      "stakingVault",
      ethereum.Value.fromAddress(stakingVault)
    )
  )
  coinRedeemedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  coinRedeemedEvent.parameters.push(
    new ethereum.EventParam(
      "redemptionTimestamp",
      ethereum.Value.fromUnsignedBigInt(redemptionTimestamp)
    )
  )
  coinRedeemedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return coinRedeemedEvent
}

export function createCoinStakedEvent(
  id: BigInt,
  stakingVault: Address,
  user: Address,
  unlockTime: BigInt,
  value: BigInt
): CoinStaked {
  let coinStakedEvent = changetype<CoinStaked>(newMockEvent())

  coinStakedEvent.parameters = new Array()

  coinStakedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  coinStakedEvent.parameters.push(
    new ethereum.EventParam(
      "stakingVault",
      ethereum.Value.fromAddress(stakingVault)
    )
  )
  coinStakedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  coinStakedEvent.parameters.push(
    new ethereum.EventParam(
      "unlockTime",
      ethereum.Value.fromUnsignedBigInt(unlockTime)
    )
  )
  coinStakedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return coinStakedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createUserBlacklistedEvent(
  user: Address,
  timestamp: BigInt
): UserBlacklisted {
  let userBlacklistedEvent = changetype<UserBlacklisted>(newMockEvent())

  userBlacklistedEvent.parameters = new Array()

  userBlacklistedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  userBlacklistedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return userBlacklistedEvent
}

export function createUserRemovedFromBlacklistEvent(
  user: Address,
  timestamp: BigInt
): UserRemovedFromBlacklist {
  let userRemovedFromBlacklistEvent = changetype<UserRemovedFromBlacklist>(
    newMockEvent()
  )

  userRemovedFromBlacklistEvent.parameters = new Array()

  userRemovedFromBlacklistEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  userRemovedFromBlacklistEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return userRemovedFromBlacklistEvent
}
