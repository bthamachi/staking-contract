import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";
export interface TokenSellerInterface extends utils.Interface {
    functions: {
        "basePrice()": FunctionFragment;
        "blacklistUser(address)": FunctionFragment;
        "getRedeemableAmount()": FunctionFragment;
        "getStakedAmount()": FunctionFragment;
        "isBlacklisted(address)": FunctionFragment;
        "lockupDuration()": FunctionFragment;
        "owner()": FunctionFragment;
        "purchaseCoin(uint256)": FunctionFragment;
        "redeemAllStakes()": FunctionFragment;
        "removeUserFromBlacklist(address)": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "rewardCoin()": FunctionFragment;
        "stakingVaultID()": FunctionFragment;
        "totalStaked()": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "updateBasePrice(uint256)": FunctionFragment;
        "updateERC20Token(address)": FunctionFragment;
        "updateLockupDuration(uint256)": FunctionFragment;
        "withdrawAllEth()": FunctionFragment;
        "withdrawAllRewardToken()": FunctionFragment;
        "withdrawUnusedRewardToken()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "basePrice" | "blacklistUser" | "getRedeemableAmount" | "getStakedAmount" | "isBlacklisted" | "lockupDuration" | "owner" | "purchaseCoin" | "redeemAllStakes" | "removeUserFromBlacklist" | "renounceOwnership" | "rewardCoin" | "stakingVaultID" | "totalStaked" | "transferOwnership" | "updateBasePrice" | "updateERC20Token" | "updateLockupDuration" | "withdrawAllEth" | "withdrawAllRewardToken" | "withdrawUnusedRewardToken"): FunctionFragment;
    encodeFunctionData(functionFragment: "basePrice", values?: undefined): string;
    encodeFunctionData(functionFragment: "blacklistUser", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getRedeemableAmount", values?: undefined): string;
    encodeFunctionData(functionFragment: "getStakedAmount", values?: undefined): string;
    encodeFunctionData(functionFragment: "isBlacklisted", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "lockupDuration", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "purchaseCoin", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "redeemAllStakes", values?: undefined): string;
    encodeFunctionData(functionFragment: "removeUserFromBlacklist", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewardCoin", values?: undefined): string;
    encodeFunctionData(functionFragment: "stakingVaultID", values?: undefined): string;
    encodeFunctionData(functionFragment: "totalStaked", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "updateBasePrice", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "updateERC20Token", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "updateLockupDuration", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "withdrawAllEth", values?: undefined): string;
    encodeFunctionData(functionFragment: "withdrawAllRewardToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "withdrawUnusedRewardToken", values?: undefined): string;
    decodeFunctionResult(functionFragment: "basePrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "blacklistUser", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRedeemableAmount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getStakedAmount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isBlacklisted", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockupDuration", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "purchaseCoin", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "redeemAllStakes", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "removeUserFromBlacklist", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardCoin", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stakingVaultID", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalStaked", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "updateBasePrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "updateERC20Token", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "updateLockupDuration", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawAllEth", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawAllRewardToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawUnusedRewardToken", data: BytesLike): Result;
    events: {
        "CoinRedeemed(uint256,address,address,uint256,uint256)": EventFragment;
        "CoinStaked(uint256,address,address,uint256,uint256)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
        "UserBlacklisted(address,uint256)": EventFragment;
        "UserRemovedFromBlacklist(address,uint256)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "CoinRedeemed"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "CoinStaked"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "UserBlacklisted"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "UserRemovedFromBlacklist"): EventFragment;
}
export interface CoinRedeemedEventObject {
    id: BigNumber;
    stakingVault: string;
    user: string;
    redemptionTimestamp: BigNumber;
    value: BigNumber;
}
export declare type CoinRedeemedEvent = TypedEvent<[
    BigNumber,
    string,
    string,
    BigNumber,
    BigNumber
], CoinRedeemedEventObject>;
export declare type CoinRedeemedEventFilter = TypedEventFilter<CoinRedeemedEvent>;
export interface CoinStakedEventObject {
    id: BigNumber;
    stakingVault: string;
    user: string;
    unlockTime: BigNumber;
    value: BigNumber;
}
export declare type CoinStakedEvent = TypedEvent<[
    BigNumber,
    string,
    string,
    BigNumber,
    BigNumber
], CoinStakedEventObject>;
export declare type CoinStakedEventFilter = TypedEventFilter<CoinStakedEvent>;
export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export declare type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
export declare type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface UserBlacklistedEventObject {
    user: string;
    timestamp: BigNumber;
}
export declare type UserBlacklistedEvent = TypedEvent<[
    string,
    BigNumber
], UserBlacklistedEventObject>;
export declare type UserBlacklistedEventFilter = TypedEventFilter<UserBlacklistedEvent>;
export interface UserRemovedFromBlacklistEventObject {
    user: string;
    timestamp: BigNumber;
}
export declare type UserRemovedFromBlacklistEvent = TypedEvent<[
    string,
    BigNumber
], UserRemovedFromBlacklistEventObject>;
export declare type UserRemovedFromBlacklistEventFilter = TypedEventFilter<UserRemovedFromBlacklistEvent>;
export interface TokenSeller extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: TokenSellerInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        basePrice(overrides?: CallOverrides): Promise<[BigNumber]>;
        blacklistUser(_blacklistedAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getRedeemableAmount(overrides?: CallOverrides): Promise<[BigNumber]>;
        getStakedAmount(overrides?: CallOverrides): Promise<[BigNumber]>;
        isBlacklisted(_address: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        lockupDuration(overrides?: CallOverrides): Promise<[BigNumber]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        purchaseCoin(amount: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        redeemAllStakes(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        removeUserFromBlacklist(_blacklistedAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        rewardCoin(overrides?: CallOverrides): Promise<[string]>;
        stakingVaultID(overrides?: CallOverrides): Promise<[BigNumber]>;
        totalStaked(overrides?: CallOverrides): Promise<[BigNumber]>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        updateBasePrice(_basePrice: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        updateERC20Token(_erc20Address: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        updateLockupDuration(_lockupDuration: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        withdrawAllEth(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        withdrawAllRewardToken(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        withdrawUnusedRewardToken(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    basePrice(overrides?: CallOverrides): Promise<BigNumber>;
    blacklistUser(_blacklistedAddress: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getRedeemableAmount(overrides?: CallOverrides): Promise<BigNumber>;
    getStakedAmount(overrides?: CallOverrides): Promise<BigNumber>;
    isBlacklisted(_address: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    lockupDuration(overrides?: CallOverrides): Promise<BigNumber>;
    owner(overrides?: CallOverrides): Promise<string>;
    purchaseCoin(amount: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    redeemAllStakes(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    removeUserFromBlacklist(_blacklistedAddress: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    rewardCoin(overrides?: CallOverrides): Promise<string>;
    stakingVaultID(overrides?: CallOverrides): Promise<BigNumber>;
    totalStaked(overrides?: CallOverrides): Promise<BigNumber>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    updateBasePrice(_basePrice: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    updateERC20Token(_erc20Address: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    updateLockupDuration(_lockupDuration: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    withdrawAllEth(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    withdrawAllRewardToken(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    withdrawUnusedRewardToken(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        basePrice(overrides?: CallOverrides): Promise<BigNumber>;
        blacklistUser(_blacklistedAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        getRedeemableAmount(overrides?: CallOverrides): Promise<BigNumber>;
        getStakedAmount(overrides?: CallOverrides): Promise<BigNumber>;
        isBlacklisted(_address: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        lockupDuration(overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<string>;
        purchaseCoin(amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        redeemAllStakes(overrides?: CallOverrides): Promise<boolean>;
        removeUserFromBlacklist(_blacklistedAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        rewardCoin(overrides?: CallOverrides): Promise<string>;
        stakingVaultID(overrides?: CallOverrides): Promise<BigNumber>;
        totalStaked(overrides?: CallOverrides): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        updateBasePrice(_basePrice: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        updateERC20Token(_erc20Address: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        updateLockupDuration(_lockupDuration: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        withdrawAllEth(overrides?: CallOverrides): Promise<boolean>;
        withdrawAllRewardToken(overrides?: CallOverrides): Promise<boolean>;
        withdrawUnusedRewardToken(overrides?: CallOverrides): Promise<boolean>;
    };
    filters: {
        "CoinRedeemed(uint256,address,address,uint256,uint256)"(id?: null, stakingVault?: null, user?: null, redemptionTimestamp?: null, value?: null): CoinRedeemedEventFilter;
        CoinRedeemed(id?: null, stakingVault?: null, user?: null, redemptionTimestamp?: null, value?: null): CoinRedeemedEventFilter;
        "CoinStaked(uint256,address,address,uint256,uint256)"(id?: null, stakingVault?: null, user?: null, unlockTime?: null, value?: null): CoinStakedEventFilter;
        CoinStaked(id?: null, stakingVault?: null, user?: null, unlockTime?: null, value?: null): CoinStakedEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        "UserBlacklisted(address,uint256)"(user?: null, timestamp?: null): UserBlacklistedEventFilter;
        UserBlacklisted(user?: null, timestamp?: null): UserBlacklistedEventFilter;
        "UserRemovedFromBlacklist(address,uint256)"(user?: null, timestamp?: null): UserRemovedFromBlacklistEventFilter;
        UserRemovedFromBlacklist(user?: null, timestamp?: null): UserRemovedFromBlacklistEventFilter;
    };
    estimateGas: {
        basePrice(overrides?: CallOverrides): Promise<BigNumber>;
        blacklistUser(_blacklistedAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getRedeemableAmount(overrides?: CallOverrides): Promise<BigNumber>;
        getStakedAmount(overrides?: CallOverrides): Promise<BigNumber>;
        isBlacklisted(_address: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        lockupDuration(overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        purchaseCoin(amount: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        redeemAllStakes(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        removeUserFromBlacklist(_blacklistedAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        rewardCoin(overrides?: CallOverrides): Promise<BigNumber>;
        stakingVaultID(overrides?: CallOverrides): Promise<BigNumber>;
        totalStaked(overrides?: CallOverrides): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        updateBasePrice(_basePrice: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        updateERC20Token(_erc20Address: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        updateLockupDuration(_lockupDuration: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        withdrawAllEth(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        withdrawAllRewardToken(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        withdrawUnusedRewardToken(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        basePrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        blacklistUser(_blacklistedAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getRedeemableAmount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getStakedAmount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isBlacklisted(_address: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        lockupDuration(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        purchaseCoin(amount: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        redeemAllStakes(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        removeUserFromBlacklist(_blacklistedAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        rewardCoin(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        stakingVaultID(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        totalStaked(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        updateBasePrice(_basePrice: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        updateERC20Token(_erc20Address: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        updateLockupDuration(_lockupDuration: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        withdrawAllEth(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        withdrawAllRewardToken(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        withdrawUnusedRewardToken(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
