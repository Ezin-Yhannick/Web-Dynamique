// blockchain/healthcheck.js : sonde utilisée par Docker (code 0 = sain)
fetch("http://localhost:8545", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ jsonrpc: "2.0", method: "eth_blockNumber", params: [], id: 1 }),
})
  .then((r) => process.exit(r.ok ? 0 : 1))
  .catch(() => process.exit(1));
