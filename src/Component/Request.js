import React,{useState,useEffect,useContext} from 'react'
import { AppState } from '../App';
import { ethers } from 'ethers';
const Request = () => {
    const App = useContext(AppState);
    const [Data, setData] = useState([]);
    const [num, setnum] = useState(0);
    const Vote = async (nums) => {
        try {
            console.log(nums)
            const tx = await App.Charitycontract.voteRequest(nums);
            await tx.wait();
            alert("Voted Sucessfull!")
            setnum(num + 1);
        } catch (error) {
            if (error.message === 'YOu must be contributor') {
                alert("All ready voted")
            }
            else {
                console.log(error.message)
                alert("Something went wrong")
            }
        }
    };
    const Donate = async (id) => {
        try {
            console.log(id)
            const tx = await App.Charitycontract.makePayment(id);
            await tx.wait();
            alert("Donated Sucessfull!")
            setnum(num + 1);
        } catch (error) {
            if (error.message == "execution reverted: You already Voted") {
                alert("All ready voted")
            }
            else {
                console.log(error.message)
                alert("Something went wrong")
            }
        }
    };
    useEffect(() => {
        const getProposals = async () => {
            try {
                const Count = await App.Charitycontract.numRequests()
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
                                                Votes
                                            </span>
                                            <span class="text-black font-bold  inline-flex items-center leading-none text-sm">
                                                {e.noOfVoters.toString()}
                                            </span>
                                            <span class="text-black ml-10 font-bold mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                                                Funds Need
                                            </span>
                                            <span class="text-black font-bold  inline-flex items-center leading-none text-sm">
                                                {Number(e.target.toString()) / 10 ** 18} ETH {}
                                            </span> 
                                            
                                        </div>
                                        
                                        <div className='flex justify-center absolute bottom-10 left-0 w-full py-4'>
                                            <button onClick={() => Vote(Number(e.uniqueid.toString()))} class="flex mx-auto mt-10 text-white bg-yellow-400 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded">Vote</button>
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