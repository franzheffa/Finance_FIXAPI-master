export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { amount, currency, userId } = req.body;
    const threshold = 1000; // Ton seuil de 

    let aiResponse = { status: "NORMAL_ACTIVITY" };

    if (amount >= threshold) {
      // Simulation d'un Log d'IA NVIDIA Inception
      aiResponse = {
        status: "HIGH_VALUE_DETECTION",
        protocol: "NVIDIA_INCEPTION_MONITORING",
        log: `Alerte: Transaction de ${amount} ${currency} détectée pour l'utilisateur ${userId}`,
        action: "AUTO_FIX_BRIDGE_PRIORITY", // On donne la priorité au moteur FIX
        timestamp: new Date().toISOString()
      };
      
      console.log("--- NVIDIA AI SECURITY LOG ---", aiResponse);
      // Ici, tu pourrais envoyer un email automatique via Google Cloud (nativement)
    }

    return res.status(200).json(aiResponse);
  }
  res.status(405).send('Automate Only');
}
