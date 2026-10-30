// service-blockchain/src/index.js : service de test fourni
const http = require("http");
const RPC = process.env.HARDHAT_RPC_URL || "http://hardhat:8545";

http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/health") {
    try {
      const r = await fetch(RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", method: "eth_blockNumber", params: [], id: 1 }),
      });
      const j = await r.json();
      res.end(JSON.stringify({ status: "ok", bloc: j.result }));
    } catch (e) {
      res.statusCode = 503;
      res.end(JSON.stringify({ status: "ko", message: "réseau Hardhat indisponible" }));
    }
    return;
  }
  res.statusCode = 404;
  res.end("{}");
}).listen(3000, "0.0.0.0", () => console.log("service blockchain sur le port 3000"));
