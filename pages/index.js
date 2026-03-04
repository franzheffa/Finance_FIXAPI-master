import React, { useState } from 'react';
import { Smartphone, Shield, Zap, ArrowUpRight, Mic, Camera, LayoutGrid, CreditCard, DollarSign, X } from 'lucide-react';

export default function EliteDashboard() {
  const gold = "#D4AF37";
  const [showPayModal, setShowPayModal] = useState(null);

  const triggerSecurityLog = async (amt) => {
    await fetch('/api/automate-security', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amt, currency: 'USD', userId: 'USER_001' })
    });
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#000' }}>
      
      {/* Header Minimaliste */}
      <nav style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <LayoutGrid size={24} color="#000" />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '900', letterSpacing: '4px' }}>BUTTERTECH</div>
          <div style={{ fontSize: '7px', color: gold, fontWeight: 'bold' }}>NVIDIA INCEPTION PARTNER</div>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Camera size={22} color={gold} />
          <Mic size={22} color={gold} />
        </div>
      </nav>

      <main style={{ flex: 1, padding: '20px' }}>
        {/* Card Solde - Pureté Noire et Or */}
        <div style={{ background: '#000', borderRadius: '32px', padding: '35px', color: '#FFF', marginBottom: '30px' }}>
          <p style={{ color: gold, fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' }}>TOTAL BALANCE</p>
          <h2 style={{ fontSize: '42px', margin: '10px 0' }}>$2,540.50</h2>
          <div style={{ height: '1px', background: '#333', margin: '20px 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <span style={{ fontSize: '14px', color: '#888' }}>1,524,300 FCFA</span>
             <Shield size={20} color={gold} />
          </div>
        </div>

        {/* Grille de Paiement - Focus sur la Transaction */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <button onClick={() => { setShowPayModal('Interac'); triggerSecurityLog(1200); }} style={btnStyle}>
            <CreditCard size={20} color={gold} />
            <span style={btnTitle}>Interac / Visa</span>
          </button>
          <button onClick={() => setShowPayModal('PayPal')} style={btnStyle}>
            <DollarSign size={20} color={gold} />
            <span style={btnTitle}>PayPal</span>
          </button>
        </div>

        <button onClick={() => setShowPayModal('Mobile Money')} style={momoBtnStyle}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: '900', color: gold }}>MOBILE MONEY</div>
            <div style={{ fontSize: '10px', color: '#AAA' }}>MTN • ORANGE • M-PESA • CAMTEL</div>
          </div>
          <Smartphone size={24} color={gold} />
        </button>

        {/* Partenaires Discrets (Crédibilité sans brouillage) */}
        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '30px', opacity: 0.3, filter: 'grayscale(1)' }}>
          <span style={{ fontWeight: 'bold', fontSize: '12px' }}>GOOGLE CLOUD</span>
          <span style={{ fontWeight: 'bold', fontSize: '12px' }}>NVIDIA</span>
        </div>
      </main>

      {/* Footer Nav */}
      <footer style={{ padding: '20px', display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #F5F5F5' }}>
        <Zap size={24} color={gold} />
        <div style={{ width: '50px', height: '4px', background: '#EEE', borderRadius: '10px', alignSelf: 'center' }}></div>
        <div style={{ width: '24px', height: '24px', background: '#000', borderRadius: '50%' }}></div>
      </footer>

      {/* Modal Minimaliste */}
      {showPayModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#FFF', width: '100%', borderRadius: '24px', padding: '30px' }}>
            <h3 style={{ fontWeight: '900', marginBottom: '10px' }}>{showPayModal}</h3>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>Connexion au Bridge FIX 4.4 activée. Sécurité NVIDIA AI active.</p>
            <button onClick={() => setShowPayModal(null)} style={{ width: '100%', padding: '15px', background: '#000', color: gold, borderRadius: '12px', border: 'none', fontWeight: 'bold' }}>PROCÉDER</button>
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle = { display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', background: '#FFF', border: '1px solid #EEE', borderRadius: '24px', textAlign: 'left', cursor: 'pointer' };
const btnTitle = { fontWeight: '700', fontSize: '13px' };
const momoBtnStyle = { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px', background: '#000', borderRadius: '24px', cursor: 'pointer', border: 'none' };
