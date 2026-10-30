// service-medecins/server.js : service simulé fourni (aucune dépendance)
// Routes (section 9 du cahier des charges) :
//   GET /api/medecins?nom=   liste (filtre facultatif)
//   GET /api/medecins/{numero}   détail, 404 si inconnu
//   GET /health
const http = require("http");

const donnees = [
  {
    "numero": "ONMB-2015-0412",
    "nom": "HOUNSOU",
    "prenoms": "Koffi",
    "specialite": "Médecine générale",
    "statut": "actif"
  },
  {
    "numero": "ONMB-2012-0187",
    "nom": "ADJOVI",
    "prenoms": "Mariam",
    "specialite": "Pédiatrie",
    "statut": "actif"
  },
  {
    "numero": "ONMB-2018-0633",
    "nom": "DOSSOU",
    "prenoms": "Gildas",
    "specialite": "Cardiologie",
    "statut": "actif"
  },
  {
    "numero": "ONMB-2010-0099",
    "nom": "TOKPANOU",
    "prenoms": "Henri",
    "specialite": "Chirurgie",
    "statut": "suspendu"
  }
];

const json = (res, code, corps) => {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(corps));
};

http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/health") return json(res, 200, { status: "ok" });

  if (url.pathname === "/api/medecins") {
    const f = (url.searchParams.get("nom") || "").toLowerCase();
    return json(res, 200, donnees.filter((d) => !f || String(d.nom).toLowerCase().includes(f)));
  }

  const m = url.pathname.match(/^\/api\/medecins\/([^/]+)$/);
  const trouve = m && donnees.find((d) => d.numero === decodeURIComponent(m[1]));
  if (trouve) return json(res, 200, trouve);

  json(res, 404, { message: "Introuvable" });
}).listen(8000, "0.0.0.0", () => console.log("Service medecins simulé sur le port 8000"));
