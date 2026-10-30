// service-centres-sante/server.js : service simulé fourni (aucune dépendance)
// Routes (section 9 du cahier des charges) :
//   GET /api/centres?commune=   liste (filtre facultatif)
//   GET /api/centres/{code}   détail, 404 si inconnu
//   GET /health
const http = require("http");

const donnees = [
  {
    "code": "CS-AKP-01",
    "libelle": "Centre de santé d'Akpakpa",
    "type": "centre de santé",
    "commune": "Cotonou",
    "agree": true
  },
  {
    "code": "CS-COT-02",
    "libelle": "Hôpital de zone de Cotonou",
    "type": "hôpital",
    "commune": "Cotonou",
    "agree": true
  },
  {
    "code": "CS-ABC-01",
    "libelle": "Clinique Sainte-Marie d'Abomey-Calavi",
    "type": "clinique",
    "commune": "Abomey-Calavi",
    "agree": true
  },
  {
    "code": "CS-POR-09",
    "libelle": "Clinique non agréée de Porto-Novo",
    "type": "clinique",
    "commune": "Porto-Novo",
    "agree": false
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

  if (url.pathname === "/api/centres") {
    const f = (url.searchParams.get("commune") || "").toLowerCase();
    return json(res, 200, donnees.filter((d) => !f || String(d.commune).toLowerCase().includes(f)));
  }

  const m = url.pathname.match(/^\/api\/centres\/([^/]+)$/);
  const trouve = m && donnees.find((d) => d.code === decodeURIComponent(m[1]));
  if (trouve) return json(res, 200, trouve);

  json(res, 404, { message: "Introuvable" });
}).listen(8000, "0.0.0.0", () => console.log("Service centres simulé sur le port 8000"));
