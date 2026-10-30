// front-react/src/App.jsx : page de test fournie
import { useEffect, useState } from "react";

export default function App() {
  const [etat, setEtat] = useState("chargement...");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then((r) => r.json())
      .then((d) => setEtat(JSON.stringify(d, null, 2)))
      .catch(() => setEtat("API injoignable"));
  }, []);

  return (
    <main style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>DMP : test de l'environnement Docker</h1>
      <pre>{etat}</pre>
    </main>
  );
}
