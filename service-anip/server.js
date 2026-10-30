// service-anip/server.js : service simulé fourni (aucune dépendance)
const http = require("http");

const citoyens = {
  "9912345678": {
    npi: "9912345678", nom: "AHOUANDJINOU", prenoms: "Rita",
    date_naissance: "1990-04-17", sexe: "F", commune: "Cotonou",
  },
};

http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/health") {
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }
  const m = req.url.match(/^\/api\/citoyens\/(\d+)$/);
  if (m && citoyens[m[1]]) {
    res.end(JSON.stringify(citoyens[m[1]]));
    return;
  }
  res.statusCode = 404;
  res.end(JSON.stringify({ message: "NPI inconnu" }));
}).listen(8000, "0.0.0.0", () => console.log("ANIP simulé sur le port 8000"));
