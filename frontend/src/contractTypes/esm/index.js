import { Contract } from 'ethers';
import polygonMumbai_taxableToken_abi from '../../../eth-sdk/abis/polygonMumbai/taxableToken.json';
import polygonMumbai_tokenSeller_abi from '../../../eth-sdk/abis/polygonMumbai/tokenSeller.json';
export function getContract(address, abi, defaultSignerOrProvider) {
    return new Contract(address, abi, defaultSignerOrProvider);
}
export function getPolygonMumbaiSdk(defaultSignerOrProvider) {
    return {
        "taxableToken": getContract('0x9C70c7A6384cB6386E3ee18bf269dd0003dB819F', polygonMumbai_taxableToken_abi, defaultSignerOrProvider),
        "tokenSeller": getContract('0x0ddA3502cBf69de0623ec057Ae127270359FDc43', polygonMumbai_tokenSeller_abi, defaultSignerOrProvider),
    };
}
