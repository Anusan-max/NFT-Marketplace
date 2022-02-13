const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KBMarket", function () {
  it("Should mint and tradde NFTs", async function () {
    const Market = await ethers.getContractFactory('KBMarket')
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

  });
});
