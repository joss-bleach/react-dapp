import { useState } from "react";

// Blockchain interaction
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import Token from "./artifacts/contracts/Token.sol/Token.json";

const greeterAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const tokenAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

const Home = () => {
  const [greeting, setGreeting] = useState("");
  const [userAccount, setUserAccount] = useState("");
  const [amount, setAmount] = useState(0);

  const requestAccount = async () => {
    // Request user account information from MetaMask
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const fetchGreeting = async () => {
    // Make sure ethereum is connected (MetaMask)
    if (typeof window.ethereum !== "undefined") {
      // Create a provider through ethers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Create instance of the contract (with address, abi from compiled contract and the provider)
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        // Get the greeting value from the blockchain
        const data = await contract.greet();
        // Console log the returned value
        console.log("data: ", data);
      } catch (err) {
        // Throw error if it doesn't work
        console.log("Error: ", err);
      }
    }
  };

  const setGreetingValue = async () => {
    // Make sure a greeting has been entered
    if (!greeting) return;
    // Make sure ethereum is connected (MetaMask)
    if (typeof window.ethereum !== "undefined") {
      // Request the connected account information
      await requestAccount();
      // Create a provider through ethers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Create a signer instance to write to the blockchain
      const signer = provider.getSigner();
      // Create instance of the contract (with address, abi from compiled contract and the signer)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      // Pass in the input greeting variable
      const transaction = await contract.setGreeting(greeting);
      // Clear the greeting value in local state
      setGreeting("");
      // Wait for the transaction to be confirmed on the blockchain
      await transaction.wait();
      // Log the new value of greeting
      fetchGreeting();
    }
  };

  const getBalance = async () => {
    // Make sure ethereum is connected (MetaMask)
    if (typeof window.ethereum !== "undefined") {
      // Get array of accounts from the logged in account
      const [account] = window.ethereum.request({
        method: "eth_requestAccounts",
      });
      // Create a provider through ethers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Create new instance of the token contract
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      // Get the balance from balance of method in contract
      const balance = await contract.balanceOf(account);
      // Console log the balance
      console.log("Balance: ", balance);
    }
  };

  const sendCoins = async () => {
    // Make sure ethereum is connected (MetaMask)
    if (typeof window.ethereum !== "undefined") {
      // Create a provider through ethers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Create a signer instance to write to the blockchain
      const signer = provider.getSigner();
      // Create new instance of the token contract
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      // Transfer the tokens using the transfer method in the smart contract
      const transaction = await contract.transfer(userAccount, amount);
      // Wait for the transaction to be confirmed on the blockchain
      await transaction.wait();
      // Console log success
      console.log(`${amount} coins successfully sent to ${userAccount}`);
    }
  };

  return (
    <div>
      <h1>Greeting app</h1>
      <button onClick={fetchGreeting}>Get current greeting</button>
      <input
        onChange={(e) => setGreeting(e.target.value)}
        value={greeting}
        placeholder="Set a greeting"
      />
      <button onClick={setGreetingValue}>Set new greeting</button>
      <br />
      <h1>Tokens</h1>
      <button onClick={getBalance}>Get Balance</button>
      <button onClick={sendCoins}>Send Coins</button>
      <input
        onChange={(e) => setUserAccount(e.target.value)}
        placeholder="Account ID"
      />
      <input
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount of tokens"
      />
    </div>
  );
};

export default Home;
