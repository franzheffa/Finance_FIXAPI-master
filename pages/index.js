import React, { useState } from 'react';
import { Smartphone, Globe, Shield, Zap, ArrowUpRight } from 'lucide-react';

export default function MobileFirstDashboard() {
  const gold = "#D4AF37";
  const [loading, setLoading] = useState(false);

  const handlePayment = async (type) => {
    setLoading(true);
    // Logique d'appel API vers Stripe ou Mobile Money
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      {/* Header Statut AI */}
      <header style={{ padding: '20px', borderBottom: '1px solid #F2F2F2', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: gold, fontWeight: 'bold', letterSpacing: '2px' }}>AI ORCHESTRATOR ACTIVE</div>
        <h1 style={{ fontSize: '20px', margin: '5px 0', fontWeight: '900' }}>BUTTERTECH UI</h1>
      </header>

      {/* Main Wallet Card - Style Material Design */}
      <main style={{ flex: 1, padding: '20px' }}>
        <div style={{ background: '#000', borderRadius: '24px', padding: '30px', color: '#FFF', marginBottom: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <p style={{ color: gold, fontSize: '14px', marginBottom: '10px' }}>Digital Balance</p>
          <h2 style={{ fontSize: '36px', margin: 0 }}>1,250.00 <span style={{ color: gold, fontSize: '18px' }}>Ui</span></h2>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <div style={{ background: 'rgba(212,175,55,0.2)', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', color: gold }}>Secure FIX 4.4 Bridge</div>
          </div>
        </div>

        {/* Quick Actions - Mobile First */}
        <section>
          <h3 style={{ fontSize: '14px', color: '#999', marginBottom: '15px', textTransform: 'uppercase' }}>Services Intemporels</h3>
          
          {/* Apple Pay / Stripe */}
          <button 
            onClick={() => handlePayment('stripe')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: '#FAFAFA', border: '1px solid #EEE', borderRadius: '16px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Zap color={gold} fill={gold} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold' }}>Stripe & Apple Pay</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Europe, USA, Canada</div>
              </div>
            </div>
            <ArrowUpRight size={18} color={gold} />
          </button>

          {/* Mobile Money */}
          <button 
            onClick={() => handlePayment('momo')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: '#FAFAFA', border: '1px solid #EEE', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Smartphone color="#000" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold' }}>Mobile Money Africa</div>
                <div style={{ fontSize: '12px', color: '#666' }}>MTN, Orange, M-Pesa</div>
              </div>
            </div>
            <ArrowUpRight size={18} color={gold} />
          </button>
        </section>
      </main>

      {/* Navigation Footer */}
      <footer style={{ padding: '20px', borderTop: '1px solid #F2F2F2', display: 'flex', justifyContent: 'space-around', backgroundColor: '#FFF' }}>
        <Shield color={gold} />
        <Globe color="#DDD" />
        <div style={{ width: '24px', height: '24px', background: '#000', borderRadius: '50%' }}></div>
      </footer>
    </div>
  );
}
