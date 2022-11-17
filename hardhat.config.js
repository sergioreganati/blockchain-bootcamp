require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const privateKeys1 = process.env.PRIVATE_KEY_1 || "";
const privateKeys2 = process.env.PRIVATE_KEY_2 || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    localhost: {},
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts:[privateKeys1.toString(), privateKeys2.toString()],
  },
},
}
