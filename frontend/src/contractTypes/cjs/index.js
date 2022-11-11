"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPolygonMumbaiSdk = exports.getContract = void 0;
const ethers_1 = require("ethers");
const taxableToken_json_1 = __importDefault(require("../../../eth-sdk/abis/polygonMumbai/taxableToken.json"));
const tokenSeller_json_1 = __importDefault(require("../../../eth-sdk/abis/polygonMumbai/tokenSeller.json"));
function getContract(address, abi, defaultSignerOrProvider) {
    return new ethers_1.Contract(address, abi, defaultSignerOrProvider);
}
exports.getContract = getContract;
function getPolygonMumbaiSdk(defaultSignerOrProvider) {
    return {
        "taxableToken": getContract('0x9C70c7A6384cB6386E3ee18bf269dd0003dB819F', taxableToken_json_1.default, defaultSignerOrProvider),
        "tokenSeller": getContract('0x0ddA3502cBf69de0623ec057Ae127270359FDc43', tokenSeller_json_1.default, defaultSignerOrProvider),
    };
}
exports.getPolygonMumbaiSdk = getPolygonMumbaiSdk;
