import React, { useState, useRef } from 'react';
import * as Icons from 'lucide-react';

export default function EliteDashboard() {
  const gold = "#D4AF37";
  const [showPayModal, setShowPayModal] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [fixStatus, setFixStatus] = useState("DISCONNECTED");
  const videoRef = useRef(null);

  const connectFix = async () => {
    setFixStatus("CONNECTING...");
    const res = await fetch('/api/bridge-fix', { method: 'POST' });
    const data = await res.json();
    if(data.status === "CONNECTED") {
      setFixStatus("FIX 4.4 ACTIVE");
      window.speechSynthesis.speak(new SpeechSynthesisUtterance("Moteur FIX synchronisé"));
    }
  };

  const toggleCamera = async () => {
    setIsScanning(!isScanning);
    if (!isScanning) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) { setIsScanning(false); }
    }
  };

  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Non supporté");
    const rec = new SpeechRecognition();
    rec.lang = 'fr-FR';
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onresult = (e) => alert("Commande: " + e.results[0][0].transcript);
    rec.start();
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', color: '#000', fontFamily: 'sans-serif' }}>
      
      {/* BADGE FIX 4.4 */}
      <div onClick={connectFix} style={{ background: fixStatus === "FIX 4.4 ACTIVE" ? "#00C853" : gold, color: '#000', padding: '10px', textAlign: 'center', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }}>
        {fixStatus} {fixStatus === "DISCONNECTED" && " (CONNECT ENGINE)"}
      </div>

      <nav style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EEE' }}>
        <Icons.LayoutGrid size={24} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '900', letterSpacing: '4px', fontSize: '16px' }}>BUTTERTECH</div>
          <div style={{ fontSize: '8px', color: gold, fontWeight: 'bold' }}>NVIDIA INCEPTION PARTNER</div>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Icons.Camera size={26} color={gold} onClick={toggleCamera} style={{ cursor: 'pointer' }} />
          <Icons.Mic size={26} color={isListening ? "red" : gold} onClick={toggleVoice} style={{ cursor: 'pointer' }} />
        </div>
      </nav>

      <main style={{ padding: '20px' }}>
        {/* Solde */}
        <div style={{ background: '#000', borderRadius: '30px', padding: '40px 30px', color: '#FFF', marginBottom: '25px', border: `1px solid ${gold}` }}>
          <p style={{ color: gold, fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>GLOBAL ASSET VALUE</p>
          <h2 style={{ fontSize: '42px', margin: '10px 0', fontWeight: '800' }}>$2,540.50</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}>
            <span>1,524,300 FCFA</span>
            <Icons.ShieldCheck size={20} color={gold} />
          </div>
        </div>

        {/* Grille de Paiement : Stripe, PayPal, Apple Pay */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div onClick={() => setShowPayModal('STRIPE / VISA')} style={btnStyle}>
            <Icons.CreditCard size={22} color={gold} />
            <span style={btnLabel}>STRIPE</span>
          </div>
          <div onClick={() => setShowPayModal('PAYPAL')} style={btnStyle}>
            <Icons.Globe size={22} color={gold} />
            <span style={btnLabel}>PAYPAL</span>
          </div>
        </div>

        <div onClick={() => setShowPayModal('APPLE PAY')} style={{ ...btnStyle, flexDirection: 'row', justifyContent: 'center', marginBottom: '15px', width: '100%' }}>
          <Icons.Apple size={22} color={gold} />
          <span style={{ ...btnLabel, marginLeft: '10px' }}>APPLE PAY</span>
        </div>

        {/* Mobile Money Section */}
        <div onClick={() => setShowPayModal('MOBILE MONEY')} style={momoStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Icons.Smartphone size={28} color={gold} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '900', color: gold, fontSize: '15px' }}>AFRICA MOBILE MONEY</div>
              <div style={{ fontSize: '10px', color: '#888' }}>MTN • ORANGE • M-PESA</div>
            </div>
          </div>
          <Icons.ArrowRightCircle size={24} color={gold} />
        </div>
      </main>

      {/* CAMERA OVERLAY */}
      {isScanning && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 1000 }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <Icons.XCircle onClick={() => setIsScanning(false)} size={40} color="#FFF" style={{ position: 'absolute', top: 40, right: 20 }} />
          <div style={{ position: 'absolute', bottom: 50, width: '100%', textAlign: 'center', color: gold, fontWeight: 'bold' }}>SCANNER LOGO POUR AUTO-PAY</div>
        </div>
      )}

      {/* MODAL TRANSACTION */}
      {showPayModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ background: '#FFF', width: '100%', padding: '40px 30px', borderTopLeftRadius: '40px', borderTopRightRadius: '40px' }}>
            <h3 style={{ fontWeight: '900', marginBottom: '10px' }}>CONFIRMER {showPayModal}</h3>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '30px' }}>Protocole FIX 4.4 & NVIDIA Inception Security actif.</p>
            <button onClick={() => setShowPayModal(null)} style={{ width: '100%', padding: '20px', background: '#000', color: gold, borderRadius: '20px', fontWeight: 'bold', border: 'none' }}>
              EXECUTER L'ORDRE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px', background: '#FFF', border: '1px solid #EEE', borderRadius: '24px', cursor: 'pointer' };
const btnLabel = { fontWeight: '800', fontSize: '12px', letterSpacing: '1px' };
const momoStyle = { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px', background: '#000', borderRadius: '30px', cursor: 'pointer', border: 'none', boxSizing: 'border-box' };
