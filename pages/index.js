import React, { useState, useRef } from 'react';
import * as Icons from 'lucide-react';

export default function EliteDashboard() {
  const gold = "#D4AF37";
  const [showPayModal, setShowPayModal] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [fixStatus, setFixStatus] = useState("READY"); // READY, CONNECTING, ACTIVE
  const videoRef = useRef(null);

  // --- LOGIQUE FIX 4.4 ---
  const toggleFixBridge = async () => {
    setFixStatus("CONNECTING");
    // Appel au moteur C# 2016 simulé
    const res = await fetch('/api/bridge-fix', { 
      method: 'POST', 
      body: JSON.stringify({ action: 'CONNECT_ENGINE' }) 
    });
    setTimeout(() => setFixStatus("ACTIVE"), 1500);
  };

  // --- LOGIQUE CAMERA OCR ---
  const activateCamera = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Erreur Caméra: Accès refusé");
      setIsScanning(false);
    }
  };

  // --- LOGIQUE VOICE GEMINI ---
  const activateVoice = () => {
    setIsVoiceActive(true);
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'fr-FR';
    recognition.onresult = (e) => {
      alert("Ordre Voice détecté: " + e.results[0][0].transcript);
      setIsVoiceActive(false);
    };
    recognition.onerror = () => setIsVoiceActive(false);
    recognition.start();
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', color: '#000', fontFamily: 'sans-serif' }}>
      
      {/* Barre de Status FIX 4.4 */}
      <div onClick={toggleFixBridge} style={{ background: fixStatus === 'ACTIVE' ? '#00FF00' : gold, color: '#000', textAlign: 'center', fontSize: '10px', fontWeight: 'bold', padding: '5px', cursor: 'pointer' }}>
        FIX 4.4 ENGINE: {fixStatus} {fixStatus === 'READY' && " (CLICK TO CONNECT)"}
      </div>

      <nav style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Icons.LayoutGrid size={24} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '900', letterSpacing: '3px' }}>BUTTERTECH</div>
          <div style={{ fontSize: '8px', color: gold, fontWeight: 'bold' }}>NVIDIA INCEPTION PARTNER</div>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Icons.Camera size={26} color={gold} onClick={activateCamera} style={{ cursor: 'pointer' }} />
          <Icons.Mic size={26} color={isVoiceActive ? 'red' : gold} onClick={activateVoice} style={{ cursor: 'pointer' }} />
        </div>
      </nav>

      <main style={{ padding: '20px' }}>
        <div style={{ background: '#000', borderRadius: '24px', padding: '35px', color: '#FFF', marginBottom: '25px' }}>
          <p style={{ color: gold, fontSize: '10px', fontWeight: 'bold' }}>VALEUR OR NUMÉRIQUE</p>
          <h1 style={{ fontSize: '42px', margin: '10px 0' }}>$2,540.50</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}>
            <span>1,524,300 FCFA</span>
            <Icons.Zap size={18} color={gold} fill={gold} />
          </div>
        </div>

        <button onClick={() => setShowPayModal('MOBILE MONEY')} style={actionBtn}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Icons.Smartphone size={24} color={gold} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '900', color: gold }}>MOBILE MONEY</div>
              <div style={{ fontSize: '10px', color: '#888' }}>MTN • ORANGE • M-PESA</div>
            </div>
          </div>
          <Icons.ArrowRight size={20} color={gold} />
        </button>
      </main>

      {/* Camera Overlay */}
      {isScanning && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 1000 }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div onClick={() => setIsScanning(false)} style={{ position: 'absolute', top: 40, right: 20, color: '#FFF', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '50%' }}>
            <Icons.X size={30} />
          </div>
        </div>
      )}

      {/* Modal Transaction */}
      {showPayModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ background: '#FFF', width: '100%', padding: '40px 20px', borderTopLeftRadius: '40px', borderTopRightRadius: '40px' }}>
            <h2 style={{ fontWeight: '900', marginBottom: '20px' }}>FLUX {showPayModal}</h2>
            <button onClick={() => setShowPayModal(null)} style={{ width: '100%', padding: '20px', background: '#000', color: gold, borderRadius: '20px', fontWeight: 'bold', border: 'none' }}>
              CONFIRMER VIA BRIDGE FIX
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const actionBtn = { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px', background: '#000', borderRadius: '25px', border: 'none', cursor: 'pointer' };
