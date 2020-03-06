import BigNumber from "bignumber.js";
export declare enum MessageType {
    Value = 0,
    Call = 1,
    Create = 2,
    Selfdestruct = 3,
    Delegatecall = 4
}
export declare type Param = {
    name: string;
    type: string;
    value?: string;
    components?: object[];
};
export declare type Payload = {
    funcName: string;
    funcSelector: string;
    inputs: Param[];
    outputs: Param[];
};
export declare type DelegatedDetails = {
    id: number;
    last: boolean;
};
export declare type Message = {
    id: number;
    type: MessageType;
    from: string;
    to: string;
    parentId?: number;
    delegatedCall?: DelegatedDetails;
    value: BigNumber;
    payload?: Payload;
    gasUsed: bigint;
    gasLimit: bigint;
    callDepth: number;
    status: boolean;
    error?: string;
};
export declare type Contract = {
    address: string;
    contractName?: string;
    appName?: string;
    balance?: number;
    tokenName?: string;
    symbol?: string;
    decimals?: number;
};
export declare type Contracts = {
    [address: string]: Contract;
};
export declare type Token = {
    address: string;
    name: string;
    symbol: string;
    decimals?: number;
    totalSupply?: bigint;
};
export interface TransactionDetails {
    hash: string;
    nonce: number;
    index: number;
    value: bigint;
    gasPrice: bigint;
    gasLimit: bigint;
    timestamp: Date;
    status: boolean;
    error?: string;
}
export declare type Networks = "mainnet" | "ropsten" | "rinkeby" | "kovan";
export interface DataSourceOptions {
    alethioApiKey?: string;
    network?: Networks;
}
export declare const getTransaction: (txHash: string, options?: DataSourceOptions) => Promise<[Message[], Contracts, TransactionDetails]>;
