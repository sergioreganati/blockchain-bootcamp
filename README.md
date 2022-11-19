# Blockchain developer bootcamp

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
npm start --localhost
nvm install 16.14.2



#1. Run node
npx hardhat node

#2. Run deployment script
npx hardhat run --network localhost scripts/1_deploy.js

#3. Check config.json for addresses & run seed script
npx hardhat run --network localhost scripts/2_seed.js

#4. Run react app
npm start app.js
localhost:3000

git push -u origin main