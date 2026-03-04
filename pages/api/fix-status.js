export default function handler(req, res) {
  res.status(200).json({ 
    status: "Connected", 
    protocol: "FIX 4.4",
    message: "Simulation active - GCP Billing Bypass Mode",
    timestamp: new Date().toISOString()
  });
}
