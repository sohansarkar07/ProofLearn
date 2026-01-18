// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TaskRegistry is Ownable {
    struct Task {
        uint256 id;
        string name;
        string description;
        uint256 rewardAmount; // Optional, can be used for native tokens or just info
        bool isActive;
    }

    struct Submission {
        uint256 taskId;
        address learner;
        string proofUrl;
        bytes32 proofHash;
        bool isVerified;
        bool isValue; // To check if submission exists
    }

    uint256 public taskCount;
    mapping(uint256 => Task) public tasks;
    // learner => taskId => Submission
    mapping(address => mapping(uint256 => Submission)) public submissions;

    event TaskCreated(uint256 indexed taskId, string name, uint256 reward);
    event TaskSubmitted(uint256 indexed taskId, address indexed learner, bytes32 proofHash);
    event TaskVerified(uint256 indexed taskId, address indexed learner, bool approved);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function createTask(string memory name, string memory description, uint256 reward) public onlyOwner {
        taskCount++;
        tasks[taskCount] = Task(taskCount, name, description, reward, true);
        emit TaskCreated(taskCount, name, reward);
    }

    function submitTask(uint256 taskId, string memory proofUrl) public {
        require(tasks[taskId].isActive, "Task is not active");
        require(!submissions[msg.sender][taskId].isValue, "Already submitted");

        bytes32 proofHash = keccak256(abi.encodePacked(proofUrl, msg.sender, block.timestamp));
        submissions[msg.sender][taskId] = Submission(taskId, msg.sender, proofUrl, proofHash, false, true);

        emit TaskSubmitted(taskId, msg.sender, proofHash);
    }

    function verifySubmission(address learner, uint256 taskId, bool approved) public onlyOwner {
        require(submissions[learner][taskId].isValue, "Submission not found");
        require(!submissions[learner][taskId].isVerified, "Already verified");

        submissions[learner][taskId].isVerified = approved;
        emit TaskVerified(taskId, learner, approved);
    }
}
