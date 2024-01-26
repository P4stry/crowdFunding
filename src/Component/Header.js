import React, { useState, useContext, useEffect } from 'react'
import { AppState } from '../App'
import Manager from './Manager'
import Contributors from './Contributors'
import Request from './Request'
const Header = () => {
    const App = useContext(AppState)
    const [Address, setAddress] = useState(null);
    const [route, setRoute] = useState('Contributors');
    const [chainId, setChainId] = useState();
    const { ethereum } = window;
    useEffect(() => {
        const handleAccountsChanged = (accounts) => {
            setAddress(accounts[0]);
        };
        const handleChainChanged = (chainId) => {
            if (chainId === "0xaa36a7") {
                setChainId(chainId);
                alert("Connected")
            } else if (chainId === "0x5") {
                setChainId(chainId);
                alert("Connected")
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
            await ethereum.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] })
            const accounts = await ethereum.request({ method: "eth_requestAccounts" })
            setAddress(accounts[0])
            const chainId = await ethereum.request({ method: "eth_chainId" })
            if (chainId === "0xaa36a7") {
                setChainId('0xaa36a7')
                alert("Connected")
            } else if (chainId === "0x5") {
                setChainId('0x5')
                alert("Connected")
            }
            else {
                alert("Connect With Sepolia or Goerli Testnet")
            }
        } catch (error) {
            alert(`"${error.message}"`)
        }

    }
    return (
        <header class="text-gray-600 body-font ">
            <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    <span class="ml-3 font-mono font-bold text-3xl">Charity</span>
                </a>
                <div class="md:ml-auto flex flex-wrap items-center cursor-pointer text-base justify-center">
                    <m onClick={() => setRoute('Contributors')} class="mr-5 mt-1 hover:text-gray-900">Contributors</m>
                    <m onClick={() => setRoute('Request')} class="mr-5 mt-1 hover:text-gray-900">Requests</m>
                    <m onClick={() => setRoute('Manager')} class="mr-5 mt-1 hover:text-gray-900">Manager</m>
                    {Address === null ? (
                        <div onClick={LoginWallet} className='flex border-opacity-60 bg-opacity-90 text-lg font-medium border-2 border-white-800 cursor-pointer bg-black hover:bg-gray-800 text-white mt-1 rounded-2xl justify-center items-center py-1 px-2'>
                            Connect
                            <img className='h-10' src='metamask.png' alt='metamask' />
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
                if (route === 'Contributors') {
                    return <Contributors />
                } else if (route === 'Manager') {
                    return <Manager />
                }else if (route === 'Request') {
                    return <Request />
                }
            })()}
        </header>
    )
}

export default Header