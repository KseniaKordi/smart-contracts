import {ethers} from "hardhat";
import {expect} from 'chai';
import {loadFixture} from '@nomicfoundation/hardhat-toolbox/network-helpers';
import {Signer} from 'ethers';
import {performance} from 'perf_hooks';

describe("SmartGate", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.


    async function convertToTypeBytes16(uuid: string) {
        let uuidWithoutHyphens = uuid.replace(/-/g, '').toLowerCase();
        return '0x' + uuidWithoutHyphens;
    }

    const randomSigners = (amount: number): Signer[] => {
        const signers: Signer[] = []
        for (let i = 0; i < amount; i++) {
            signers.push(ethers.Wallet.createRandom())
        }
        return signers
    }

    async function deployFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, carAddress1, carAddress2] = await ethers.getSigners();

        const smartGateFactory = await ethers.getContractFactory("SmartGate2");
        const smartGate = await smartGateFactory.deploy();

        return {smartGate, owner, carAddress1, carAddress2};
    }


    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const {smartGate, owner} = await loadFixture(deployFixture);
            expect(await smartGate.owner()).to.equal(owner.address);
        });
    });

    describe("Access", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from not contract creator account grantAccess", async function () {
                const {smartGate, owner, carAddress1} = await loadFixture(deployFixture);

                let gateUUID = await convertToTypeBytes16("c32d8b45-92fe-44f6-8b61-42c2107dfe87");
                // We use lock.connect() to send a transaction from another account
                await expect(smartGate.connect(carAddress1).grantAccess(gateUUID, carAddress1.getAddress())).to.be.revertedWith(
                    "You aren't the owner"
                );
            });
            it("Should revert with the right error if called from not contract creator account denyAccess", async function () {
                const {smartGate, owner, carAddress1} = await loadFixture(deployFixture);

                let gateUUID = await convertToTypeBytes16("c32d8b45-92fe-44f6-8b61-42c2107dfe87");
                // We use lock.connect() to send a transaction from another account
                await expect(smartGate.connect(carAddress1).denyAccess(gateUUID, carAddress1.getAddress())).to.be.revertedWith(
                    "You aren't the owner"
                );
            });
        });

        describe("Complexity test for requestAccess", function () {
            let array = [10, 20, 40, 80, 160, 320, 640, 1280, 2560]

            for (let addresses of array) {
                let signers = randomSigners(addresses);
                it("Should call requestAccess for addresses " + addresses, async function () {
                    const {smartGate, owner, carAddress1} = await loadFixture(deployFixture);
                    let gateUUID = await convertToTypeBytes16("c32d8b45-92fe-44f6-8b61-42c2107dfe87");
                    for (let signer of signers) {
                        await expect(smartGate.connect(owner).grantAccess(gateUUID, signer.getAddress())).not.to.be.reverted;
                    }

                    await expect(smartGate.connect(owner).grantAccess(gateUUID, carAddress1.getAddress())).not.to.be.reverted;
                    let address = await carAddress1.getAddress();
                    let content = "hello"

                    const startTime = performance.now()
                    await expect(smartGate.connect(carAddress1).requestAccess(gateUUID, content))
                        .to.emit(smartGate, "AccessAttempt")
                        .withArgs(gateUUID, address, true, content);
                    const endTime = performance.now()
                    console.log(`it took ${endTime - startTime} milliseconds for ${addresses} addresses`)
                })
            }


        });

        describe("Request access", function () {


            it("Should produce event AccessAttempt event with false", async function () {
                const {smartGate, owner, carAddress1} = await loadFixture(deployFixture);

                let gateUUID = await convertToTypeBytes16("c32d8b45-92fe-44f6-8b61-42c2107dfe87");

                let address = await carAddress1.getAddress();
                let content = "hello"
                await expect(smartGate.connect(carAddress1).requestAccess(gateUUID, content))
                    .to.emit(smartGate, "AccessAttempt")
                    .withArgs(gateUUID, address, false, content);
            });

            it("Should produce event AccessAttempt event with true", async function () {
                const {smartGate, owner, carAddress1} = await loadFixture(deployFixture);

                let gateUUID = await convertToTypeBytes16("c32d8b45-92fe-44f6-8b61-42c2107dfe87");

                await expect(smartGate.connect(owner).grantAccess(gateUUID, carAddress1.getAddress())).not.to.be.reverted;
                let address = await carAddress1.getAddress();
                let content = "hello"
                await expect(smartGate.connect(carAddress1).requestAccess(gateUUID, content))
                    .to.emit(smartGate, "AccessAttempt")
                    .withArgs(gateUUID, address, true, content);
            });
        });

        describe("Grant/deny access", function () {
            it("Should produce event AccessAttempt event with true and then with false", async function () {
                const {smartGate, owner, carAddress1} = await loadFixture(deployFixture);

                let gateUUID = await convertToTypeBytes16("c32d8b45-92fe-44f6-8b61-42c2107dfe87");

                let address = await carAddress1.getAddress();
                let content = "hello"

                await expect(smartGate.connect(owner).grantAccess(gateUUID, carAddress1.getAddress())).not.to.be.reverted;

                await expect(smartGate.connect(carAddress1).requestAccess(gateUUID, content))
                    .to.emit(smartGate, "AccessAttempt")
                    .withArgs(gateUUID, address, true, content);

                await expect(smartGate.connect(owner).denyAccess(gateUUID, carAddress1.getAddress())).not.to.be.reverted;

                await expect(smartGate.connect(carAddress1).requestAccess(gateUUID, content))
                    .to.emit(smartGate, "AccessAttempt")
                    .withArgs(gateUUID, address, false, content);
            });
        });
    });
});
