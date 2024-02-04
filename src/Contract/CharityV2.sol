//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract CrowdFunding is Initializable, PausableUpgradeable, OwnableUpgradeable, UUPSUpgradeable{
    enum State {Active, Expired, Completed}
    enum UpgradableVariable {MinimumContribution, FrozenElapse, CampaignLength, VotingLength}
    
    struct Proposal{
        address proposer;
        uint uniqueid;
        uint startTime;
        string description;
        address payable recipient;
        uint targetAmount;
        uint currentAmount;
        State state;
        uint numDonors;
        address[] donors;
        address[] finalDonors;
    }
    struct Donation{
        uint timestamp; // donation time
        uint coldAmount; // amount not in voting
        uint hotAmount; // amount in voting
    }
    struct Decision{
        uint uniqueid;
        UpgradableVariable variable;
        uint newValue;
        uint startTime;
        uint voteVolumn;
        State state;
        mapping(address => bool) voters;
    }

    mapping(address => Donation) public contributors;
    // donor's address => {
    //  last donation time, 
    //  cold amount, 
    //  hot amount
    //  }

    mapping(uint => mapping (address => uint)) public proposalDonationAmount;
    // proposalID => (
    //  donor's address => 
    //      donated amount in this proposal
    //  )

    mapping(uint => Proposal) public proposals;
    // proposalID => {
    //  proposer's address,
    //  unique id,
    //  campaign start time,
    //  campaign description,
    //  recipient's address,
    //  target funding amount,
    //  current funding amount,
    //  campaign state,
    //  number of donors in this campaign (actual number of donors),
    //  array of donors' address (including donors who have withdrawn their donations)
    //  }

    mapping(uint => Decision) public governanceDecisions;
    // decisionID => {
    //  decision id,
    //  decision start time,
    //  total vote volumn,
    //  decision state
    //  }

    uint public minimumContribution; // Minimum contribution to be a donor
    uint public frozenElapse; // Time between donation and voting
    uint public campaignLength; // Time for crowd funding
    uint public numProposals; // Number of proposals in the platform, monotonically increasing, used as unique id
    uint public numDecisions; // Number of governance decisions in the platform, monotonically increasing, used as unique id
    uint public votingLength;

    modifier requireDonation(address user){
        require((contributors[user].coldAmount + contributors[user].hotAmount) > 0, "You must donate to the platform first");
        _;
    }

    receive() external payable {}

    constructor(){
        _disableInitializers();
    }

    function initialize(address initialOwner) initializer public {
        __Pausable_init();
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        minimumContribution = 0.00044 ether; // Should equal to 1 USD
        frozenElapse = 20; // 20 seconds between last donation and voting
        campaignLength = 7; // 7 days for crowd funding
        votingLength = 7; // 7 days for voting
    }
    
    // Get contribution
    function receiveDonation() whenNotPaused public payable{
        require(msg.value >= minimumContribution, "Minimum donation is not met");
        // Update timestamp
        contributors[msg.sender].timestamp = block.timestamp;
        // Update cold amount
        contributors[msg.sender].coldAmount += msg.value;
    }
    
    // Create new proposal
    function createProposal(string memory description,address payable recipient,uint targetAmount) whenNotPaused public {
        Proposal storage newProposal = proposals[numProposals];

        newProposal.proposer = msg.sender;
        newProposal.uniqueid = numProposals;
        newProposal.startTime = block.timestamp;
        newProposal.description = description;
        newProposal.recipient = payable(recipient);
        newProposal.targetAmount = targetAmount;
        newProposal.currentAmount = 0;
        newProposal.state = State.Active;
        newProposal.numDonors = 0;

        numProposals++;
    }
    
    // Allow users to withdraw their donations (cold amount only)
    function withdrawDonationFromPlatform(address payable receiver) whenNotPaused public{
        if (contributors[msg.sender].coldAmount == 0){
            if (contributors[msg.sender].hotAmount > 0){
                revert("The crowfunding is not finished yet");
            }
            else{
                revert("You have no money to withdraw");
            }
        }
        uint withdrawnAmount = contributors[msg.sender].coldAmount;
        contributors[msg.sender].coldAmount = 0;
        payable(receiver).transfer(withdrawnAmount);
    }

    // Donors withdraw donation from campaign except the campaign is completed successfully
    function withdrawDonationFromCampaign(uint proposalID) whenNotPaused public{
        Proposal storage selectedProposal = proposals[proposalID];
        // Update campaign state
        _updateCampaignState(selectedProposal);
        // Check state
        require(selectedProposal.state == State.Active || selectedProposal.state == State.Expired, "The campaign is completed successfully and donation could not be withdrawn");
        // Check if the user has donated
        uint donatedAmount = proposalDonationAmount[proposalID][msg.sender];
        require(donatedAmount > 0, "You have not donated to this campaign");

        // Update cold amount
        contributors[msg.sender].coldAmount += donatedAmount;
        // Update hot amount
        contributors[msg.sender].hotAmount -= donatedAmount;
        // Update current amount
        selectedProposal.currentAmount -= donatedAmount;
        // Update number of donors
        selectedProposal.numDonors -= 1;
        // Update donationAmount
        proposalDonationAmount[proposalID][msg.sender] = 0;
        // Do not need to update donors array (too costly)
    }

    // Donate to proposal
    function donateProposal(uint proposalID) whenNotPaused public{
        Proposal storage selectedProposal = proposals[proposalID];
        // Update campaign state
        _updateCampaignState(selectedProposal);
        // Check campaign state, only active campaign can be donated
        require(selectedProposal.state == State.Active, "The campaign is not active");
        // Check if the user has cold amount
        if (contributors[msg.sender].coldAmount == 0){
            if (contributors[msg.sender].hotAmount > 0){
                revert("You do not have balance for new donation, please wait for the current active crowfunding to finish");
            }
            else{
                revert("You do not have balance for donation");
            }
        }
        // Prevent Flashloan attack: The elapsed time between donation and voting should be longer than predefined time
        require(block.timestamp - contributors[msg.sender].timestamp >= frozenElapse * 1 seconds, "The balance you donated is still in pending");

        uint donatedAmount = contributors[msg.sender].coldAmount;
        // Update cold amount
        contributors[msg.sender].coldAmount = 0;
        // Update hot amount
        contributors[msg.sender].hotAmount += donatedAmount;
        // Update current amount
        selectedProposal.currentAmount += donatedAmount;
        // If new donor
        if (proposalDonationAmount[proposalID][msg.sender] == 0){
            // Update number of donors
            selectedProposal.numDonors += 1;
            // Update donors array
            selectedProposal.donors.push(msg.sender);
        }
        // Update donationAmount
        proposalDonationAmount[proposalID][msg.sender] += donatedAmount;
    }

    // Proposer can finish the campaign if it is active and get enough money (only proposer)
    function finishCampaign(uint proposalID) whenNotPaused public{
        // Check if it is called by proposer
        Proposal storage selectedProposal = proposals[proposalID];
        require(msg.sender == selectedProposal.proposer, "Only proposer can change the campaign state");
        // Update campaign state
        _updateCampaignState(selectedProposal);
        // Check if the campaign is active
        require(selectedProposal.state == State.Active, "The campaign is not active. Could not be closed");
        // Check if the campaign has enough money
        require(selectedProposal.currentAmount >= selectedProposal.targetAmount, "The campaign does not have enough money");
        // Check if the contract has enough money
        require(address(this).balance >= selectedProposal.currentAmount, "The contract does not have enough money");

        // Update campaign state
        selectedProposal.state = State.Completed;
        // Update donors' information
        // length of donors array is not equal to numDonors (greater than or equal to)
        for (uint i = 0; i < selectedProposal.donors.length; i++){
            address donor = selectedProposal.donors[i];
            uint donatedAmount = proposalDonationAmount[proposalID][donor];
            if (donatedAmount > 0){
                // Update hot amount
                contributors[donor].hotAmount -= donatedAmount;
                // Update donationAmount
                proposalDonationAmount[proposalID][donor] = 0;
                // record to finalDonors array
                selectedProposal.finalDonors.push(donor);
            }
            else continue;
        }
        // Send money to pre-defined recipient
        selectedProposal.recipient.transfer(selectedProposal.currentAmount);
    }

    // Proposer can cancel campaign only if the campaign is active, funds will be sent back to donors' cold amount (only proposer)
    function cancelCampaign(uint proposalID) whenNotPaused public{
        // Check if it is called by proposer
        Proposal storage selectedProposal = proposals[proposalID];
        require(msg.sender == selectedProposal.proposer, "Only proposer can change the campaign state");
        // Update campaign state
        _updateCampaignState(selectedProposal);
        // Check if the campaign is active or expired
        require(selectedProposal.state == State.Active, "The campaign is not active. Could not be cancelled");
        // Update campaign state
        selectedProposal.state = State.Expired;
        // Update donors' information
        // length of donors array is not equal to numDonors (greater than or equal to)
        for (uint i = 0; i < selectedProposal.donors.length; i++){
            address donor = selectedProposal.donors[i];
            uint donatedAmount = proposalDonationAmount[proposalID][donor];
            if (donatedAmount > 0){
                // Update cold amount
                contributors[donor].coldAmount += donatedAmount;
                // Update hot amount
                contributors[donor].hotAmount -= donatedAmount;
                // Update donationAmount
                proposalDonationAmount[proposalID][donor] = 0;
            }
            else continue;
        }
        // Update campaign current amount
        selectedProposal.currentAmount = 0;
        // Update campaign number of donors
        selectedProposal.numDonors = 0;
    }

    // Update campaign state
    function _updateCampaignState(Proposal storage proposal) private{
        // Update campaign state only if it is active
        if (proposal.state == State.Active){
            if (block.timestamp - proposal.startTime > campaignLength * 1 days){
                proposal.state = State.Expired;
            }
        }
    }

    // ===========================================Governance===========================================
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function proposeGovernanceDecision(string memory variable, uint newValue) requireDonation(msg.sender) public{
        // Prevent Flashloan attack: The elapsed time between donation and voting should be longer than predefined time
        require(block.timestamp - contributors[msg.sender].timestamp >= frozenElapse * 1 seconds, "The balance you donated is still in pending");
        
        Decision storage newDecision = governanceDecisions[numDecisions];
        
        newDecision.uniqueid = numDecisions;
        if (keccak256(abi.encodePacked(variable)) == keccak256(abi.encodePacked("MinimumContribution"))){
            newDecision.variable = UpgradableVariable.MinimumContribution;
        }
        else if (keccak256(abi.encodePacked(variable)) == keccak256(abi.encodePacked("FrozenElapse"))){
            newDecision.variable = UpgradableVariable.FrozenElapse;
        }
        else if (keccak256(abi.encodePacked(variable)) == keccak256(abi.encodePacked("CampaignLength"))){
            newDecision.variable = UpgradableVariable.CampaignLength;
        }
        else if (keccak256(abi.encodePacked(variable)) == keccak256(abi.encodePacked("VotingLength"))){
            newDecision.variable = UpgradableVariable.VotingLength;
        }

        newDecision.newValue = newValue;
        newDecision.startTime = block.timestamp;
        newDecision.state = State.Active;
        newDecision.voteVolumn = 0;

        numDecisions++;
    }

    function voteToDecision(uint decisionID) requireDonation(msg.sender) public{
        Decision storage governanceDecision = governanceDecisions[decisionID];
        // Update decision state
        _updateDecisionState(governanceDecision);
        // Check decision state
        require(governanceDecision.state == State.Active, "The decision is not active");
        // Check double voting
        require(governanceDecision.voters[msg.sender] == false, "You have voted to this decision");
        // Prevent Flashloan attack: The elapsed time between donation and voting should be longer than predefined time
        require(block.timestamp - contributors[msg.sender].timestamp >= frozenElapse * 1 seconds, "The balance you donated is still in pending");

        // Update vote volumn
        uint voteVolumn = contributors[msg.sender].hotAmount + contributors[msg.sender].coldAmount;
        governanceDecision.voteVolumn += voteVolumn;
        // Update voters array
        governanceDecision.voters[msg.sender] = true;
    }

    function executeDecision(uint decisionID) requireDonation(msg.sender) public{
        Decision storage governanceDecision = governanceDecisions[decisionID];
        // Update decision state
        _updateDecisionState(governanceDecision);
        // Check decision state
        require(governanceDecision.state == State.Active, "The decision is not active");
        // Check vote volumn
        require(governanceDecision.voteVolumn >= address(this).balance / 2 + 1, "The decision does not have over 50% vote");

        // Execute decision
        if (governanceDecision.variable == UpgradableVariable.MinimumContribution){
            minimumContribution = governanceDecision.newValue;
        }
        else if (governanceDecision.variable == UpgradableVariable.FrozenElapse){
            frozenElapse = governanceDecision.newValue;
        }
        else if (governanceDecision.variable == UpgradableVariable.CampaignLength){
            campaignLength = governanceDecision.newValue;
        }
        else if (governanceDecision.variable == UpgradableVariable.VotingLength){
            votingLength = governanceDecision.newValue;
        }
        // Update decision state
        governanceDecision.state = State.Completed;
    }

    function _updateDecisionState(Decision storage governanceDecision) private{
        if (governanceDecision.state == State.Active){
            if (block.timestamp - governanceDecision.startTime > votingLength * 1 days){
                governanceDecision.state = State.Expired;
            }
        }
    }

    function updateOwner(address newOwner) onlyOwner whenPaused public{
        transferOwnership(newOwner);
    }
    
    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

    // ===========================================getter===========================================
    function getContributors(address donor) public view returns(
        uint timestamp,
        uint coldAmount,
        uint hotAmount)
    {
        timestamp = contributors[donor].timestamp;
        coldAmount = contributors[donor].coldAmount;
        hotAmount = contributors[donor].hotAmount;
    }

    function getProposalDonationAmount(uint proposalID, address donor) public view returns(uint){
        return proposalDonationAmount[proposalID][donor];
    }

    function getProposal(uint proposalID) public view returns(
        address proposer,
        uint uniqueid,
        uint startTime,
        string memory description,
        address recipient,
        uint targetAmount,
        uint currentAmount,
        string memory re_state,
        uint numDonors,
        address[] memory donors,
        address[] memory finalDonors)
    {
        proposer = proposals[proposalID].proposer;
        uniqueid = proposals[proposalID].uniqueid;
        startTime = proposals[proposalID].startTime;
        description = proposals[proposalID].description;
        recipient = proposals[proposalID].recipient;
        targetAmount = proposals[proposalID].targetAmount;
        currentAmount = proposals[proposalID].currentAmount;
        State state = proposals[proposalID].state;
        if (state == State.Active){
            re_state = "Active";
        }
        else if (state == State.Expired){
            re_state = "Expired";
        }
        else{
            re_state = "Completed";
        }
        numDonors = proposals[proposalID].numDonors;
        donors = proposals[proposalID].donors;
        finalDonors = proposals[proposalID].finalDonors;
    }

    function getGovernanceDecisions(uint decisionID) public view returns(
        uint uniqueid,
        string memory variable,
        uint newValue,
        uint startTime,
        uint voteVolumn,
        string memory re_state
        )
    {
        uniqueid = governanceDecisions[decisionID].uniqueid;
        if (governanceDecisions[decisionID].variable == UpgradableVariable.MinimumContribution){
            variable = "MinimumContribution";
        }
        else if (governanceDecisions[decisionID].variable == UpgradableVariable.FrozenElapse){
            variable = "FrozenElapse";
        }
        else if (governanceDecisions[decisionID].variable == UpgradableVariable.CampaignLength){
            variable = "CampaignLength";
        }
        else if (governanceDecisions[decisionID].variable == UpgradableVariable.VotingLength){
            variable = "VotingLength";
        }
        newValue = governanceDecisions[decisionID].newValue;
        startTime = governanceDecisions[decisionID].startTime;
        voteVolumn = governanceDecisions[decisionID].voteVolumn;
        State state = governanceDecisions[decisionID].state;
        if (state == State.Active){
            re_state = "Active";
        }
        else if (state == State.Expired){
            re_state = "Expired";
        }
        else{
            re_state = "Completed";
        }
    }

    function getContractBalance() public view returns(uint){
        return address(this).balance;
    }

    function getMinimumContribution() public view returns(uint){
        return minimumContribution;
    }

    function getFrozenElapse() public view returns(uint){
        return frozenElapse;
    }

    function getCampaignLength() public view returns(uint){
        return campaignLength;
    }

    function getVotingLength() public view returns(uint){
        return votingLength;
    }

    function getNumProposals() public view returns(uint){
        return numProposals;
    }

    function getNumDecisions() public view returns(uint){
        return numDecisions;
    }

    function getPaused() public view returns(bool){
        return paused();
    }

    function getOwner() public view returns(address){
        return owner();
    }
}