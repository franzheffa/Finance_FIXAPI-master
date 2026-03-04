import React, { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';

export default function PrestigeDashboard() {
  const gold = "#D4AF37";
  const [showPayModal, setShowPayModal] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const videoRef = useRef(null);

  // Stop camera stream safely
  const stopCamera = (stream) => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    setIsScanning(false);
  };

  const startScan = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setTimeout(() => stopCamera(stream), 5000);
    } catch (err) {
      console.error("Camera access denied");
      setIsScanning(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', color: '#000', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* Header Statut Elite */}
      <nav style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F0F0F0' }}>
        <Icons.LayoutGrid size={24} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '900', letterSpacing: '3px', fontSize: '14px' }}>BUTTERTECH</div>
          <div style={{ fontSize: '8px', color: gold, fontWeight: 'bold' }}>NVIDIA INCEPTION PARTNER</div>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Icons.Camera size={22} color={gold} onClick={startScan} style={{ cursor: 'pointer' }} />
          <Icons.Mic size={22} color={gold} style={{ cursor: 'pointer' }} />
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '20px' }}>
        {/* Balance Card */}
        <div style={{ background: '#000', borderRadius: '24px', padding: '30px', color: '#FFF', marginBottom: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <p style={{ color: gold, fontSize: '10px', fontWeight: 'bold', margin: 0 }}>GLOBAL BALANCE</p>
          <h1 style={{ fontSize: '38px', margin: '10px 0', fontWeight: '800' }}>$2,540.50</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '14px' }}>
            <span>1,524,300 FCFA</span>
            <Icons.ShieldCheck size={18} color={gold} />
          </div>
        </div>

        {/* Action Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
          <button onClick={() => setShowPayModal('STRIPE')} style={cardStyle}>
            <Icons.CreditCard size={20} color={gold} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Card / Interac</span>
          </button>
          <button onClick={() => setShowPayModal('PAYPAL')} style={cardStyle}>
            <Icons.Globe size={20} color={gold} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>PayPal</span>
          </button>
        </div>

        {/* Mobile Money Primary */}
        <button onClick={() => setShowPayModal('MOBILE MONEY')} style={momoStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Icons.Smartphone size={24} color={gold} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '900', color: gold, fontSize: '14px' }}>MOBILE MONEY</div>
              <div style={{ fontSize: '10px', color: '#888' }}>MTN • ORANGE • M-PESA</div>
            </div>
          </div>
          <Icons.ChevronRight size={20} color={gold} />
        </button>

        {/* Partners Proof */}
        <div style={{ marginTop: '40px', textAlign: 'center', opacity: 0.4 }}>
          <p style={{ fontSize: '9px', fontWeight: 'bold', marginBottom: '10px' }}>POWERED BY INFRASTRUCTURE GIANTS</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '11px', fontWeight: '900' }}>
            <span>GOOGLE CLOUD</span>
            <span>NVIDIA AI</span>
          </div>
        </div>
      </main>

      {/* Payment Drawer */}
      {showPayModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ background: '#FFF', width: '100%', padding: '30px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '900' }}>{showPayModal}</h2>
              <Icons.X onClick={() => setShowPayModal(null)} style={{ cursor: 'pointer' }} />
            </div>
            <div style={{ padding: '20px', background: '#F8F8F8', borderRadius: '15px', marginBottom: '20px', fontSize: '12px' }}>
              Bridge FIX 4.4 Initialisé... Analyse de risque NVIDIA active.
            </div>
            <button style={{ width: '100%', padding: '18px', background: '#000', color: gold, borderRadius: '15px', fontWeight: 'bold', border: 'none' }}>
              EXECUTER LA TRANSACTION
            </button>
          </div>
        </div>
      )}

      {/* Camera View Overlay */}
      {isScanning && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 200 }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', border: `2px solid ${gold}`, width: '250px', height: '250px', borderRadius: '20px' }} />
          <Icons.X onClick={() => setIsScanning(false)} style={{ position: 'absolute', top: 30, right: 30, color: '#FFF' }} size={30} />
        </div>
      )}
    </div>
  );
}

const cardStyle = { display: 'flex', flexDirection: 'column', gap: '8px', padding: '15px', background: '#FFF', border: '1px solid #EEE', borderRadius: '18px', textAlign: 'left', cursor: 'pointer' };
const momoStyle = { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#000', borderRadius: '20px', border: 'none', cursor: 'pointer' };
