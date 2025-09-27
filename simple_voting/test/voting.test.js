const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleVoting", function () {
  let Voting;
  let voting;
  let owner, voter1, voter2;

  beforeEach(async () => {
    [owner, voter1, voter2] = await ethers.getSigners();
    Voting = await ethers.getContractFactory("SimpleVoting");
    voting = await Voting.deploy(["Alice", "Bob", "Charlie"]);
    await voting.waitForDeployment();
  });

  it("should initialize with 3 candidates", async () => {
    const total = await voting.totalCandidates();
    expect(total).to.equal(3);
  });

  it("should allow a user to vote", async () => {
    await voting.connect(voter1).vote(1);
    const [name, count] = await voting.getCandidate(1);
    expect(name).to.equal("Bob");
    expect(count).to.equal(1);
  });

  it("should prevent double voting", async () => {
    await voting.connect(voter1).vote(0);
    await expect(voting.connect(voter1).vote(1)).to.be.revertedWith("Sudah voting");
  });

  it("should emit Voted event", async () => {
    await expect(voting.connect(voter2).vote(2))
      .to.emit(voting, "Voted")
      .withArgs(voter2.address, 2);
  });
});
