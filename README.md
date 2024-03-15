# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

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
