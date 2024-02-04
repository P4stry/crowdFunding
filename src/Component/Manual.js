import React, { useState, useContext, useEffect, createContext } from "react";
const Manual = () => {
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
            <h2 style={headerStyle}>Platform Manual</h2>
            <div>
                <p class="sm:text-3l text-2xl font-bold title-font mb-5 mt-5 ml-10 text-gray-900">
                    For Donation
                </p>
            </div>
            <div>
                <p class="sm:text-3l text-2xl font-medium title-font mb-5 mt-5 ml-10 text-gray-900">
                    How to donate to Campaigns:
                </p>
                <p style={textStyle}>1. Donors are required to connect their <a style={{ textDecoration: 'underline' }} href ="https://metamask.io/faqs/">MetaMask</a> wallets to the platform first: Through the “Connect” button on the top right side</p>
                <p style={textStyle}>2. After connecting, donors could donate Ether to the platform through the Contributor page. Please make sure the donation is larger than the required minimum donation amount</p>
                <p style={textStyle}>3. After donating to the platform, donors could donate all the unused balance to any Campaign through the Campaign page</p>
                <p style={textStyle}>4. Clicking the donate button on each Campaign card, and confirming the transaction, all the unused balance will be donated to the selected Campaign</p>
                <p style={textStyle}>⚠️Notice⚠️ In order to obey the KYC and AML policies, we need to verify the identificaiton of donors</p>
            </div>
            <div>
                <p class="sm:text-3l text-2xl font-medium title-font mb-5 mt-5 ml-10 text-gray-900">
                    How to withdraw balance from Campaigns:
                </p>
                <p style={textStyle}>After donating to any Campaign, donors could withdraw donated balance from it</p>
                <p style={textStyle}>1. Donors needs to go to the Home page. Then under "My Participation", donors could see all Campaigns they have donated to</p>
                <p style={textStyle}>2. Donors could choose anyone participated campaign, click the "withdraw" button and confirm the transaction to get back the donated balance</p>
                <p style={textStyle}>⚠️Notice⚠️ Donors could only withdraw balance from active or expired Campaigns, and could not withdraw from completed Campaigns</p>
            </div>
            <div>
                <p class="sm:text-3l text-2xl font-medium title-font mb-5 mt-5 ml-10 text-gray-900">
                    How to withdraw balance from the platform:
                </p>
                <p style={textStyle}>After donating to the platform, donors could withdraw unused balance from it anytime</p>
                <p style={textStyle}>1. Donors needs to go to the Home page</p>
                <p style={textStyle}>2. Clicking the "Withdraw" button after "Withdraw money from the platform:" and confirming the transaction</p>
                <p style={textStyle}>⚠️Notice⚠️ Donors are only able to withdraw unused balance</p>
            </div>
            <div>
                <p class="sm:text-3l text-2xl font-bold title-font mb-5 mt-5 ml-10 text-gray-900">
                    For Campaign Creation
                </p>
            </div>
            <div>
                <p class="sm:text-3l text-2xl font-medium title-font mb-5 mt-5 ml-10 text-gray-900">
                    How to create a new Campaign:
                </p>
                <p style={textStyle}>Proposer could create new Campaign through the Initiate page</p>
                <p style={textStyle}>1. Proposers need to fill in the recipient address field with the address of the recipient</p>
                <p style={textStyle}>2. Proposers need to fill in the target amount field with the amount of Ether their Campaigns require in the unit of Ether</p>
                <p style={textStyle}>3. Proposers need to describe their Campaigns in the description field to attract donors to donate</p>
                <p style={textStyle}>⚠️Notice⚠️ In order to obey the KYC and AML policies, we need to verify the identificaiton of proposers</p>
            </div>
            <div>
                <p class="sm:text-3l text-2xl font-medium title-font mb-5 mt-5 ml-10 text-gray-900">
                    How to cancel a proposed Campaign:
                </p>
                <p style={textStyle}>Proposers could cancel the Campaign through the Home page</p>
                <p style={textStyle}>1. Proposers need to go to the Home page. Then under "My Initiatives", proposers could see all Campaigns they have initiated</p>
                <p style={textStyle}>2. Proposers could choose anyone initiated Campaign, click the "cancel" button and confirm the transaction to cancel the Campaign</p>
                <p style={textStyle}>⚠️Notice⚠️ Proposers can only cancel the Campaign they initated</p>
                <p style={textStyle}>⚠️Notice⚠️ Proposers can only cancel the active Campaign</p>
            </div>
            <div>
                <p class="sm:text-3l text-2xl font-medium title-font mb-5 mt-5 ml-10 text-gray-900">
                    How to finish a proposed Campaign:
                </p>
                <p style={textStyle}>Proposers could finish the Campaign through the Home page</p>
                <p style={textStyle}>1. Proposers need to go to the Home page. Then under "My Initiatives", proposers could see all Campaigns they have initiated</p>
                <p style={textStyle}>2. Proposers could choose anyone initiated Campaign, click the "finish" button and confirm the transaction to cancel the Campaign</p>
                <p style={textStyle}>3. After finishing the Campaign, cumulative funds will be transferred to the recipient address automatically</p>
                <p style={textStyle}>⚠️Notice⚠️ Proposers can only finish the Campaign they initated</p>
                <p style={textStyle}>⚠️Notice⚠️ Proposers can only finish the active Campaign</p>
            </div>
            <div>
                <p class="sm:text-3l text-2xl font-bold title-font mb-5 mt-5 ml-10 text-gray-900">
                    For Transaciton Query
                </p>
            </div>
            <div>
                <p class="sm:text-3l text-2xl font-medium title-font mb-5 mt-5 ml-10 text-gray-900">
                    How to query the transaction history:
                </p>
                <p style={textStyle}>The public could query all transacitons involved with the platform</p>
                <p style={textStyle}>1. You need to go to the Log page</p>
                <p style={textStyle}>2. Filling the enquiry field with the transaction hash and clicking the "Show Details" button</p>
                <p style={textStyle}>3. You could see the detail of the transaciton in the pop-up window</p>
                <p style={textStyle}>⚠️Notice⚠️ Only the transaciton involved with the platform can be queried</p>
            </div>
            <div>
                <p class="sm:text-3l text-2xl font-bold title-font mb-5 mt-5 ml-10 text-gray-900">
                    For Platform Management
                </p>
            </div>
            <div>
                <p class="sm:text-3l text-2xl font-medium title-font mb-5 mt-5 ml-10 text-gray-900">
                    How to know current parameters of the platform:
                </p>
                <p style={textStyle}>The public could know current parameters through the Management page</p>
                <p style={textStyle}>Under the "Basic Info", you can see all core parameters of the platform</p>
            </div>
            <div>
                <p class="sm:text-3l text-2xl font-medium title-font mb-5 mt-5 ml-10 text-gray-900">
                    How to propose new governance decisions:
                </p>
                <p style={textStyle}>Donors could propose new governance decisions through the Management page</p>
                <p style={textStyle}>1. Under the "Create Decision", donors could choose the parameter they want to update</p>
                <p style={textStyle}>2. Donors need to fill in the value field with the updated value</p>
                <p style={textStyle}>3. Clicking the "Create Decision" button and confirming the transaction to propose the udpate</p>
                <p style={textStyle}>⚠️Notice⚠️ Only donors who have balance in the platform or Campaigns could propose new governance decisions</p>
            </div>
            <div>
                <p class="sm:text-3l text-2xl font-medium title-font mb-5 mt-5 ml-10 text-gray-900">
                    How to vote to governance decisions:
                </p>
                <p style={textStyle}>Donors could vote to governance decisions through the Management page</p>
                <p style={textStyle}>1. Under the "Current Decision", donors could see all the proposed governance decisions</p>
                <p style={textStyle}>2. Clicking the "Vote" button and confirming the transaction to vote to the update</p>
                <p style={textStyle}>⚠️Notice⚠️ Only donors who have balance in the platform or Campaigns could vote to governance decisions</p>
                <p style={textStyle}>⚠️Notice⚠️ Donors can only vote to active governance decisions</p>
            </div>
            <div>
                <p class="sm:text-3l text-2xl font-medium title-font mb-5 mt-5 ml-10 text-gray-900">
                    How to execute governance decisions:
                </p>
                <p style={textStyle}>Donors could execute governance decisions through the Management page</p>
                <p style={textStyle}>1. Under the "Current Decision", donors could see all the proposed governance decisions</p>
                <p style={textStyle}>2. Clicking the "Execute" button and confirming the transaction to execute the update</p>
                <p style={textStyle}>⚠️Notice⚠️ Only donors who have balance in the platform or Campaigns could execute governance decisions</p>
                <p style={textStyle}>⚠️Notice⚠️ Donors can only execute the active governance decision</p>
                <p style={textStyle}>⚠️Notice⚠️ Donors can only execute the governance decision which has more than 50% vote volumn</p>
            </div>
        </div>
    );
};

export default Manual;
