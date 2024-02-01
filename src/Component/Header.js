import React, { useState, useContext, useEffect, createContext } from "react";
import { AppState } from "../App";
import Create from "./Create";
import Contributors from "./Contributors";
import Campaign from "./Campaign";
import Home from "./Home";
import Governance from "./Governance";

const HeaderState = createContext();
const Header = () => {
  const App = useContext(AppState);
  const [Address, setAddress] = useState(null);
  const [route, setRoute] = useState("Contributors");
  const [chainId, setChainId] = useState();
  const { ethereum } = window;
  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      setAddress(accounts[0]);
    };
    const handleChainChanged = (chainId) => {
      if (chainId === "0xaa36a7") {
        //Sepolia test network
        setChainId(chainId);
        alert("Connected");
      } else if (chainId === "0x5") {
        // Goerli Test network
        setChainId(chainId);
        alert("Connected");
      } else {
        alert("Connect With Sepolia or Goerli Testnet");
      }
    };
    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  const LoginWallet = async () => {
    try {
      await ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(accounts[0]);
      const chainId = await ethereum.request({ method: "eth_chainId" });
      if (chainId === "0xaa36a7") {
        setChainId("0xaa36a7");
        alert("Connected");
      } else if (chainId === "0x5") {
        setChainId("0x5");
        alert("Connected");
      } else {
        alert("Connect With Sepolia or Goerli Testnet");
      }
    } catch (error) {
      alert(`"${error.message}"`);
    }
  };
  return (
    <HeaderState.Provider
      value={{
        Address,
      }}
    >
      <header class="text-gray-600 body-font ">
        <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <span class="ml-3 font-mono font-bold text-3xl">Charity</span>
          </a>
          <div class="md:ml-auto flex flex-wrap items-center cursor-pointer text-base justify-center">
            <m
              onClick={() => setRoute("Contributors")}
              class="mr-5 mt-1 font-bold hover:text-gray-900"
            >
              Contributor
            </m>
            <m
              onClick={() => setRoute("Campaign")}
              class="mr-5 mt-1 font-bold hover:text-gray-900"
            >
              Campaign
            </m>
            <m
              onClick={() => setRoute("Create")}
              class="mr-5 mt-1 font-bold hover:text-gray-900"
            >
              Initiate
            </m>
            <m
              onClick={() => setRoute("Home")}
              class="mr-5 mt-1 font-bold hover:text-gray-900"
            >
              Home
            </m>
            <m
              onClick={() => setRoute("Governance")}
              class="mr-5 mt-1 font-bold hover:text-gray-900"
            >
              Management
            </m>
            {Address === null ? (
              <div
                onClick={LoginWallet}
                className="flex border-opacity-60 bg-opacity-90 text-lg font-medium border-2 border-white-800 cursor-pointer bg-black hover:bg-gray-800 text-white mt-1 rounded-2xl justify-center items-center py-1 px-2"
              >
                Connect
                <img className="h-10" src="metamask.png" alt="metamask" />
              </div>
            ) : (
              <div className="text-xl mt-1 mr-2 font-sans border-opacity-60 border-2 border-indigo font-bold cursor-pointer bg-black hover:bg-gray-800 bg-opacity-90 px-4 py-2 text-white  rounded-xl flex justify-between items-center">
                {Address.slice(0, 5)}...{Address.slice(38)}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className="ml-2 bi bi-wallet2"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
                </svg>
              </div>
            )}
          </div>
        </div>
        {(() => {
          if (route === "Contributors") {
            return <Contributors />;
          } else if (route === "Create") {
            return <Create />;
          } else if (route === "Campaign") {
            return <Campaign />;
          } else if (route === "Home") {
            return <Home />;
          } else if (route === "Governance") {
            return <Governance />;
          }
        })()}
      </header>
    </HeaderState.Provider>
  );
};

export default Header;
export { HeaderState };
