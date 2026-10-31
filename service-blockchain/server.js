const express = require("express");
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const CONTRACT_FILE = process.env.CONTRACT_FILE || "/shared/RegistreDMP.json";

let contract = null;

function initContract() {
  if (contract) return contract;
  if (!fs.existsSync(CONTRACT_FILE)) {
    console.warn("Fichier de contrat introuvable :", CONTRACT_FILE);
    return null;
  }
  try {
    const data = JSON.parse(fs.readFileSync(CONTRACT_FILE, "utf8"));
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    contract = new ethers.Contract(data.address, data.abi, wallet);
    console.log("Contrat RegistreDMP charge a l'adresse :", data.address);
    return contract;
  } catch (err) {
    console.error("Erreur chargement contrat :", err);
    return null;
  }
}

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/ancrages", async (req, res) => {
  const { empreinte, idAuteur } = req.body;
  if (!empreinte || !idAuteur) {
    return res.status(400).json({ error: "empreinte et idAuteur requis" });
  }
  const c = initContract();
  if (!c) {
    return res.status(503).json({ error: "Contrat non initialise" });
  }
  try {
    const tx = await c.ancrerDocument(empreinte, idAuteur);
    const receipt = await tx.wait();
    res.status(201).json({
      transaction: receipt.hash,
      bloc: receipt.blockNumber
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/ancrages/:empreinte", async (req, res) => {
  const { empreinte } = req.params;
  const c = initContract();
  if (!c) {
    return res.status(503).json({ error: "Contrat non initialise" });
  }
  try {
    const result = await c.verifierAncrage(empreinte);
    res.json({
      existe: result[0],
      idAuteur: result[1],
      horodatage: Number(result[2])
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/acces", async (req, res) => {
  const { idDossier, idMedecin, action, urgence } = req.body;
  if (!idDossier || !idMedecin || !action) {
    return res.status(400).json({ error: "idDossier, idMedecin et action requis" });
  }
  const c = initContract();
  if (!c) {
    return res.status(503).json({ error: "Contrat non initialise" });
  }
  try {
    const tx = await c.journaliserAcces(idDossier, idMedecin, action, Boolean(urgence));
    const receipt = await tx.wait();
    res.status(201).json({
      status: "ok",
      transaction: receipt.hash,
      bloc: receipt.blockNumber
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/acces/:idDossier", async (req, res) => {
  const { idDossier } = req.params;
  const c = initContract();
  if (!c) {
    return res.status(503).json({ error: "Contrat non initialise" });
  }
  try {
    const list = await c.obtenirJournalAcces(idDossier);
    const formatted = list.map((item) => ({
      idDossier: item.idDossier,
      idMedecin: item.idMedecin,
      action: item.action,
      urgence: item.urgence,
      horodatage: Number(item.horodatage)
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Service blockchain ecoute sur le port ${PORT}`);
  initContract();
});
