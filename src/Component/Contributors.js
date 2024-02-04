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
const Contributors = () => {
  const App = useContext(AppState);
  const [Amount, setAmount] = useState();
  const [minimumDonation, setMinimumDonation] = useState("");
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

  const Contribute = async () => {
    try {
      if (PassNum == "123456" && TestName == "test") {
        const tx = await App.Charitycontract.receiveDonation({
          value: ethers.utils.parseEther(Amount),
        });
        await tx.wait();
        alert("Donated Sucessfull!");
        setAmount("");
      } else {
        alert("Invalid identity!");
      }
    } catch (error) {
      if (error.message.includes("user rejected transaction")) {
        alert("User rejected transaction.");
      } else if (error.message.includes("invalid decimal value")) {
        alert("Please input valid decimal value!");
      } else if (
        error.error.message == "execution reverted: Minimum donation is not met"
      ) {
        alert("Minimum donation is not met!");
      } else {
        console.log(error.message);
        alert("Something went wrong");
      }
    }
  };

  useEffect(() => {
    const getMinimumDonation = async () => {
      try {
        const minimumDonation =
          await App.Charitycontract.getMinimumContribution();
        setMinimumDonation(minimumDonation);
      } catch (error) {
        console.log(error);
      }
    };
    getMinimumDonation();
  }, []);

  return (
    <div>
      <section class="text-gray-600 body-font">
        <div class="container px-5 py-24 mx-auto">
          <div class="flex flex-col text-center w-full mb-12">
            <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              For Contributors
            </h1>
            <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
              The minimum donation amount is{" "}
              {minimumDonation.toString() / 10 ** 18} ETH
            </p>
          </div>
          <div class="flex lg:w-2/3 w-full sm:flex-row flex-col mx-auto px-8 sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-end">
            <div class="relative flex-grow w-full">
              <label for="full-name" class="leading-7 text-sm text-gray-600">
                Amount in ETH
              </label>
              <input
                value={Amount}
                onChange={(e) => setAmount(e.target.value)}
                type="text"
                id="full-name"
                name="full-name"
                class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-yellow-500 focus:bg-transparent focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <Button
              variant="outlined"
              onClick={handleClickOpen}
              class="text-white bg-yellow-500 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded text-lg"
            >
              Submit
            </Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Verify Identity</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  To donate to this platform, please enter your passport number
                  and name.
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
                    Contribute();
                  }}
                >
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contributors;
