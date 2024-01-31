import React, { useState, useContext, useEffect } from 'react';
import { AppState } from '../App';
import { ethers } from 'ethers';

const Governance = () => {
    const App = useContext(AppState);
    const [newMinimumContribution, setNewMinimumContribution] = useState('');
    const [newFrozenElapse, setNewFrozenElapse] = useState('');
    const [newCampaignLength, setNewCampaignLength] = useState('');
    const [newOwner, setNewOwner] = useState('');

    const [contractBalance, setContractBalance] = useState('');
    const [numProposals, setNumProposals] = useState('0');
    const [isPaused, setIsPaused] = useState(false);
    const [minimumContribution, setMinimumContribution] = useState('');
    const [frozenElapse, setFrozenElapse] = useState('');
    const [campaignLength, setCampaignLength] = useState('');
    const [owner, setOwner] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [currentUserAddress, setCurrentUserAddress] = useState('');

    useEffect (() => {

        const checkOwner = async () => {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                const userAddress = ethers.utils.getAddress(accounts[0]);
                setCurrentUserAddress(userAddress);

                const contractOwner = await App.Charitycontract.getOwner();
                setIsOwner(userAddress.toLowerCase() === contractOwner.toLowerCase());
            } catch (error) {
                console.error("Error checking contract ownership:", error);
                setIsOwner(false);
            }

        };

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

        if (App.Charitycontract) {
            checkOwner();
            fetchContractData();
        }

    },[App.Charitycontract])

    if (!isOwner) {
        return <div style={{ marginLeft: '150px', fontSize: '23px',color: 'black' }}>You are not the owner of this contract.</div>;
    }

    const pauseContract = async () => { 
        try {
            const tx = await App.Charitycontract.pause();
            await tx.wait();
            alert("Contract Paused");
        } catch (error) {
            console.error("Failed to pause contract:", error);
            alert("Error pausing contract");
        }
    };

    const unpauseContract = async () => { 
        try {
            const tx = await App.Charitycontract.unpause();
            await tx.wait();
            alert("Contract Unpaused");
        } catch (error) {
            console.error("Failed to unpause contract:", error);
            alert("Error unpausing contract");
        }
    };

    const updateMinimumContribution = async () => { 
         try {

            const tx = await App.Charitycontract.updateMinimumContribution(ethers.utils.parseEther(newMinimumContribution));
            await tx.wait();
            alert("Minimum Contribution Updated");
         } catch (error) {
            console.error("Failed to update minimum contribution:", error);
            alert("Error updating minimum contribution");
         }
    };

    const updateFrozenElapse = async () => { 
        try {
            const tx = await App.Charitycontract.updateFrozenElapse(newFrozenElapse);
            await tx.wait();
            alert("Frozen Elapse Updated");
        } catch (error) {
            console.error("Failed to update frozen elapse:", error);
            alert("Error updating frozen elapse");
        }
    };

    const updateCampaignLength = async () => { 
        try {
            const tx = await App.Charitycontract.updateCampaignLength(newCampaignLength);
            await tx.wait();
            alert("Campaign Length Updated");
        } catch (error) {
            console.error("Failed to update campaign length:", error);
            alert("Error updating campaign length");
        }
    };

    const transferOwnership = async () => { 
        try {
            const tx = await App.Charitycontract.updateOwner(newOwner);
            await tx.wait();
            alert("Ownership Transferred");
        } catch (error) {
            console.error("Failed to transfer ownership:", error);
            alert("Error transferring ownership");
        }
    };
    
    const clearInput = (setter) => () => setter('');

    const headerStyle = {
        fontSize: '36px',
        color: '#333',
        textAlign: 'center',
        marginBottom: '20px'
    };
    
    const textStyle = {
        fontSize: '16px',
        color: '#555',
        marginBottom: '10px'
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
    
    const inputStyle = {
        padding: '10px',
        margin: '5px',
        borderRadius: '5px',
        border: '1px solid #ccc'
    };
    
    const inputGroupStyle = {
        marginBottom: '20px'
    };
    
    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
            <h2 style={headerStyle}>Contract Governance</h2>
            <p style={textStyle}>Contract Balance: {contractBalance} ETH</p>
            <p style={textStyle}>Minimum Contribution: {minimumContribution} ETH</p>
            <p style={textStyle}>Frozen Elapse: {frozenElapse} seconds</p>
            <p style={textStyle}>Campaign Length: {campaignLength} days</p>
            <p style={textStyle}>Number of Proposals: {numProposals}</p>
            <p style={textStyle}>Is Paused: {isPaused ? 'Yes' : 'No'}</p>
            <p style={textStyle}>Owner: {owner}</p>
            <div style={{ marginBottom: '15px' }}>
                <button onClick={pauseContract} style={buttonStyle}>Pause Contract</button>
                <button onClick={unpauseContract} style={buttonStyle}>Unpause Contract</button>
            </div>
            <div style={inputGroupStyle}>
                <input 
                    value={newMinimumContribution} 
                    onChange={(e) => setNewMinimumContribution(e.target.value)}
                    onFocus={clearInput(setNewMinimumContribution)} 
                    placeholder="New Min Contribution"
                    style={inputStyle}
                />
                <button onClick={updateMinimumContribution} style={buttonStyle}>Update Min Contribution</button>
            </div>
            <div style={inputGroupStyle}>
                <input 
                    value={newFrozenElapse} 
                    onChange={(e) => setNewFrozenElapse(e.target.value)} 
                    onFocus={clearInput(setNewFrozenElapse)}
                    placeholder="New Frozen Elapse"
                    style={inputStyle}
                />
                <button onClick={updateFrozenElapse} style={buttonStyle}>Update Frozen Elapse</button>
            </div>
            <div style={inputGroupStyle}>
                <input 
                    value={newCampaignLength} 
                    onChange={(e) => setNewCampaignLength(e.target.value)} 
                    onFocus={clearInput(setNewCampaignLength)}
                    placeholder="New Campaign Length"
                    style={inputStyle}
                />
                <button onClick={updateCampaignLength} style={buttonStyle}>Update Campaign Length</button>
            </div>
            <div style={inputGroupStyle}>
                <input 
                    value={newOwner} 
                    onChange={(e) => setNewOwner(e.target.value)} 
                    onFocus={clearInput(setNewOwner)}
                    placeholder="New Owner Address"
                    style={inputStyle}
                />
                <button onClick={transferOwnership} style={buttonStyle}>Transfer Ownership</button>
            </div>
        </div>

    );
};

export default Governance;
