import React, { useState, useRef } from 'react';
import { Smartphone, Shield, Zap, Mic, Camera, LayoutGrid, CreditCard, DollarSign, X, Globe } from 'lucide-react';

export default function MultimodalDashboard() {
  const gold = "#D4AF37";
  const [showPayModal, setShowPayModal] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState("");
  const videoRef = useRef(null);

  // --- LOGIQUE VISION NVIDIA INCEPTION ---
  const startScan = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
      
      setStatus("Analyse visuelle...");
      
      // Simulation: après 3s, on "détecte" la couleur Orange
      setTimeout(async () => {
        const res = await fetch('/api/merchant-database', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ detectedColor: '#FF7900' })
        });
        const data = await res.json();
        
        stopCamera(stream);
        setShowPayModal(data.merchant.name);
        speak(`Marchand ${data.merchant.name} identifié. Prêt pour le virement.`);
      }, 3000);
    } catch (err) { setIsScanning(false); }
  };

  const stopCamera = (stream) => {
    stream.getTracks().forEach(track => track.stop());
    setIsScanning(false);
  };

  // --- LOGIQUE VOICE GEMINI ---
  const startVoice = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'fr-FR';
    recognition.start();
    setStatus("IA à l'écoute...");

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript;
      speak(`Commande reçue : ${command}. Analyse en cours.`);
      setStatus(`Ordre: ${command}`);
    };
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#000', fontFamily: 'sans-serif' }}>
      
      {isScanning && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: '#000', zIndex: 10000 }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', border: `2px solid ${gold}`, width: '250px', height: '250px', borderRadius: '20px' }}></div>
          <p style={{ position: 'absolute', bottom: '100px', width: '100%', textAlign: 'center', color: gold, fontWeight: 'bold' }}>{status}</p>
        </div>
      )}

      <nav style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <LayoutGrid size={24} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '900', letterSpacing: '4px' }}>BUTTERTECH</div>
          <div style={{ fontSize: '7px', color: gold, fontWeight: 'bold' }}>NVIDIA INCEPTION PARTNER</div>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Camera size={22} color={gold} onClick={startScan} style={{cursor:'pointer'}} />
          <Mic size={22} color={gold} onClick={startVoice} style={{cursor:'pointer'}} />
        </div>
      </nav>

      <main style={{ flex: 1, padding: '20px' }}>
        <div style={{ background: '#000', borderRadius: '32px', padding: '35px', color: '#FFF', marginBottom: '30px' }}>
          <p style={{ color: gold, fontSize: '11px', fontWeight: 'bold' }}>SOLDE $ / FCFA</p>
          <h2 style={{ fontSize: '42px', margin: '10px 0' }}>$2,540.50</h2>
          <p style={{ color: '#888' }}>1,524,300 FCFA</p>
        </div>

        <div onClick={() => setShowPayModal('MOBILE MONEY')} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px', background: '#000', borderRadius: '24px', cursor: 'pointer', border: 'none' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: '900', color: gold }}>MOBILE MONEY</div>
            <div style={{ fontSize: '10px', color: '#AAA' }}>MTN • ORANGE • M-PESA • CAMTEL</div>
          </div>
          <Smartphone size={24} color={gold} />
        </div>
        
        <p style={{ marginTop: '20px', fontSize: '12px', color: gold, textAlign: 'center' }}>{status}</p>
      </main>

      {showPayModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ background: '#FFF', width: '100%', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', padding: '40px 30px' }}>
            <h3 style={{ fontWeight: '900', marginBottom: '20px' }}>PAIEMENT : {showPayModal}</h3>
            <button onClick={() => setShowPayModal(null)} style={{ width: '100%', padding: '20px', background: '#000', color: gold, borderRadius: '18px', border: 'none', fontWeight: 'bold' }}>CONFIRMER LE FLUX FIX</button>
          </div>
        </div>
      )}
    </div>
  );
}
