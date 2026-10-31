require("@nomicfoundation/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 31337
    },
    docker: {
      url: process.env.HARDHAT_RPC_URL || "http://127.0.0.1:8545"
    }
  }
};
