import React, { useState } from 'react';
import { Smartphone, Shield, Zap, ArrowUpRight, Mic, Camera, Search, LayoutGrid, CreditCard, DollarSign, X } from 'lucide-react';

export default function EliteDashboard() {
  const gold = "#D4AF37";
  const [activeTab, setActiveTab] = useState('home');
  const [showPayModal, setShowPayModal] = useState(null); // 'stripe', 'momo', etc.

  const handleAction = (type) => {
    setShowPayModal(type);
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif', color: '#000' }}>
      
      {/* Modal de Paiement Dynamique */}
      {showPayModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ backgroundColor: '#FFF', width: '100%', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', padding: '30px', animation: 'slideUp 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: '900' }}>{showPayModal.toUpperCase()} GATEWAY</h3>
              <X onClick={() => setShowPayModal(null)} style={{ cursor: 'pointer' }} />
            </div>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Initialisation du flux sécurisé vers le moteur FIX 4.4...</p>
            <button 
              onClick={() => window.location.href = '/api/stripe'}
              style={{ width: '100%', padding: '18px', background: '#000', color: gold, borderRadius: '15px', fontWeight: 'bold', border: 'none' }}>
              CONFIRMER LE PAIEMENT
            </button>
          </div>
        </div>
      )}

      {/* Header avec Gemini Multimodal */}
      <nav style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F2F2F2' }}>
        <LayoutGrid size={24} onClick={() => setActiveTab('menu')} style={{ cursor: 'pointer' }} />
        <div style={{ fontWeight: '900', letterSpacing: '3px', fontSize: '18px' }}>BUTTERTECH</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Camera size={24} color={gold} style={{ cursor: 'pointer' }} onClick={() => handleAction('OCR Scan')} />
          <Mic size={24} color={gold} style={{ cursor: 'pointer' }} onClick={() => handleAction('Voice AI')} />
        </div>
      </nav>

      <main style={{ flex: 1, padding: '20px' }}>
        {/* Solde Card */}
        <div style={{ background: '#000', borderRadius: '30px', padding: '35px 25px', color: '#FFF', marginBottom: '30px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)' }}>
          <p style={{ color: gold, fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>SOLDE ACTUEL</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <h2 style={{ fontSize: '32px', margin: 0 }}>$2,540.50</h2>
            <span style={{ color: gold, fontSize: '16px', fontWeight: '300' }}>/ 1,524,300 FCFA</span>
          </div>
        </div>

        {/* Grille de Paiement */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <button onClick={() => handleAction('stripe')} style={btnStyle}>
            <CreditCard size={22} color={gold} />
            <div style={btnTextContainer}>
              <span style={btnTitle}>Interac / Apple</span>
              <span style={btnSub}>Canada & USA</span>
            </div>
          </button>

          <button onClick={() => handleAction('paypal')} style={btnStyle}>
            <DollarSign size={22} color={gold} />
            <div style={btnTextContainer}>
              <span style={btnTitle}>PayPal</span>
              <span style={btnSub}>International</span>
            </div>
          </button>

          <button onClick={() => handleAction('mobile_money')} style={{ ...btnStyle, gridColumn: 'span 2', background: '#000', color: '#FFF' }}>
            <Smartphone size={24} color={gold} />
            <div style={btnTextContainer}>
              <span style={{ ...btnTitle, color: gold }}>MOBILE MONEY</span>
              <span style={{ color: '#888', fontSize: '11px' }}>MTN • ORANGE • M-PESA • CAMTEL</span>
            </div>
            <ArrowUpRight size={20} color={gold} style={{ marginLeft: 'auto' }} />
          </button>
        </div>
      </main>

      {/* Barre de Navigation Basse */}
      <footer style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F2F2F2', backgroundColor: '#FFF' }}>
        <Shield size={24} color={activeTab === 'home' ? gold : "#CCC"} onClick={() => setActiveTab('home')} />
        <div style={{ height: '4px', width: '60px', background: '#EEE', borderRadius: '10px', alignSelf: 'center' }}></div>
        <Search size={24} color={activeTab === 'search' ? gold : "#CCC"} onClick={() => setActiveTab('search')} />
      </footer>

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const btnStyle = { display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', background: '#FFF', border: '1px solid #EEE', borderRadius: '24px', textAlign: 'left', cursor: 'pointer' };
const btnTextContainer = { display: 'flex', flexDirection: 'column' };
const btnTitle = { fontWeight: '700', fontSize: '14px' };
const btnSub = { fontSize: '11px', color: '#999' };
