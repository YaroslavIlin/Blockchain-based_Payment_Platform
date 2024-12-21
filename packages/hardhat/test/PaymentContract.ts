import { ethers } from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { PaymentContract } from "../typechain-types";

describe("PaymentContract", function () {
  let paymentContract: PaymentContract;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;

  beforeEach(async () => {
    const paymentContractFactory = await ethers.getContractFactory("PaymentContract");
    paymentContract = await paymentContractFactory.deploy();
    await paymentContract.waitForDeployment();

    [owner, addr1] = await ethers.getSigners();
  });
  
  it("Should accept payments", async () => {
    const paymentAmount = ethers.parseEther("1.0"); // 1 ETH

    // addr1 отправляет 1 ETH на контракт
    await addr1.sendTransaction({
      to: paymentContract.target,
      value: paymentAmount,
    });

    const balance = await paymentContract.getBalance();
    expect(balance).to.equal(paymentAmount);
  });

  it("Should allow the owner to withdraw funds", async () => {
    const paymentAmount = ethers.parseEther("1.0"); // 1 ETH

    // addr1 отправляет 1 ETH на контракт
    await addr1.sendTransaction({
      to: paymentContract.target,
      value: paymentAmount,
    });

    // Проверяем баланс контракта перед выводом
    const contractBalanceBefore = await paymentContract.getBalance();
    expect(contractBalanceBefore).to.equal(paymentAmount);

    // Владелец выводит средства
    await paymentContract.withdraw(paymentAmount);

    // Проверяем баланс контракта после вывода
    const contractBalanceAfter = await paymentContract.getBalance();
    expect(contractBalanceAfter).to.equal(0);

    // Проверяем баланс владельца после вывода
    const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
    expect(ownerBalanceAfter).to.be.gt(0); // Баланс владельца должен увеличиться
  });

  it("Should not allow non-owner to withdraw funds", async () => {
    const paymentAmount = ethers.parseEther("1.0"); // 1 ETH

    // addr1 отправляет 1 ETH на контракт
    await addr1.sendTransaction({
      to: paymentContract.target,
      value: paymentAmount,
    });

    // addr1 пытается вывести средства
    await expect(paymentContract.connect(addr1).withdraw(paymentAmount)).to.be.revertedWith(
      "Only the owner can withdraw funds"
    );
  });

  it("Should not allow withdrawal of more than the contract balance", async () => {
    const paymentAmount = ethers.parseEther("1.0"); // 1 ETH

    // addr1 отправляет 1 ETH на контракт
    await addr1.sendTransaction({
      to: paymentContract.target,
      value: paymentAmount,
    });

    // Владелец пытается вывести больше средств, чем есть в контракте
    await expect(paymentContract.withdraw(paymentAmount + BigInt(1))).to.be.revertedWith(
      "Insufficient balance in contract"
    );
  });
});