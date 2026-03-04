import React, { useState, useRef } from 'react';
import { Smartphone, Shield, Zap, Mic, Camera, LayoutGrid, CreditCard, DollarSign, X, Globe, Video } from 'lucide-react';

export default function MultimodalDashboard() {
  const gold = "#D4AF37";
  const [showPayModal, setShowPayModal] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const videoRef = useRef(null);

  // --- FONCTION SCAN CAMERA (OCR SIMULÉ) ---
  const startScan = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setTimeout(() => {
        alert("Gemini OCR: Numéro détecté: 677XXXXXX (MTN). Montant: 50.000 FCFA");
        stopCamera(stream);
      }, 4000);
    } catch (err) {
      console.error("Camera error", err);
      setIsScanning(false);
    }
  };

  const stopCamera = (stream) => {
    stream.getTracks().forEach(track => track.stop());
    setIsScanning(false);
  };

  // --- FONCTION VOIX (NLP SIMULÉ) ---
  const startVoice = () => {
    setIsListening(true);
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'fr-FR';
    recognition.start();

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      alert("IA Buttertech: J'ai compris : '" + speechToText + "'. Exécution de l'ordre...");
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#000', fontFamily: 'sans-serif' }}>
      
      {/* Overlay Scan Caméra */}
      {isScanning && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: '#000', zIndex: 10000, display: 'flex', flexDirection: 'column' }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '80%', objectFit: 'cover' }} />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', color: gold }}>
            <p style={{ animation: 'pulse 1.5s infinite' }}>ANALYSE GEMINI EN COURS...</p>
          </div>
          <X onClick={() => setIsScanning(false)} style={{ position: 'absolute', top: 20, right: 20, color: '#FFF' }} size={30} />
        </div>
      )}

      {/* Header */}
      <nav style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <LayoutGrid size={24} color="#000" />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '900', letterSpacing: '4px' }}>BUTTERTECH</div>
          <div style={{ fontSize: '7px', color: gold, fontWeight: 'bold' }}>NVIDIA INCEPTION PARTNER</div>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Camera size={22} color={gold} style={{cursor:'pointer'}} onClick={startScan} />
          <Mic size={22} color={isListening ? 'red' : gold} style={{cursor:'pointer'}} onClick={startVoice} />
        </div>
      </nav>

      <main style={{ flex: 1, padding: '20px' }}>
        {/* Wallet Card */}
        <div style={{ background: '#000', borderRadius: '32px', padding: '35px', color: '#FFF', marginBottom: '30px' }}>
          <p style={{ color: gold, fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' }}>TOTAL BALANCE</p>
          <h2 style={{ fontSize: '42px', margin: '10px 0' }}>$2,540.50</h2>
          <div style={{ height: '1px', background: '#333', margin: '20px 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <span style={{ fontSize: '14px', color: '#888' }}>1,524,300 FCFA</span>
             <Shield size={20} color={gold} />
          </div>
        </div>

        {/* Payment Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <div onClick={() => setShowPayModal('INTERAC / VISA')} style={btnStyle}>
            <CreditCard size={20} color={gold} />
            <span style={{fontWeight: '700', fontSize: '13px'}}>Interac / Visa</span>
          </div>
          <div onClick={() => setShowPayModal('PAYPAL')} style={btnStyle}>
            <DollarSign size={20} color={gold} />
            <span style={{fontWeight: '700', fontSize: '13px'}}>PayPal</span>
          </div>
        </div>

        <div onClick={() => setShowPayModal('MOBILE MONEY')} style={momoBtnStyle}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: '900', color: gold }}>MOBILE MONEY</div>
            <div style={{ fontSize: '10px', color: '#AAA' }}>MTN • ORANGE • M-PESA • CAMTEL</div>
          </div>
          <Smartphone size={24} color={gold} />
        </div>
      </main>

      {/* Footer Nav */}
      <footer style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F5F5F5' }}>
        <Zap size={24} color={gold} />
        <div style={{ width: '50px', height: '4px', background: '#EEE', borderRadius: '10px', alignSelf: 'center' }}></div>
        <div style={{ width: '24px', height: '24px', background: '#000', borderRadius: '50%' }}></div>
      </footer>

      {/* Pop-up de Paiement */}
      {showPayModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ background: '#FFF', width: '100%', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', padding: '40px 30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{ fontWeight: '900', margin: 0 }}>{showPayModal}</h3>
              <X onClick={() => setShowPayModal(null)} style={{ cursor: 'pointer' }} size={24} />
            </div>
            <button style={{ width: '100%', padding: '20px', background: '#000', color: gold, borderRadius: '18px', border: 'none', fontWeight: 'bold' }}>CONFIRMER</button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

const btnStyle = { display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', background: '#FFF', border: '1px solid #EEE', borderRadius: '24px', textAlign: 'left', cursor: 'pointer' };
const momoBtnStyle = { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px', background: '#000', borderRadius: '24px', cursor: 'pointer', border: 'none', boxSizing: 'border-box' };
