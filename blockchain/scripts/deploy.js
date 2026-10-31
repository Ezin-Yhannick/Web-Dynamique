const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploiement du contrat RegistreDMP...");
  const RegistreDMP = await hre.ethers.getContractFactory("RegistreDMP");
  const registre = await RegistreDMP.deploy();
  await registre.waitForDeployment();

  const address = await registre.getAddress();
  console.log("RegistreDMP deploye a l'adresse :", address);

  const artifact = await hre.artifacts.readArtifact("RegistreDMP");
  const deployData = {
    address: address,
    abi: artifact.abi
  };

  const outputPath = process.env.DEPLOY_OUTPUT || path.join(__dirname, "../RegistreDMP.json");
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(deployData, null, 2));
  console.log("Metadonnees de deploiement ecrites dans :", outputPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
