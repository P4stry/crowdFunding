import React, { useState, useEffect, useContext } from "react";
import { AppState } from "../App";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import txDetails from "../txDetails.json";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const Logging = () => {
  const [txAddr, setTxAddr] = useState("");
  const [Tx, setTx] = useState("");
  const [open, setOpen] = React.useState(false);

  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rows = [];
  for (let tx in txDetails) {
    rows.push(txDetails[tx]);
  }

  const handleClickOpen = () => {
    for (let tx in txDetails) {
      if (txDetails[tx]["txHash"] == txAddr) {
        setTx(txDetails[tx]);
        setOpen(true);
        return;
      }
    }
    alert("Please input valid transaction address!");
    setTx("");
  };
  const handleClose = () => {
    setOpen(false);
  };

  const tableStyle = {
    maxWidth: "150px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };
  const textStyle = {
    fontSize: "14.5px",
    wordWrap: "break-word",
  };

  return (
    <div>
      <div class="ml-6">
        <p class="sm:text-3l text-2xl font-medium title-font mb-5 mt-5 ml-10 text-gray-900">
          Search for transaction:
        </p>
        <div class="flex lg:w-2/3 w-full sm:flex-row flex-col justify-start px-8 sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-end ml-10">
          <div class="relative flex-grow w-full ">
            <input
              value={txAddr}
              onChange={(e) => setTxAddr(e.target.value)}
              type="text"
              id="full-name"
              name="full-name"
              placeholder="Please input transaction address"
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
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{}} id="draggable-dialog-title">
          Transaction Details:
        </DialogTitle>
        {Tx && Tx != undefined && (
          <DialogContent>
            <DialogContentText style={textStyle}>
              Transaction Hash: {Tx["txHash"]}
            </DialogContentText>
            <DialogContentText>Method: {Tx["method"]}</DialogContentText>
            <DialogContentText>Block: {Tx["blockNum"]}</DialogContentText>
            <DialogContentText>Date Time (UTC): {Tx["time"]}</DialogContentText>
            <DialogContentText>From: {Tx["from"]}</DialogContentText>
            <DialogContentText>To: {Tx["to"]}</DialogContentText>
            <DialogContentText>Value: {Tx["value"]}</DialogContentText>
            <DialogContentText>Txn Fee: {Tx["txFee"]}</DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>

      <div style={{ display: "flex", justifyContent: "center" }} class="mt-10">
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 2,
            borderRadius: 4,
            overflow: "hidden",
            maxWidth: 1400,
          }}
        >
          <Table
            sx={{
              minWidth: 650,
              borderCollapse: "separate",
              borderSpacing: 0,
            }}
            aria-label="simple table"
            component={Paper}
          >
            <TableHead>
              <Typography
                sx={{
                  flex: "1 1 100%",
                  fontSize: "16px",
                  p: 2,
                }}
                variant="h5"
                id="tableTitle"
                component="div"
              >
                A total of 19 transactions found
              </Typography>
              <TableRow>
                <TableCell
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Transaction Hash
                </TableCell>
                <TableCell
                  align="left"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Method
                </TableCell>
                <TableCell
                  align="left"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Block
                </TableCell>
                <TableCell
                  align="left"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Date Time (UTC)
                </TableCell>
                <TableCell
                  align="left"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  From
                </TableCell>
                <TableCell
                  align="left"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  To
                </TableCell>
                <TableCell
                  align="left"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Value
                </TableCell>
                <TableCell
                  align="left"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Txn Fee
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : rows
              ).map((row) => (
                <TableRow
                  key={row.txHash}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" style={tableStyle}>
                    <BootstrapTooltip title={row.txHash} placement="top-start">
                      {row.txHash}
                    </BootstrapTooltip>
                  </TableCell>
                  <TableCell align="left">{row.method}</TableCell>
                  <TableCell align="left">{row.blockNum}</TableCell>
                  <TableCell align="left">{row.time}</TableCell>
                  <TableCell align="left" style={tableStyle} title={row.from}>
                    <BootstrapTooltip title={row.from} placement="left">
                      {row.from}
                    </BootstrapTooltip>
                  </TableCell>
                  <TableCell align="left" style={tableStyle} title={row.to}>
                    <BootstrapTooltip title={row.to} placement="left">
                      {row.to}
                    </BootstrapTooltip>
                  </TableCell>
                  <TableCell align="left">{row.value}</TableCell>
                  <TableCell align="left">{row.txFee}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </div>
    </div>
  );
};

export default Logging;
