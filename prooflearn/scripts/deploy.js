const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // 1. Deploy SkillCertificate
    const SkillCertificate = await hre.ethers.getContractFactory("SkillCertificate");
    const certificate = await SkillCertificate.deploy(deployer.address);
    await certificate.waitForDeployment();
    const certificateAddress = await certificate.getAddress();
    console.log("SkillCertificate deployed to:", certificateAddress);

    // 2. Deploy TaskRegistry
    const TaskRegistry = await hre.ethers.getContractFactory("TaskRegistry");
    const registry = await TaskRegistry.deploy(deployer.address);
    await registry.waitForDeployment();
    const registryAddress = await registry.getAddress();
    console.log("TaskRegistry deployed to:", registryAddress);

    console.log("\nDeployment Summary:");
    console.log("-------------------");
    console.log("SkillCertificate:", certificateAddress);
    console.log("TaskRegistry:", registryAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
