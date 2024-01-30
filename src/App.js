import { useState, createContext, useEffect } from 'react';
import CharityDAO from "./ABI/Charity.json"
import { ethers } from "ethers";
import Header from './Component/Header';
const AppState = createContext();

function App() {
  const [Charitycontract, setCharitycontract] = useState();
  useEffect(() => {
    const loadEthereum = async () => {
      if (typeof window.ethereum !== 'undefined') { 
        const ContractAddress = "0xBb6E92CD522Ee7b18fD4a14396F3df513945dA5b" //current addr: "0x2D87AEef4C8224aDDc8a121ad9517F4ed3c4897C"
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const CharityContract = new ethers.Contract(ContractAddress, CharityDAO.output.abi, signer);
        setCharitycontract(CharityContract)
      } else {
        console.log('No Ethereum provider found. Install Metamask.');
      }
    };
    loadEthereum();
  }, []);


  return (
    <AppState.Provider value={{
      Charitycontract
    }}>
      <div>
        {typeof window.ethereum != "undefined" ?
          <Header /> :
          <div className='flex flex-col justify-center items-center mt-10'>
            {/* install Metamask */}
            <h1 class=" text-xl title-font  text-black mb-1">Install Metamask to access DAO</h1>
            <a target={"_blank"} href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn">
              <div className='flex border-opacity-60 bg-opacity-90 text-lg font-medium border-2 border-black cursor-pointer bg-black text-white mt-4 rounded-lg justify-center items-center py-1 px-2'>
                Install Metamask
                <img className='h-10' src='metamask.png' />
              </div>
            </a>
            <p className='text-white text-lg mt-2'>Login Required Metamask Extension</p>
          </div>
        }
      </div>
    </AppState.Provider>
  );
}

export default App;
export { AppState }
