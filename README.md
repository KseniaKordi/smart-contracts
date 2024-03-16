# Smart Gate Barrier System Project

This project consists of two smart contracts, the tests for the contracts, and a script that deploys the contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```


### compile contracts
```shell 
npx hardhat compile
```
### test contract
```shell 
REPORT_GAS=true npx hardhat test test/SmartGate.ts
```
### start node
```shell 
npx hardhat node
```
### deploy to local node
```shell 
npx hardhat run scripts/deploy-SmartGate.ts
```
```shell 
npx hardhat run scripts/deploy-SmartGate.ts --network localhost
```
### deploy to iota node
```shell 
npx hardhat run --network iota scripts/deploy-SmartGate.ts
```

### Testnet explorer 
[https://explorer.evm.testnet.shimmer.network/](https://explorer.evm.testnet.shimmer.network/)
