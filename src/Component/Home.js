import React, { useState, useEffect, useContext } from "react";
import { AppState } from "../App";
import { HeaderState } from "./Header";

const Home = () => {
  const App = useContext(AppState);
  const Header = useContext(HeaderState);
  const [initialProposals, setinitialProposals] = useState([]);
  const [involvedProposals, setinvolvedProposals] = useState([]);
  const [num, setnum] = useState(0);
  const [coldAmount, setcoldAmount] = useState(0);
  const [hotAmount, sethotAmount] = useState(0);
  const [timeStamp, settimeStamp] = useState(0);

  const WithdrawFromPlatform = async (addr) => {
    try {
      const tx = await App.Charitycontract.withdrawDonationFromPlatform(addr);
      await tx.wait();
      alert("Withdraw Successfull!");
      setnum(num + 1);
    } catch (error) {
      if (error.message.includes("user rejected transaction")) {
        console.log(error.message);
        alert("User rejected transaction");
      } else if (
        error.error.message ==
        "execution reverted: The crowfunding is not finished yet"
      ) {
        alert("The crowfunding is not finished yet, cannot withdraw now!");
      } else {
        alert("You have no money to withdraw!");
      }
    }
  };

  function convertTime(sec) {
    let date = new Date(sec * 1000);
    return date.toLocaleString();
  }
  function convertState(n) {
    let state;
    if (n == 0) {
      state = "Active";
    } else if (n == 1) {
      state = "Expired";
    } else {
      state = "Completed";
    }
    return state;
  }

  const FinishCampaign = async (id) => {
    try {
      console.log(id);
      const tx = await App.Charitycontract.finishCampaign(id);
      await tx.wait();
      alert("Finished Successfully!");
      setnum(num + 1);
    } catch (error) {
      if (
        error.error.message ==
        "execution reverted: The campaign does not have enough money"
      ) {
        alert("The campaign does not have enough money, cannot finish now!");
      } else if (error.message.includes("user rejected transaction")) {
        alert("User denied transaction");
      } else if (
        error.error.message ==
        "execution reverted: The campaign is not active. Could not be closed"
      ) {
        alert("The campaign is not active. Could not be closed");
      } else {
        console.log(error.message);
        alert("Something went wrong");
      }
    }
  };

  const CancelCampaign = async (id) => {
    try {
      console.log(id);
      const tx = await App.Charitycontract.cancelCampaign(id);
      await tx.wait();
      alert("Canceled Successfully!");
      setnum(num + 1);
    } catch (error) {
      if (
        error.error.message ==
        "execution reverted: The campaign is not active. Could not be cancelled"
      ) {
        alert("The campaign is not active. Could not be cancelled!");
      } else if (error.message.includes("user rejected transaction")) {
        alert("User denied transaction");
      } else {
        console.log(error.message);
        alert("Something went wrong");
      }
    }
  };

  useEffect(() => {
    const getYourInfo = async () => {
      try {
        const { timestamp, coldAmount, hotAmount } =
          await App.Charitycontract.getContributors(Header.Address);
        setcoldAmount(coldAmount);
        sethotAmount(hotAmount);
        settimeStamp(timestamp);
      } catch (error) {
        console.log(error);
      }
    };
    getYourInfo();
  }, [num]);
  useEffect(() => {
    const getProposals = async () => {
      try {
        const Count = await App.Charitycontract.getNumProposals();
        let initialProposals = [];
        let involvedProposals = [];
        for (let i = 0; i < Count; i++) {
          const Proposal = await App.Charitycontract.proposals(i);
          if (Proposal.proposer.toLowerCase() == Header.Address.toLowerCase()) {
            initialProposals.push(Proposal);
          }
          const donationAmount =
            await App.Charitycontract.getProposalDonationAmount(
              i,
              Header.Address
            );
          if (donationAmount > 0) {
            involvedProposals.push(Proposal);
          }
        }
        setinitialProposals(initialProposals);
        setinvolvedProposals(involvedProposals);
      } catch (error) {
        console.log(error);
      }
    };
    getProposals();
  }, []);

  const Withdraw = async (id) => {
    try {
      const tx = await App.Charitycontract.withdrawDonationFromCampaign(id);
      await tx.wait();
      alert("Withdraw Successfull!");
      setnum(num + 1);
    } catch (error) {
      if (error.message.includes("user rejected transaction")) {
        alert("User rejected transaction");
      } else if (
        error.error.message ==
        "execution reverted: You have not donated to this campaign"
      ) {
        alert("You have not donated to this campaign!");
      } else if (
        error.error.message ==
        "execution reverted: The campaign is completed successfully and donation could not be withdrawn"
      ) {
        alert(
          "The campaign is completed successfully and donation could not be withdrawn!"
        );
      }
    }
  };

  const Donate = async (id) => {
    try {
      console.log(id);
      const tx = await App.Charitycontract.donateProposal(id);
      await tx.wait();
      alert("Donated Successfull!");
      setnum(num + 1);
    } catch (error) {
      if (
        error.error.message ==
        "execution reverted: You do not have balance for new donation, please wait for the current active crowfunding to finish"
      ) {
        console.log(error.message);
        alert("You do not have balance for new donation!");
      } else if (error.message.includes("user rejected transaction")) {
        alert("User denied transaction");
      } else if (
        error.error.message == "execution reverted: The campaign is not active"
      ) {
        console.log(error.message);
        alert("The campaign is not active!");
      } else {
        alert("You do not have balance for donation");
      }
    }
  };
  const textStyle = {
    // whiteSpace: "nowrap",
    // overflow: "hidden",
    // textOverflow: "ellipsis",
    fontSize: "13px",
    wordWrap: "break-word",
  };

  return (
    <div>
      <div class="flex flex-col text-center w-full mb-12">
        <p class="sm:text-3l text-2xl font-medium title-font mt-5 text-gray-700 shadow-md p-3 rounded-lg bg-white">
          Your latest donation:{" "}
          {timeStamp == 0 ? "null" : convertTime(timeStamp)}
        </p>
      </div>
      <div class="flex flex-col text-center w-full mb-12">
        <p class="sm:text-3l text-2xl font-medium title-font text-gray-700 shadow-md p-3 rounded-lg bg-white">
          Current donation amount in platform:{" "}
          {Number(coldAmount.toString()) / 10 ** 18} ETH
        </p>
      </div>
      <div class="flex flex-col text-center w-full mb-12">
        <h4 class="sm:text-3l text-2xl font-medium title-font text-gray-700 shadow-md p-3 rounded-lg bg-white">
          Current donation amount in campaigns:{" "}
          {Number(hotAmount.toString()) / 10 ** 18} ETH
        </h4>
      </div>
      <div class="flex items-center justify-center space-x-4 mx-auto shadow-md p-3 rounded-lg bg-white">
        <span class="sm:text-3l text-2xl font-medium title-font mb-0 text-gray-700">
          Withdraw money from the platform:
        </span>
        <button
          onClick={() => WithdrawFromPlatform(Header.Address)}
          class="text-white bg-yellow-400 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded"
        >
          Withdraw
        </button>
      </div>
      <p class="sm:text-3l text-2xl font-medium title-font mb-0 mt-5 ml-10 text-gray-900">
        My Initiatives:
      </p>
      <div class="container px-5 py-5 mx-auto">
        <div class="grid sm:grid-cols-1 lg:grid-cols-3 gap-4">
          {initialProposals && initialProposals.length !== 0 ? (
            initialProposals
              .sort((a, b) => a.state - b.state)
              .map((e) => {
                return (
                  <div key={e.uniqueid} class="p-4">
                    <div class="h-full bg-gray-100 bg-opacity-75 px-8 pt-10 pb-24 rounded-lg overflow-hidden text-center relative">
                      <h2 class="tracking-widest text-base title-font font-medium text-gray-900 mb-1 -mt-1">
                        #{e.uniqueid.toString()}
                      </h2>
                      <h2 class="tracking-widest text-15px title-font font-medium text-gray-900 mb-1">
                        Recipient Address
                      </h2>
                      <h2
                        class="tracking-widest text-base title-font font-medium text-gray-900 mb-1"
                        style={textStyle}
                        title={e.recipient}
                      >
                        {e.recipient}
                      </h2>
                      <p
                        class="leading-relaxed mt-5 mb-10"
                        style={textStyle}
                        title={e.description}
                      >
                        {e.description}
                      </p>
                      <div class="text-center mt-2 leading-none flex justify-center absolute bottom-5 left-0 w-full py-4">
                        <span class="text-gray-500  font-bold mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                          Funds Need
                        </span>
                        <span class="text-gray-650 font-bold  inline-flex items-center leading-none text-sm">
                          {Number(e.targetAmount.toString()) / 10 ** 18} ETH {}
                        </span>
                        <span class="text-gray-500 ml-10 font-bold mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                          {e.state == 0
                            ? "Current Funds"
                            : e.state == 2
                            ? "Final Funds"
                            : "Current Funds"}
                        </span>
                        <span class="text-gray-650 font-bold  inline-flex items-center leading-none text-sm">
                          {Number(e.currentAmount.toString()) / 10 ** 18} ETH {}
                        </span>
                      </div>
                      <div class="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
                        <span class="text-gray-500  font-bold mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                          Start time
                        </span>
                        <span class="text-gray-650 font-bold  inline-flex items-center leading-none text-sm">
                          {convertTime(e.startTime)}
                        </span>
                        <span class="text-gray-500  font-bold ml-10 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                          State
                        </span>
                        <span class="text-gray-650 font-bold  inline-flex items-center leading-none text-sm">
                          {convertState(e.state)}
                        </span>
                      </div>
                      <div className="flex justify-center absolute bottom-14 left-0 w-full py-4">
                        <button
                          onClick={() =>
                            FinishCampaign(Number(e.uniqueid.toString()))
                          }
                          class="flex mx-auto mt-10 text-white bg-yellow-400 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded"
                        >
                          Finish
                        </button>
                        <button
                          onClick={() =>
                            CancelCampaign(Number(e.uniqueid.toString()))
                          }
                          class="flex mx-auto mt-10 text-white bg-yellow-400 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div class="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3 ml-14">
              No Proposals found.
            </div>
          )}
        </div>
      </div>
      <p class="sm:text-3l text-2xl font-medium title-font mb-0 mt-5 ml-10 text-gray-900">
        My Participation:
      </p>
      <div class="container px-5 py-5 mx-auto">
        <div class="grid sm:grid-cols-1 lg:grid-cols-3 gap-4">
          {involvedProposals && involvedProposals.length !== 0 ? (
            involvedProposals
              .sort((a, b) => a.state - b.state)
              .map((e) => {
                return (
                  <div key={e.uniqueid} class="p-4">
                    <div class="h-full bg-gray-100 bg-opacity-75 px-8 pt-10 pb-24 rounded-lg overflow-hidden text-center relative">
                      <h2 class="tracking-widest text-base title-font font-medium text-gray-900 mb-1 -mt-1">
                        #{e.uniqueid.toString()}
                      </h2>
                      <h2 class="tracking-widest text-15px title-font font-medium text-gray-900 mb-1">
                        Recipient Address
                      </h2>
                      <h2
                        class="tracking-widest text-base title-font font-medium text-gray-900 mb-1"
                        style={textStyle}
                        title={e.recipient}
                      >
                        {e.recipient}
                      </h2>
                      <p
                        class="leading-relaxed mt-5 mb-10"
                        style={textStyle}
                        title={e.description}
                      >
                        {e.description}
                      </p>
                      <div class="text-center mt-2 leading-none flex justify-center absolute bottom-5 left-0 w-full py-4">
                        <span class="text-gray-500  font-bold mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                          Funds Need
                        </span>
                        <span class="text-gray-650 font-bold  inline-flex items-center leading-none text-sm">
                          {Number(e.targetAmount.toString()) / 10 ** 18} ETH {}
                        </span>
                        <span class="text-gray-500 ml-10 font-bold mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                          {e.state == 0
                            ? "Current Funds"
                            : e.state == 2
                            ? "Final Funds"
                            : "Current Funds"}
                        </span>
                        <span class="text-gray-650 font-bold  inline-flex items-center leading-none text-sm">
                          {Number(e.currentAmount.toString()) / 10 ** 18} ETH {}
                        </span>
                      </div>
                      <div class="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
                        <span class="text-gray-500  font-bold mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                          Start time
                        </span>
                        <span class="text-gray-650 font-bold  inline-flex items-center leading-none text-sm">
                          {convertTime(e.startTime)}
                        </span>
                        <span class="text-gray-500  font-bold ml-10 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                          State
                        </span>
                        <span class="text-gray-650 font-bold  inline-flex items-center leading-none text-sm">
                          {convertState(e.state)}
                        </span>
                      </div>
                      <div className="flex justify-center absolute bottom-14 left-0 w-full py-4">
                        <button
                          onClick={() => Donate(Number(e.uniqueid.toString()))}
                          class="flex mx-auto mt-10 text-white bg-yellow-400 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded"
                        >
                          Donate
                        </button>
                        <button
                          onClick={() =>
                            Withdraw(Number(e.uniqueid.toString()))
                          }
                          class="flex mx-auto mt-10 text-white bg-yellow-400 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded"
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div class="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3 ml-14">
              No Proposals found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
