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
                setNewMinimumContribution(ethers.utils.formatEther(minContribution));
                setNewFrozenElapse(frozen.toString());
                setNewCampaignLength(campaignLen.toString());
                setNumProposals(proposals.toString());
                setIsPaused(paused);
                setNewOwner(contractOwner);

            } catch (error) {
                console.error("Error fetching contract data:", error);
            }
        };

        if (App.Charitycontract) {
            fetchContractData();
        }

    },[App.Charitycontract])

    const pauseContract = async () => {
        const tx = await App.Charitycontract.pause();
        await tx.wait();
        alert("Contract Paused");
    };

    const unpauseContract = async () => {
        const tx = await App.Charitycontract.unpause();
        await tx.wait();
        alert("Contract Unpaused");
    };

    const updateMinimumContribution = async () => {
        const tx = await App.Charitycontract.updateMinimumContribution(ethers.utils.parseEther(newMinimumContribution));
        await tx.wait();
        alert("Minimum Contribution Updated");
    };

    const updateFrozenElapse = async () => {
        const tx = await App.Charitycontract.updateFrozenElapse(newFrozenElapse);
        await tx.wait();
        alert("Frozen Elapse Updated");
    };

    const updateCampaignLength = async () => {
        const tx = await App.Charitycontract.updateCampaignLength(newCampaignLength);
        await tx.wait();
        alert("Campaign Length Updated");
    };

    const transferOwnership = async () => {
        const tx = await App.Charitycontract.updateOwner(newOwner);
        await tx.wait();
        alert("Ownership Transferred");
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
            <h2 style={{ fontSize: '36px' }}>Contract Governance</h2>
            <p>Contract Balance: {contractBalance} ETH</p>
            <p>Minimum Contribution: {newMinimumContribution} ETH</p>
            <p>Frozen Elapse: {newFrozenElapse} seconds</p>
            <p>Campaign Length: {newCampaignLength} days</p>
            <p>Number of Proposals: {numProposals}</p>
            <p>Is Paused: {isPaused ? 'Yes' : 'No'}</p>
            <p>Owner: {newOwner}</p>
            <div style={{ marginBottom: '15px' }}>
                <button onClick={pauseContract} style={buttonStyle}>Pause Contract</button>
                <button onClick={unpauseContract} style={buttonStyle}>Unpause Contract</button>
            </div>
            <div style={inputGroupStyle}>
                <input 
                    value={newMinimumContribution} 
                    onChange={(e) => setNewMinimumContribution(e.target.value)} 
                    placeholder="New Min Contribution"
                    style={inputStyle}
                />
                <button onClick={updateMinimumContribution} style={buttonStyle}>Update Min Contribution</button>
            </div>
            <div style={inputGroupStyle}>
                <input 
                    value={newFrozenElapse} 
                    onChange={(e) => setNewFrozenElapse(e.target.value)} 
                    placeholder="New Frozen Elapse"
                    style={inputStyle}
                />
                <button onClick={updateFrozenElapse} style={buttonStyle}>Update Frozen Elapse</button>
            </div>
            <div style={inputGroupStyle}>
                <input 
                    value={newCampaignLength} 
                    onChange={(e) => setNewCampaignLength(e.target.value)} 
                    placeholder="New Campaign Length"
                    style={inputStyle}
                />
                <button onClick={updateCampaignLength} style={buttonStyle}>Update Campaign Length</button>
            </div>
            <div style={inputGroupStyle}>
                <input 
                    value={newOwner} 
                    onChange={(e) => setNewOwner(e.target.value)} 
                    placeholder="New Owner Address"
                    style={inputStyle}
                />
                <button onClick={transferOwnership} style={buttonStyle}>Transfer Ownership</button>
            </div>
        </div>

    );
};

export default Governance;
