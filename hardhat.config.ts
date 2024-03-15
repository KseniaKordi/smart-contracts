import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
    solidity: "0.8.19",
    networks: {
        iota: {
            url: 'https://json-rpc.evm.testnet.shimmer.network',
            chainId: 1073,
            timeout: 60000,
            accounts: {mnemonic: "hollow useful dry sustain key retreat goat become black ramp trumpet craft thumb ozone viable near topic cloth match alarm hazard legal afford speak"}
        },
        iotalocal: {
            url: 'http://localhost/wasp/api/v1/chains/tst1pp8r8hea2d0wyf4ak49hjjr7wgdu5vpy947ww78k3gfh4em6nmgevmtf47q/evm',
            chainId: 1074,
            timeout: 60000,
            accounts: {mnemonic: "hollow useful dry sustain key retreat goat become black ramp trumpet craft thumb ozone viable near topic cloth match alarm hazard legal afford speak"}
        }
    }
};

export default config;
