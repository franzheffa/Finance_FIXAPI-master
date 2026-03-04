export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { transactionId, amount, type } = req.body;

    // Simulation du protocole FIX 4.4
    const fixMessage = {
      MsgType: "D", // New Order Single
      Symbol: "XAU/UI", // Or numérique vs Ui
      Side: "1", // Buy
      OrderQty: amount / 600,
      TransactTime: new Date().toISOString(),
      ClOrdID: transactionId
    };

    console.log("FIX Engine 2016 - Outgoing Message:", fixMessage);

    return res.status(200).json({
      status: "EXECUTION_REPORT",
      orderId: "FIX-" + Math.random().toString(36).substr(2, 9),
      message: "Ordre d'achat d'or synchronisé avec succès via le moteur 2016."
    });
  }
  res.status(405).send('Bridge Only');
}
