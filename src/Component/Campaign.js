import React, { useState, useEffect, useContext } from "react";
import { AppState } from "../App";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Campaign = () => {
  const App = useContext(AppState);
  const [ActiveProposals, setActiveProposals] = useState([]);
  const [CompletedProposals, setCompletedProposals] = useState([]);
  const [num, setnum] = useState(0);
  const [uid, setuid] = useState("");
  const [proposal, setproposal] = useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = async () => {
    try {
      const Proposal = await App.Charitycontract.proposals(uid);
      setproposal(Proposal);
      setOpen(true);
      setuid("");
    } catch (error) {
      alert("Please input valid campaign id!");
      setuid("");
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

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
  useEffect(() => {
    const getProposals = async () => {
      try {
        const Count = await App.Charitycontract.getNumProposals();
        let activeProposals = [];
        let completedProposals = [];
        for (let i = 0; i < Count; i++) {
          const Proposal = await App.Charitycontract.proposals(i);
          if (Proposal.state == 0) {
            activeProposals.push(Proposal);
          } else if (Proposal.state == 2) {
            completedProposals.push(Proposal);
          }
        }
        setActiveProposals(activeProposals);
        setCompletedProposals(completedProposals);
      } catch (error) {
        console.log(error);
      }
    };
    getProposals();
  }, [num]);

  const textStyle = {
    // whiteSpace: "nowrap",
    // overflow: "hidden",
    // textOverflow: "ellipsis",
    fontSize: "13px",
    wordWrap: "break-word",
  };

  return (
    <div>
      <p class="sm:text-3l text-2xl font-medium title-font mb-5 mt-5 ml-10 text-gray-900">
        Search for campaign:
      </p>
      <div class="flex lg:w-2/3 w-full sm:flex-row flex-col justify-start px-8 sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-end ml-10">
        <div class="relative flex-grow w-full ">
          <input
            value={uid}
            onChange={(e) => setuid(e.target.value)}
            type="text"
            id="full-name"
            name="full-name"
            placeholder="Please input valid campaign id"
            style={{ width: "1000px" }}
            class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-yellow-500 focus:bg-transparent focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <Button
          variant="outlined"
          onClick={handleClickOpen}
          style={{ whiteSpace: "nowrap" }}
          class="flex mx-auto mt-10 text-white bg-yellow-400 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded"
        >
          Show Details
        </Button>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{}} id="draggable-dialog-title">
          Campaign Details:
        </DialogTitle>
        {proposal && proposal != undefined && (
          <DialogContent>
            <DialogContentText>
              uid: {proposal.uniqueid.toString()}
            </DialogContentText>
            <DialogContentText>
              address of proposer: {proposal.proposer.toString().toLowerCase()}
            </DialogContentText>
            <DialogContentText>
              start time: {convertTime(proposal.startTime)}
            </DialogContentText>
            <DialogContentText>
              description: {proposal.description.toString()}
            </DialogContentText>
            <DialogContentText>
              address of recipient:{" "}
              {proposal.recipient.toString().toLowerCase()}
            </DialogContentText>
            <DialogContentText>
              targetAmount:{" "}
              {Number(proposal.targetAmount.toString()) / 10 ** 18} ETH
            </DialogContentText>
            <DialogContentText>
              currentAmount:{" "}
              {Number(proposal.currentAmount.toString()) / 10 ** 18} ETH
            </DialogContentText>
            <DialogContentText>
              state: {convertState(proposal.state)}
            </DialogContentText>
            <DialogContentText>
              number of donors: {proposal.numDonors.toString()}
            </DialogContentText>
            <DialogContentText>
              address of final donors:{" "}
              {proposal.finalDonors == undefined
                ? "not available now"
                : proposal.finalDonors.toString()}
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
      <p class="sm:text-3l text-2xl font-medium title-font mb-0 mt-5 ml-10 text-gray-900">
        Now Active:
      </p>
      <div class="container px-5 py-5 mx-auto">
        <div class="grid sm:grid-cols-1 lg:grid-cols-3 gap-4">
          {ActiveProposals && ActiveProposals.length !== 0 ? (
            ActiveProposals.sort((a, b) => b.startTime - a.startTime).map(
              (e) => {
                return (
                  <div class="p-4">
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
                      <h2
                        class="leading-relaxed mt-5 mb-10"
                        style={textStyle}
                        title={e.description}
                      >
                        {e.description}
                      </h2>
                      <div class="text-center mt-2 leading-none flex justify-center absolute bottom-5 left-0 w-full py-4">
                        <span class="text-gray-500 font-bold mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                          Funds Need
                        </span>
                        <span class="text-gray-650 font-bold  inline-flex items-center leading-none text-sm">
                          {Number(e.targetAmount.toString()) / 10 ** 18} ETH {}
                        </span>
                        <span class="text-gray-500 ml-10 font-bold mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                          Current Funds
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
                        <span class="text-gray-500  font-bold ml-5 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                          Number of donors
                        </span>
                        <span class="text-gray-650 font-bold  inline-flex items-center leading-none text-sm">
                          {e.numDonors.toString()}
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
              }
            )
          ) : (
            <div class="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3 ml-14">
              No Active Proposals now.
            </div>
          )}
        </div>
      </div>
      <p class="sm:text-3l text-2xl font-medium title-font mb-0 mt-5 ml-10 text-gray-900">
        Completed:
      </p>
      <div class="container px-5 py-5 mx-auto">
        <div class="grid sm:grid-cols-1 lg:grid-cols-3 gap-4">
          {CompletedProposals && CompletedProposals.length !== 0 ? (
            CompletedProposals.sort((a, b) => b.startTime - a.startTime).map(
              (e) => {
                return (
                  <div class="p-4">
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
                          Final Funds
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
                        <span class="text-gray-500  font-bold ml-5 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                          Number of donors
                        </span>
                        <span class="text-gray-650 font-bold  inline-flex items-center leading-none text-sm">
                          {e.numDonors.toString()}
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
              }
            )
          ) : (
            <div class="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3 ml-14">
              No Completed Proposals now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Campaign;
