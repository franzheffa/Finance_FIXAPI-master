export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Simulation de connexion au moteur C#
    console.log("Moteur FIX 4.4 : Réception d'un signal de synchronisation...");
    return res.status(200).json({ status: "CONNECTED", protocol: "FIX.4.4", engine: "Buttertech_2016" });
  }
  res.status(405).end();
}
