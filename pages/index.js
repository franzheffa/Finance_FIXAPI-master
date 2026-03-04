import React, { useState } from 'react';
import { Smartphone, Shield, Zap, ArrowUpRight, Mic, Camera, Search, LayoutGrid, CreditCard, DollarSign } from 'lucide-react';

export default function EliteDashboard() {
  const gold = "#D4AF37";
  const [usdAmount] = useState(2540.50);
  const rate = 600; 
  const fcfaAmount = usdAmount * rate;

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif', color: '#000' }}>
      
      {/* Top Bar - Gemini Multimodal Active */}
      <nav style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F2F2F2' }}>
        <LayoutGrid size={24} />
        <div style={{ fontWeight: '900', letterSpacing: '3px', fontSize: '18px' }}>BUTTERTECH</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Camera size={24} color={gold} style={{ cursor: 'pointer' }} onClick={() => alert('Gemini OCR: Scan de facture activé')} />
          <Mic size={24} color={gold} style={{ cursor: 'pointer' }} onClick={() => alert('Gemini Voice: Écoute en cours...')} />
        </div>
      </nav>

      <main style={{ flex: 1, padding: '20px' }}>
        {/* Card Master - White/Black/Gold */}
        <div style={{ background: '#000', borderRadius: '30px', padding: '35px 25px', color: '#FFF', marginBottom: '30px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: gold, fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>DISPONIBLE</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <h2 style={{ fontSize: '32px', margin: 0 }}>${usdAmount.toLocaleString()}</h2>
                <span style={{ color: gold, fontSize: '16px', fontWeight: '300' }}>/ {fcfaAmount.toLocaleString()} FCFA</span>
              </div>
            </div>
            <Shield size={28} color={gold} />
          </div>
          <div style={{ marginTop: '25px', padding: '10px 15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '12px', color: '#AAA', border: '1px solid rgba(212,175,55,0.3)' }}>
            Hiflux Engine: <span style={{ color: gold }}>1 USD = 600 FCFA</span>
          </div>
        </div>

        {/* AI Orchestrator Input */}
        <div style={{ marginBottom: '35px', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Action AI (ex: Scanner cette facture...)"
            style={{ width: '100%', padding: '20px 20px', borderRadius: '20px', border: '1px solid #EEE', backgroundColor: '#FAFAFA', fontSize: '15px', outline: 'none' }}
          />
          <Zap size={20} color={gold} style={{ position: 'absolute', right: '20px', top: '20px' }} />
        </div>

        {/* Payment Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {/* Section Occident */}
          <button style={btnStyle}>
            <CreditCard size={22} color={gold} />
            <div style={btnTextContainer}>
              <span style={btnTitle}>Stripe & Apple Pay</span>
              <span style={btnSub}>Cartes de crédit</span>
            </div>
          </button>

          <button style={btnStyle}>
            <DollarSign size={22} color={gold} />
            <div style={btnTextContainer}>
              <span style={btnTitle}>PayPal & Interac</span>
              <span style={btnSub}>Canada & Int.</span>
            </div>
          </button>

          {/* Section Afrique - Marques Historiques */}
          <button style={{ ...btnStyle, gridColumn: 'span 2', background: '#000', color: '#FFF' }}>
            <Smartphone size={24} color={gold} />
            <div style={btnTextContainer}>
              <span style={{ ...btnTitle, color: gold }}>MOBILE MONEY</span>
              <span style={{ color: '#888', fontSize: '11px' }}>MTN • Orange • M-Pesa • Camtel</span>
            </div>
            <ArrowUpRight size={20} color={gold} style={{ marginLeft: 'auto' }} />
          </button>
        </div>
      </main>

      {/* Nav System */}
      <footer style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F2F2F2' }}>
        <LayoutGrid size={24} color={gold} />
        <div style={{ height: '4px', width: '60px', background: '#EEE', borderRadius: '10px', alignSelf: 'center' }}></div>
        <Search size={24} color="#CCC" />
      </footer>
    </div>
  );
}

const btnStyle = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '12px', 
  padding: '20px', 
  background: '#FFF', 
  border: '1px solid #EEE', 
  borderRadius: '24px', 
  textAlign: 'left',
  cursor: 'pointer'
};
const btnTextContainer = { display: 'flex', flexDirection: 'column' };
const btnTitle = { fontWeight: '700', fontSize: '14px' };
const btnSub = { fontSize: '11px', color: '#999' };
