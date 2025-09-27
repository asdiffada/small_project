const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("SimpleVoting");

  const voting = await Voting.deploy(["Alice", "Bob", "Charlie"]);
  await voting.waitForDeployment();

  console.log("SimpleVoting deployed to:", voting.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
