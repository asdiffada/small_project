// src/App.js
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import votingAbi from "./SimpleVoting.json";

const CONTRACT_ADDRESS = " ";
const PRIVATE_KEY = " "; // dari akun pertama Hardhat

const App = () => {
  const [candidates, setCandidates] = useState([]);
  const [voting, setVoting] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initContract = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        const signer = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, votingAbi.abi, signer);
        setVoting(contract);

        const total = await contract.totalCandidates();
        let data = [];

        for (let i = 0; i < total; i++) {
          const result = await contract.getCandidate(i);
          data.push({
            index: i,
            name: result[0],
            voteCount: result[1].toString()
          });
        }

        setCandidates(data);
      } catch (err) {
        console.error("Gagal inisialisasi kontrak:", err);
      }
    };

    initContract();
  }, []);

  const handleVote = async (index) => {
    if (!voting) return;
    try {
      setLoading(true);
      const tx = await voting.vote(index);
      await tx.wait();
      alert("Voting berhasil!");

      // Refresh data
      const updated = await voting.getCandidate(index);
      setCandidates((prev) =>
        prev.map((c) =>
          c.index === index ? { ...c, voteCount: updated[1].toString() } : c
        )
      );
    } catch (err) {
      alert("Gagal vote: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🗳️ Simple Voting DApp</h1>
      {candidates.map((c) => (
        <div key={c.index} style={{ marginBottom: "1rem" }}>
          <strong>{c.name}</strong> — {c.voteCount} suara
          <br />
          <button onClick={() => handleVote(c.index)} disabled={loading}>
            {loading ? "Memproses..." : "Vote"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default App;
