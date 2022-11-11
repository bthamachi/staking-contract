import { providers, Signer } from 'ethers';
import * as types from './types';
export declare function getContract(address: string, abi: object, defaultSignerOrProvider: Signer | providers.Provider): any;
export declare type PolygonMumbaiSdk = ReturnType<typeof getPolygonMumbaiSdk>;
export declare function getPolygonMumbaiSdk(defaultSignerOrProvider: Signer | providers.Provider): {
    taxableToken: types.polygonMumbai.TaxableToken;
    tokenSeller: types.polygonMumbai.TokenSeller;
};
