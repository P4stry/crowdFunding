import React, { useState, useContext, useEffect } from 'react';
import { AppState } from '../App';
import { ethers } from 'ethers';

const Governance = () => {
    const App = useContext(AppState);

    const [contractBalance, setContractBalance] = useState('');
    const [numProposals, setNumProposals] = useState('0');
    const [isPaused, setIsPaused] = useState(false);
    const [minimumContribution, setMinimumContribution] = useState('');
    const [frozenElapse, setFrozenElapse] = useState('');
    const [campaignLength, setCampaignLength] = useState('');
    const [owner, setOwner] = useState('');
    const [Variable, setVariable] = useState();
    const [newvalue, setnewvalue] = useState();
    const [Decision, setDecision] = useState([]);
    const [votePause, setVotePause] = useState({ approve: 0, reject: 0, abstain: 0 });
    const [voteUnpause, setVoteUnpause] = useState({ approve: 0, reject: 0, abstain: 0 });
    const [voteMinContribution, setVoteMinContribution] = useState({ approve: 0, reject: 0, abstain: 0 });

    useEffect (() => {

        const fetchContractData = async () => {
            try {
                const balance = await App.Charitycontract.getContractBalance();
                const minContribution = await App.Charitycontract.getMinimumContribution();
                const frozen = await App.Charitycontract.getFrozenElapse();
                const campaignLen = await App.Charitycontract.getCampaignLength();
                const proposals = await App.Charitycontract.getNumProposals();
                const paused = await App.Charitycontract.getPaused();
                const contractOwner = await App.Charitycontract.getOwner();

                setContractBalance(ethers.utils.formatEther(balance));
                setMinimumContribution(ethers.utils.formatEther(minContribution));
                setFrozenElapse(frozen.toString());
                setCampaignLength(campaignLen.toString());
                setNumProposals(proposals.toString());
                setIsPaused(paused);
                setOwner(contractOwner);

            } catch (error) {
                console.error("Error fetching contract data:", error);
            }
        };

        const getDecisions = async () => {
            try {
              const Count = await App.Charitycontract.getNumDecisions();
              let activeDecision = [];
              for (let i = 0; i < Count; i++) {
                const decisions = await App.Charitycontract.governanceDecisions(i);
                if (decisions.state == 0) {
                    activeDecision.push(decisions);
                } 
              }
              setDecision(activeDecision)
            } catch (error) {
              console.error(error);
            }
          };
          
        if (App.Charitycontract) {
            fetchContractData();
            getDecisions();
        }

    },[App.Charitycontract])

    const createdecision = async () => {
        try{
            const newdecision = await App.Charitycontract.proposeGovernanceDecision(
                Variable,
                Variable === 'MinimumContribution' ? newvalue * 10**18 : newvalue
            );
            await newdecision.wait();
            alert("Created Sucessfull!");
            setVariable("");
            setnewvalue("");
        } catch(error) {
            alert("Please input the valid info");
        }
    }
    const vote = async (id) => {
        try {
            console.log(id);
            const tx = await App.Charitycontract.voteToDecision(id);
            await tx.wait();
            alert("Vote Successfull!");
          } catch(error) {
            if (error.message.includes("user rejected transaction")) {
                alert("User rejected transaction");
              } else if (
                error.error.message ==
                "execution reverted: The decision is not active"
              ) {
                alert("The decision is not active");
              } else if (
                error.error.message ==
                "execution reverted: You have voted to this decision"
              ) {
                alert(
                  "You have voted to this decision"
                );
              }
          }
    };
    function convertTime(sec) {
        let date = new Date(sec * 1000);
        return date.toLocaleString();
      }
    const styles = {
        container: {
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        },
        topHalf: {
          display: 'flex',
          flex: 1,
        },
        leftRightSide: {
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        bottomHalf: {
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }
      };

    const headerStyle = {
        fontSize: '36px',
        color: '#333',
        textAlign: 'center',
        marginBottom: '20px'
    };
    
    const textStyle = {
        fontSize: '16px',
        color: '#555',
        marginBottom: '10px',
        marginLeft: '80px'
    };

    const buttonStyle = {
        cursor: 'pointer',
        backgroundColor: '#EAB308',
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        margin: '5px'
    };
        
    return (
        <div style={styles.container}>
            <h2 style={headerStyle}>Contract Governance</h2>
            <div style={styles.topHalf}>
                <div>
                    <p class="sm:text-3l text-2xl font-medium title-font mb-5 mt-5 ml-10 text-gray-900">
                        Basic Info:
                    </p>
                    <p style={textStyle}>Contract Balance: {contractBalance} ETH</p>
                    <p style={textStyle}>Minimum Contribution: {minimumContribution} ETH</p>
                    <p style={textStyle}>Frozen Elapse: {frozenElapse} seconds</p>
                    <p style={textStyle}>Campaign Length: {campaignLength} days</p>
                    <p style={textStyle}>Number of Proposals: {numProposals}</p>
                    <p style={textStyle}>Is Paused: {isPaused ? 'Yes' : 'No'}</p>
                    <p style={textStyle}>Owner: {owner}</p>
                </div>
                <div>
                    <p class="sm:text-3l text-2xl font-medium title-font mb-5 mt-5 ml-10 text-gray-900">
                        Create Dicision:
                    </p>
                    <div class="flex lg:w-2/3 w-full sm:flex-row flex-col justify-start px-8 sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-end ml-10">
                    <div class="relative flex-grow w-full">
                        <label for="campaign-option" class="leading-7 text-sm text-gray-600">
                            Choose an Option
                        </label>
                        <select
                            value={Variable}
                            onChange={(e) => setVariable(e.target.value)}
                            id="campaign-option"
                            name="campaign-option"
                            style={{ width: "250px", height: "40px"}}
                            class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-yellow-500 focus:bg-transparent focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        >
                            <option value="" disabled>Please select an option</option>
                            <option value="MinimumContribution">Minimum Contribution</option>
                            <option value="FrozenElapse">Frozen Elapse</option>
                            <option value="CampaignLength">Campaign Length</option>
                            <option value="VotingLength">Voting Length</option>
                        </select>
                    </div>
                    <div class="relative flex-grow w-full">
                        <label for="name" class="leading-7 text-sm text-gray-600">
                            value
                        </label>
                        <input
                            value={newvalue}
                            onChange={(e) => setnewvalue(e.target.value)}
                            type="text"
                            style={{ width: "150px", height: "40px"}}
                            class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        />   
                    </div>
                </div>
                    <button
                    variant="outlined"
                    onClick={createdecision}
                    style={{ whiteSpace: "nowrap" }}
                    class="flex mx-auto mt-10 text-white bg-yellow-400 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded"
                    >
                        Create Dicision
                    </button>
                </div>
            </div>

             <div>
                <p class="sm:text-3l text-2xl font-medium title-font mb-5 mt-5 ml-10 text-gray-900">
                    Current Dicision:
                </p>
                <div class="container px-5 py-5 mx-auto">
                    <div class="grid sm:grid-cols-1 lg:grid-cols-3 gap-4">
                    {Decision && Decision.length !== 0 ? (
                        Decision.sort((a, b) => b.startTime - a.startTime).map(
                        (e) => {
                            return (
                            <div class="p-4">
                                <div class="h-full bg-gray-100 bg-opacity-75 px-8 pt-10 pb-24 rounded-lg overflow-hidden text-center relative">
                                <h2 class="tracking-widest text-base title-font font-medium text-gray-900 mb-1 -mt-1">
                                    #{e.uniqueid.toString()}
                                </h2>
                                <h2 class="tracking-widest text-15px title-font font-medium text-gray-900 mb-1">
                                    Type of Dicision:{e.variable}
                                </h2>
                                <h2 style={{ textAlign: "left" , marginLeft: "90px"}}>
                                    0--Minimum Contribution<br></br>
                                    1--Frozen Elapse<br></br>
                                    2--Campaign Length<br></br>
                                    3--Voting Length<br></br>
                                </h2>
                                <p
                                    class="leading-relaxed mt-5 mb-10"
                                    title={e.newValue}
                                >
                                    new value: {e.newValue.toString()}
                                </p>
                                <div className="flex justify-center absolute bottom-14 left-0 w-full py-4">
                                    <button
                                    onClick={() => vote(Number(e.uniqueid.toString()))}
                                    class="flex mx-auto mt-10 text-white bg-yellow-400 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded"
                                    >
                                    Vote
                                    </button>
                                </div>
                                <div class="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
                                    <span class="text-gray-500  font-bold mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                                    Start time
                                    </span>
                                    <span class="text-gray-650 font-bold  inline-flex items-center leading-none text-sm">
                                    {convertTime(e.startTime)}
                                    </span>
                                    <span class="text-gray-500  font-bold ml-5 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                                    Number of voteVolumn
                                    </span>
                                    <span class="text-gray-650 font-bold  inline-flex items-center leading-none text-sm">
                                    {Number(e.voteVolumn.toString())/ 10 ** 18}
                                    </span>
                                </div>
                                </div>
                            </div>
                            );
                        }
                        )
                    ) : (
                        <div class="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3 ml-14">
                        No Dicisions now.
                        </div>
                    )}
                </div>
      </div>
            </div>            
        </div>

    );
};

export default Governance;
