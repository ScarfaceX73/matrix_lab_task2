import React, { useState } from "react";
import { ethers } from "ethers";
import contractAbi from "./contract_abi.json";
import { IoMdCalculator, IoMdSwap } from "react-icons/io"
import { RiTodoLine } from "react-icons/ri"
import { BsFillQuestionCircleFill } from "react-icons/bs"
import { BiWorld } from "react-icons/bi"
import { MdAccountBalanceWallet, MdDashboard } from "react-icons/md"
import { FaSlackHash } from "react-icons/fa"
// import { ConnectButton } from "@rainbow-me/rainbowkit";


let mainProvider;
let mainContract;

const WalletCard = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [totalS, setTotalS] = useState(0);
  const obj = [
    {
      id: 0,
      name: "My Total Token",
      value: "34234 TKN"
    },
    {
      id: 1,
      name: "Total Token Value",
      value: userBalance
    },
    {
      id: 2,
      name: "Token Burned",
      value: "3234 TKN"
    },
    {
      id: 3,
      name: "Total Supply",
      value: 1000000
    },
    {
      id: 4,
      name: "Market Volume (USD)",
      value: "54658"
    },
    {
      id: 5,
      name: "Current Price",
      value: "$0.005454"
    }
  ]

  const connectwalletHandler = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (provider) {
      provider.send("eth_requestAccounts", []).then(async () => {
        await accountChangedHandler(provider.getSigner(), provider);
      });
      mainProvider = provider;
    } else {
      setErrorMessage("Please Install Metamask!!!");
    }
  };

  const accountChangedHandler = async (newAccount, provider) => {
    const address = await newAccount.getAddress();
    setDefaultAccount(address);
    const balance = await newAccount.getBalance();
    setUserBalance(ethers.utils.formatEther(balance));
    await getuserBalance(address, provider);
  };

  const getuserBalance = async (address, provider) => {
    await provider.getBalance(address, "latest");
  };

  const testFunction = async () => {
    if (mainProvider) {
      const accounts = await mainProvider.listAccounts();
      const signer = mainProvider.getSigner(accounts[0]);
      mainContract = new ethers.Contract(
        "0x21Bb5dad72fe4D7fDd7c443eec2dcc4E0D23e2ac",
        contractAbi,
        signer
      );
      const totalSupply = (await mainContract.totalSupply())?._hex;
      setTotalS(parseInt(totalSupply, 16));

      const myTotalToken = await mainContract?.balanceOf(accounts[0]);
      console.log(parseInt(myTotalToken, 16));
    }
  };

  testFunction();

  return (
    <div className="WalletCard">
      <div className="topbar">
        {/* <ConnectButton /> */}
        <button className="btn">Swap<span style={{ marginLeft: "17px", marginTop: "10px", color: "#71c7ec" }}><IoMdSwap /></span></button>
        <button className="connect" onClick={() => connectwalletHandler()}>
          {defaultAccount ? "Connected!" : "Connect"}
        </button>
      </div>
      <div className="main">
        <div className="sidebar">
          <div className="core">
            <h3 className="sb-head">CORE</h3>
            <ul>
              <li><span><MdDashboard style={{ paddingRight: "10px" }} /></span>Dashboard</li>
              <li><span><IoMdCalculator style={{ paddingRight: "10px" }} /></span>Calculator</li>
              <li><span><IoMdSwap style={{ paddingRight: "10px" }} /></span>Swap</li>
              <li><span><RiTodoLine style={{ paddingRight: "10px" }} /></span>To Do List</li>
              <li><span><BsFillQuestionCircleFill style={{ paddingRight: "10px" }} /></span>FAQ</li>
            </ul>
          </div>
          <div className="links">
            <h3 className="sb-head">LINKS</h3>
            <ul>
              <li><span><FaSlackHash style={{ paddingRight: "10px" }} /></span>Socials</li>
              <li><span><BiWorld style={{ paddingRight: "10px" }} /></span>Website</li>
              <li><span><MdAccountBalanceWallet style={{ paddingRight: "10px" }} /></span>Buy Now</li>
            </ul>
          </div>
        </div>
        <div className="dashboard">
          <div className="walletAddress">
            <h3>Wallet Address - {defaultAccount}</h3>
          </div>
          <div className="displayAccount">
            {obj.map((item) => {
              return (
                <div className="details" key={item.id}>
                  <h3>{item.name}</h3>
                  <p>{item.value}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default WalletCard;

{/* <h3>Wallet Amount: {userBalance}</h3>
<div>Total Supply: {totalS}</div> */}
