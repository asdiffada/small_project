pragma solidity ^0.8.0;

contract SimpleVoting {
    struct Candidate {
        string name;
        uint voteCount;
    }

    address public owner;
    mapping(address => bool) public hasVoted;
    Candidate[] public candidates;

    event Voted(address indexed voter, uint candidateIndex);

    constructor(string[] memory _candidateNames) {
        owner = msg.sender;
        for (uint i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate(_candidateNames[i], 0));
        }
    }

    function vote(uint candidateIndex) public {
        require(!hasVoted[msg.sender], "Sudah voting");
        require(candidateIndex < candidates.length, "Kandidat tidak valid");

        candidates[candidateIndex].voteCount += 1;
        hasVoted[msg.sender] = true;

        emit Voted(msg.sender, candidateIndex);
    }

    function getCandidate(uint index) public view returns (string memory name, uint votes) {
        Candidate memory c = candidates[index];
        return (c.name, c.voteCount);
    }

    function totalCandidates() public view returns (uint) {
        return candidates.length;
    }
}
