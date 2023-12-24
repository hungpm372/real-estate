const hre = require("hardhat");

async function main() {

    const lock = await hre.ethers.deployContract("Lock");

    await lock.waitForDeployment();

    console.log("Deployed");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
