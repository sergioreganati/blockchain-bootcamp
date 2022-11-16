
async function main() {
  console.log('Preparing deployment... \n')
  //Fetch contract to deploy
  const Token = await ethers.getContractFactory("Token")
  const Exchange = await ethers.getContractFactory("Exchange")

  const accounts = await ethers.getSigners()
  console.log(`Accounts fetched:\n${accounts[0].address}\n${accounts[1].address}\n`)
  
  //Deploy contracts
  const sdex = await Token.deploy('SDEX', 'SDEX',1000000)
  await sdex.deployed()
  console.log(`SDEX deployed to: ${sdex.address}`)

  const mETH = await Token.deploy('mETH', 'mETH',1000000)
  await mETH.deployed()
  console.log(`mETH deployed to: ${mETH.address}`)

  const mDai = await Token.deploy('mDai', 'mDai',1000000)
  await mDai.deployed()
  console.log(`mDai deployed to: ${mDai.address}`)

  const exchange = await Exchange.deploy(accounts[1].address, 10)
  await exchange.deployed()
  console.log(`Exchange deployed to: ${exchange.address}`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
