import React,{useState,useEffect,useContext} from 'react'
import { AppState } from '../App';
import { ethers } from 'ethers';
const Request = () => {
    const App = useContext(AppState);
    const [Data, setData] = useState([]);
    const [num, setnum] = useState(0);
    const Refund = async (proposalID) => {
        try {
            const tx = await App.Charitycontract.voteRequest(proposalID);
            await tx.wait();
            alert("Refund Sucessfully!")
        } catch (error) {
            if (error.message === "The campaign is completed successfully and donation could not be withdrawn") {
                alert(error.message)
            }
            else if (error.message === "You have not donated to this campaign") {
                console.log(error.message)
                alert(error.message)
            } else {
                console.log(error.message)
                alert("Something went wrong")
            }
        }
    };
    const Donate = async (proposalID) => {
        try {
            const tx = await App.Charitycontract.donateProposal(proposalID);
            await tx.wait();
            alert("Donated Sucessfully!")
        } catch (error) {
            if (error.message == "You do not have balance for new donation, please wait for the current active crowfunding to finish") {
                console.log(error.message)
                alert(error.message)
            }
            else if (error.message === "You do not have balance for donation") {
                console.log(error.message)
                alert(error.message)
            }
        }
    };
    useEffect(() => {
        const getProposals = async () => {
            try {
                const Count = await App.Charitycontract.getNumProposals()
                let proposals = [];
                for (let i = 0; i < Count; i++) {
                    const Proposal = await App.Charitycontract.requests(i)
                    if (Proposal.completed === false) {
                        proposals.push(Proposal);
                    }
                }
                setData(proposals);
                console.log(proposals)
            } catch (error) {
                console.log(error);
            }
        };
        getProposals();
    }, [num]);

    return (
        <div>
            <div class="container px-5 py-5 mx-auto">
                <div class="grid sm:grid-cols-1 lg:grid-cols-3 gap-4">
                    {Data && Data?.length !== 0 ?
                        Data.map((e, id) => {
                            return (
                                <div class="p-4">
                                    <div class="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                                        <h2 class="tracking-widest -ml-5 text-15px title-font font-medium text-gray-900 mb-1">Recipient Address</h2>
                                        <h2 class="tracking-widest -ml-5 text-base title-font font-medium text-gray-900 mb-1">{e.recipient}</h2>
                                        <h1 class="title-font sm:text-xl text-lg font-medium text-gray-900 mb-3"></h1>
                                        <p class="leading-relaxed mt-5 mb-5">{e.description}</p>
                                        <div class="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
                                            <span class="text-black  font-bold mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                                                Start time
                                            </span>
                                            <span class="text-black font-bold  inline-flex items-center leading-none text-sm">
                                                {e.startTime.toString()}
                                            </span>
                                            <span class="text-black  font-bold mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                                                Current funds
                                            </span>
                                            <span class="text-black font-bold  inline-flex items-center leading-none text-sm">
                                                {Number(e.currentAmount.toString()) / 10 ** 18} ETH {}
                                            </span>
                                            <span class="text-black  font-bold mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                                                Current funds
                                            </span>
                                            <span class="text-black font-bold  inline-flex items-center leading-none text-sm">
                                                {Number(e.currentAmount.toString()) / 10 ** 18} ETH {}
                                            </span>
                                            <span class="text-black ml-10 font-bold mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                                                Funds Need
                                            </span>
                                            <span class="text-black font-bold  inline-flex items-center leading-none text-sm">
                                                {Number(e.targetAmount.toString()) / 10 ** 18} ETH {}
                                            </span>
                                            <span class="text-black  font-bold mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                                                State
                                            </span>
                                            <span class="text-black font-bold  inline-flex items-center leading-none text-sm">
                                                {e.state.toString()}
                                            </span>
                                            <span class="text-black  font-bold mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                                                Number of donors
                                            </span>
                                            <span class="text-black font-bold  inline-flex items-center leading-none text-sm">
                                                {e.numDonors.toString()}
                                            </span>
                                            
                                        </div>
                                        
                                        <div className='flex justify-center absolute bottom-10 left-0 w-full py-4'>
                                            <button onClick={() => Refund(Number(e.uniqueid.toString()))} class="flex mx-auto mt-10 text-white bg-yellow-400 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded">Refund</button>
                                            <button onClick={() => Donate(Number(e.uniqueid.toString()))} class="flex mx-auto mt-10 text-white bg-yellow-400 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded">Donate</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        : (
                            <div class="flex  items-center justify-center h-1/2">
                                <div class="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">No Proposals found.</div>
                            </div>

                        )}
                </div>
            </div>


        </div>
  )
}

export default Request
//Hello