import React, { useState, useContext, useEffect } from "react";
import { AppState } from "../App";
import { ethers } from "ethers";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
const Create = () => {
  const App = useContext(AppState);
  const [Address, setAddress] = useState();
  const [targetAmount, setTargetAmount] = useState();
  const [Description, setDescription] = useState();
  const [Balance, setBalance] = useState("");
  const [PassNum, setPassNum] = useState("");
  const [TestName, setTestName] = useState("");

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setPassNum("");
    setTestName("");
  };

  useEffect(() => {
    const getBal = async () => {
      try {
        const Balance = await App.Charitycontract.getContractBalance();
        setBalance(Balance);
      } catch (error) {
        console.log(error);
      }
    };
    getBal();
  }, []);

  const Create = async () => {
    try {
      if (PassNum == "123456" && TestName == "test") {
        const tx = await App.Charitycontract.createProposal(
          Description,
          Address,
          ethers.utils.parseEther(targetAmount)
        );
        await tx.wait();
        alert("Created Sucessfully!");
        setAddress("");
        setTargetAmount("");
        setDescription("");
      } else {
        alert("Invalid identity!");
      }
    } catch (error) {
      if (error.message.includes("user rejected transaction")) {
        alert("User rejected transaction");
      } else {
        console.log(error.message);
        alert("Please input the valid address or amount");
      }
    }
  };
  return (
    <div>
      <section class="text-gray-600 body-font relative">
        <div class="container px-5 py-10 mx-auto">
          <div class="flex flex-col text-center w-full mb-12">
            <h1 class="sm:text-3xl text-2xl font-medium title-font mb-0 text-gray-900">
              Contract Balance : {Balance.toString() / 10 ** 18} ETH
            </h1>
          </div>
          <div class="flex flex-col text-center w-full mb-12">
            <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Initiate campaign
            </h1>
          </div>
          <div class="lg:w-1/2 md:w-2/3 mx-auto">
            <div class="flex flex-wrap -m-2">
              <div class="p-2 w-1/2">
                <div class="relative">
                  <label for="name" class="leading-7 text-sm text-gray-600">
                    Recipient Address
                  </label>
                  <input
                    value={Address}
                    onChange={(e) => setAddress(e.target.value)}
                    type="text"
                    class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div class="p-2 w-1/2">
                <div class="relative">
                  <label for="email" class="leading-7 text-sm text-gray-600">
                    Target amount in ETH
                  </label>
                  <input
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    type="text"
                    class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div class="p-2 w-full">
                <div class="relative">
                  <label for="message" class="leading-7 text-sm text-gray-600">
                    Description
                  </label>
                  <textarea
                    value={Description}
                    onChange={(e) => setDescription(e.target.value)}
                    id="message"
                    name="message"
                    class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  ></textarea>
                </div>
              </div>
              <div class="p-2 w-full">
                <Button
                  variant="outlined"
                  onClick={handleClickOpen}
                  class="flex mx-auto text-white bg-yellow-500 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded text-lg"
                >
                  Submit
                </Button>
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Verify Identity</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      To Initiate campaign to this platform, please enter your
                      passport number and name.
                    </DialogContentText>
                    <TextField
                      autoFocus
                      required
                      margin="dense"
                      id="passport"
                      name="passport"
                      label="Passport"
                      type="text"
                      fullWidth
                      variant="standard"
                      value={PassNum}
                      onChange={(e) => setPassNum(e.target.value)}
                    />
                    <TextField
                      autoFocus
                      required
                      margin="dense"
                      id="name"
                      name="name"
                      label="Name"
                      type="text"
                      fullWidth
                      variant="standard"
                      value={TestName}
                      onChange={(e) => setTestName(e.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                      onClick={() => {
                        handleClose();
                        Create();
                      }}
                    >
                      Submit
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Create;
