import React, { useState, useRef } from 'react';
import * as Icons from 'lucide-react';

const gold = "#D4AF37";

const OPERATORS = [
  { id: 'mtn', name: 'MTN Mobile Money', country: 'CI • GH • CM • SN', color: '#FFCC00', prefix: '+225' },
  { id: 'orange', name: 'Orange Money', country: 'SN • ML • CI • BF', color: '#FF6600', prefix: '+221' },
  { id: 'mpesa', name: 'M-PESA', country: 'KE • TZ • RW • MZ', color: '#00A550', prefix: '+254' },
  { id: 'wave', name: 'Wave', country: 'SN • CI • ML • BF', color: '#0066FF', prefix: '+221' },
  { id: 'moov', name: 'Moov Money', country: 'BJ • TG • CI • NE', color: '#0033A0', prefix: '+229' },
];

const AMOUNTS = [500, 1000, 2500, 5000, 10000, 25000];

export default function EliteDashboard() {
  const [showPayModal, setShowPayModal] = useState(null);
  const [momoStep, setMomoStep] = useState(0);
  const [selectedOp, setSelectedOp] = useState(null);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [txRef, setTxRef] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [fixStatus, setFixStatus] = useState("DISCONNECTED");
  const videoRef = useRef(null);

  const connectFix = async () => {
    setFixStatus("CONNECTING...");
    try {
      const res = await fetch('/api/bridge-fix', { method: 'POST' });
      const data = await res.json();
      if (data.status === "CONNECTED") {
        setFixStatus("FIX 4.4 ACTIVE");
        if (window.speechSynthesis) window.speechSynthesis.speak(new SpeechSynthesisUtterance("Moteur FIX synchronisé"));
      }
    } catch { setFixStatus("DISCONNECTED"); }
  };

  const toggleCamera = async () => {
    setIsScanning(!isScanning);
    if (!isScanning) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch { setIsScanning(false); }
    }
  };

  const toggleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Non supporté sur ce navigateur");
    const rec = new SR();
    rec.lang = 'fr-FR';
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onresult = (e) => alert("Commande: " + e.results[0][0].transcript);
    rec.start();
  };

  const startMomo = () => {
    setSelectedOp(null); setPhone(''); setAmount(''); setPin(''); setTxRef(''); setMomoStep(1);
  };

  const handlePinPress = (val) => {
    if (val === 'del') { setPin(p => p.slice(0, -1)); }
    else if (pin.length < 4) { setPin(p => p + val); }
  };

  const executeTransaction = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2200));
    const ref = 'BTK-' + Date.now().toString(36).toUpperCase();
    setTxRef(ref);
    setProcessing(false);
    setMomoStep(6);
    if (window.speechSynthesis) window.speechSynthesis.speak(new SpeechSynthesisUtterance("Transaction Mobile Money confirmée. Référence " + ref));
  };

  const closeMomo = () => setMomoStep(0);
  const usd = amount ? (parseInt(amount) / 600).toFixed(2) : '0.00';

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', color: '#000', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', overflowX: 'hidden' }}>

      <div onClick={connectFix} style={{ background: fixStatus === "FIX 4.4 ACTIVE" ? "#00C853" : gold, color: '#000', padding: '10px', textAlign: 'center', fontSize: '11px', fontWeight: '900', cursor: 'pointer', letterSpacing: '2px' }}>
        {fixStatus}{fixStatus === "DISCONNECTED" && " — APPUYER POUR CONNECTER"}
      </div>

      <nav style={{ padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F0F0F0' }}>
        <Icons.LayoutGrid size={24} color="#000" />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '900', letterSpacing: '4px', fontSize: '15px' }}>BUTTERTECH</div>
          <div style={{ fontSize: '7px', color: gold, fontWeight: '800', letterSpacing: '1px' }}>NVIDIA INCEPTION PARTNER</div>
        </div>
        <div style={{ display: 'flex', gap: '18px' }}>
          <Icons.Camera size={24} color={isScanning ? gold : '#000'} onClick={toggleCamera} style={{ cursor: 'pointer' }} />
          <Icons.Mic size={24} color={isListening ? "#EF4444" : '#000'} onClick={toggleVoice} style={{ cursor: 'pointer' }} />
        </div>
      </nav>

      <main style={{ padding: '20px 25px' }}>
        <div style={{ background: '#000', borderRadius: '28px', padding: '35px 28px', color: '#FFF', marginBottom: '20px', border: `1.5px solid ${gold}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', border: `1px solid rgba(212,175,55,0.15)` }} />
          <p style={{ color: gold, fontSize: '9px', fontWeight: '800', letterSpacing: '2px', marginBottom: 8 }}>GLOBAL ASSET VALUE</p>
          <h2 style={{ fontSize: '40px', margin: '0 0 6px', fontWeight: '900', letterSpacing: '-1px' }}>$2,540.50</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ opacity: 0.5, fontSize: '13px' }}>1,524,300 FCFA</span>
            <Icons.ShieldCheck size={18} color={gold} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <button onClick={() => setShowPayModal('STRIPE / VISA')} style={btnStyle}>
            <Icons.CreditCard size={20} color={gold} />
            <span style={btnLabel}>STRIPE</span>
          </button>
          <button onClick={() => setShowPayModal('PAYPAL')} style={btnStyle}>
            <Icons.Globe size={20} color={gold} />
            <span style={btnLabel}>PAYPAL</span>
          </button>
        </div>

        <button onClick={() => setShowPayModal('APPLE PAY')} style={{ ...btnStyle, flexDirection: 'row', justifyContent: 'center', gap: '10px', width: '100%', marginBottom: '12px' }}>
          <Icons.Apple size={20} color={gold} />
          <span style={btnLabel}>APPLE PAY</span>
        </button>

        <button onClick={startMomo} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px', background: '#000', borderRadius: '28px', cursor: 'pointer', border: `1.5px solid ${gold}`, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: gold, borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icons.Smartphone size={22} color="#000" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '900', color: gold, fontSize: '14px', letterSpacing: '1px' }}>AFRICA MOBILE MONEY</div>
              <div style={{ fontSize: '10px', color: '#888', marginTop: 2 }}>MTN • ORANGE • M-PESA • WAVE • MOOV</div>
            </div>
          </div>
          <Icons.ArrowRightCircle size={22} color={gold} />
        </button>

        <div style={{ marginTop: '28px' }}>
          <p style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '2px', color: '#999', marginBottom: '14px' }}>TRANSACTIONS RÉCENTES</p>
          {[
            { label: 'MTN Mobile Money', sub: 'Dakar → Abidjan', val: '-12,500 FCFA' },
            { label: 'Orange Money', sub: 'Bamako → Ouagadougou', val: '-8,000 FCFA' },
            { label: 'M-PESA', sub: 'Nairobi → Dar es Salaam', val: '-15,000 KES' },
          ].map((tx, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #F5F5F5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F8F8F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.Smartphone size={16} color={gold} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '13px' }}>{tx.label}</div>
                  <div style={{ fontSize: '10px', color: '#999' }}>{tx.sub}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '800', fontSize: '13px', color: '#EF4444' }}>{tx.val}</div>
                <div style={{ fontSize: '9px', color: '#4ade80', fontWeight: '700' }}>✓ CONFIRMÉ</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isScanning && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 1000 }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button onClick={() => setIsScanning(false)} style={{ position: 'absolute', top: 40, right: 20, background: 'none', border: 'none', cursor: 'pointer' }}>
            <Icons.XCircle size={40} color="#FFF" />
          </button>
          <div style={{ position: 'absolute', bottom: 50, width: '100%', textAlign: 'center', color: gold, fontWeight: '800', fontSize: '13px', letterSpacing: '2px' }}>SCANNER LOGO POUR AUTO-PAY</div>
        </div>
      )}

      {showPayModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 2000, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ background: '#FFF', width: '100%', padding: '40px 30px', borderTopLeftRadius: '40px', borderTopRightRadius: '40px' }}>
            <h3 style={{ fontWeight: '900', marginBottom: '8px', fontSize: '18px' }}>CONFIRMER {showPayModal}</h3>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '30px' }}>Protocole FIX 4.4 & NVIDIA Inception Security actif.</p>
            <button onClick={() => setShowPayModal(null)} style={{ width: '100%', padding: '20px', background: '#000', color: gold, borderRadius: '20px', fontWeight: '900', border: 'none', fontSize: '14px', letterSpacing: '2px', cursor: 'pointer' }}>EXECUTER L'ORDRE</button>
            <button onClick={() => setShowPayModal(null)} style={{ width: '100%', padding: '14px', background: 'none', border: 'none', color: '#999', fontSize: '13px', cursor: 'pointer', marginTop: '10px' }}>Annuler</button>
          </div>
        </div>
      )}

      {momoStep === 1 && (
        <MomoSheet onClose={closeMomo} title="CHOISIR L'OPÉRATEUR">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {OPERATORS.map(op => (
              <button key={op.id} onClick={() => { setSelectedOp(op); setMomoStep(2); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '15px', padding: '18px 20px', background: '#F8F8F8', border: 'none', borderRadius: '16px', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: op.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.Smartphone size={18} color="#FFF" />
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '14px' }}>{op.name}</div>
                  <div style={{ fontSize: '10px', color: '#999', marginTop: 2 }}>{op.country}</div>
                </div>
                <Icons.ChevronRight size={16} color="#CCC" style={{ marginLeft: 'auto' }} />
              </button>
            ))}
          </div>
        </MomoSheet>
      )}

      {momoStep === 2 && selectedOp && (
        <MomoSheet onClose={closeMomo} title={`NUMÉRO ${selectedOp.name.toUpperCase()}`}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F8F8F8', borderRadius: '16px', padding: '16px 18px', border: `1.5px solid ${phone.length > 5 ? gold : '#EEE'}` }}>
              <span style={{ fontWeight: '700', color: '#999', fontSize: '14px' }}>{selectedOp.prefix}</span>
              <input type="tel" placeholder="XX XXX XX XX" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} style={{ border: 'none', background: 'none', fontSize: '18px', fontWeight: '700', flex: 1, outline: 'none', letterSpacing: '2px' }} autoFocus />
            </div>
            <p style={{ fontSize: '10px', color: '#999', marginTop: '8px', paddingLeft: '4px' }}>Entrez le numéro du bénéficiaire</p>
          </div>
          <ActionBtn disabled={phone.length < 8} onClick={() => setMomoStep(3)} label="CONTINUER →" />
          <BackBtn onClick={() => setMomoStep(1)} />
        </MomoSheet>
      )}

      {momoStep === 3 && (
        <MomoSheet onClose={closeMomo} title="MONTANT À ENVOYER">
          <div style={{ marginBottom: '16px' }}>
            <div style={{ background: '#F8F8F8', borderRadius: '16px', padding: '20px', border: `1.5px solid ${amount ? gold : '#EEE'}`, textAlign: 'center', marginBottom: '12px' }}>
              <input type="number" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} style={{ border: 'none', background: 'none', fontSize: '32px', fontWeight: '900', width: '100%', textAlign: 'center', outline: 'none', color: '#000' }} autoFocus />
              <div style={{ fontSize: '11px', color: '#999', fontWeight: '700', letterSpacing: '1px' }}>FCFA</div>
            </div>
            {amount && (
              <div style={{ background: '#000', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#888', fontSize: '11px' }}>Équivalent USD</span>
                <span style={{ color: gold, fontWeight: '900', fontSize: '15px' }}>${usd}</span>
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
            {AMOUNTS.map(a => (
              <button key={a} onClick={() => setAmount(String(a))} style={{ padding: '12px 6px', background: amount === String(a) ? '#000' : '#F8F8F8', color: amount === String(a) ? gold : '#000', border: amount === String(a) ? `1px solid ${gold}` : '1px solid #EEE', borderRadius: '12px', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}>
                {a.toLocaleString()}
              </button>
            ))}
          </div>
          <ActionBtn disabled={!amount || parseInt(amount) < 100} onClick={() => setMomoStep(4)} label="CONTINUER →" />
          <BackBtn onClick={() => setMomoStep(2)} />
        </MomoSheet>
      )}

      {momoStep === 4 && (
        <MomoSheet onClose={closeMomo} title="CODE PIN MOBILE MONEY">
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <p style={{ fontSize: '12px', color: '#999', marginBottom: '20px' }}>Entrez votre code PIN {selectedOp?.name}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '8px' }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{ width: 50, height: 50, borderRadius: '50%', border: `2px solid ${pin.length > i ? gold : '#E0E0E0'}`, background: pin.length > i ? gold : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', transition: 'all 0.2s' }}>
                  {pin.length > i ? '●' : ''}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
            {['1','2','3','4','5','6','7','8','9','','0','del'].map((k, i) => (
              <button key={i} onClick={() => k && handlePinPress(k)} style={{ padding: '18px', background: k === '' ? 'transparent' : '#F8F8F8', border: 'none', borderRadius: '14px', fontSize: k === 'del' ? '14px' : '20px', fontWeight: '700', cursor: k ? 'pointer' : 'default', color: k === 'del' ? '#999' : '#000' }}>
                {k === 'del' ? '⌫' : k}
              </button>
            ))}
          </div>
          <ActionBtn disabled={pin.length < 4} onClick={() => setMomoStep(5)} label="VALIDER →" />
          <BackBtn onClick={() => setMomoStep(3)} />
        </MomoSheet>
      )}

      {momoStep === 5 && selectedOp && (
        <MomoSheet onClose={closeMomo} title="CONFIRMER LA TRANSACTION">
          <div style={{ background: '#F8F8F8', borderRadius: '20px', padding: '24px', marginBottom: '20px' }}>
            {[
              { label: 'Opérateur', val: selectedOp.name },
              { label: 'Bénéficiaire', val: `${selectedOp.prefix} ${phone}` },
              { label: 'Montant', val: `${parseInt(amount).toLocaleString('fr-FR')} FCFA` },
              { label: 'Équivalent', val: `$${usd} USD` },
              { label: 'Protocole', val: 'FIX 4.4 · NVIDIA Security' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? '1px solid #ECECEC' : 'none' }}>
                <span style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>{row.label}</span>
                <span style={{ fontSize: '13px', fontWeight: '800' }}>{row.val}</span>
              </div>
            ))}
          </div>
          <ActionBtn disabled={processing} onClick={executeTransaction} label={processing ? "TRAITEMENT EN COURS..." : "EXECUTER LA TRANSACTION →"} />
          {processing && (
            <div style={{ textAlign: 'center', marginTop: '14px' }}>
              <div style={{ width: '100%', height: '3px', background: '#F0F0F0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: gold, borderRadius: '4px', animation: 'progress 2.2s linear forwards' }} />
              </div>
              <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
            </div>
          )}
          <BackBtn onClick={() => setMomoStep(4)} />
        </MomoSheet>
      )}

      {momoStep === 6 && (
        <MomoSheet onClose={closeMomo} title="">
          <div style={{ textAlign: 'center', paddingTop: '10px' }}>
            <div style={{ width: 80, height: 80, background: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Icons.CheckCircle size={40} color={gold} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '8px' }}>TRANSACTION CONFIRMÉE</h3>
            <p style={{ fontSize: '12px', color: '#999', marginBottom: '20px' }}>Transfert Mobile Money exécuté via protocole FIX 4.4.</p>
            <div style={{ background: '#F8F8F8', borderRadius: '16px', padding: '16px', marginBottom: '24px' }}>
              <p style={{ fontSize: '10px', color: '#999', marginBottom: '4px', letterSpacing: '1px' }}>RÉFÉRENCE TRANSACTION</p>
              <p style={{ fontSize: '16px', fontWeight: '900', color: gold, letterSpacing: '2px' }}>{txRef}</p>
            </div>
            <div style={{ background: '#000', borderRadius: '16px', padding: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>MONTANT ENVOYÉ</p>
                <p style={{ fontSize: '20px', fontWeight: '900', color: gold }}>{parseInt(amount).toLocaleString('fr-FR')} FCFA</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>OPÉRATEUR</p>
                <p style={{ fontSize: '13px', fontWeight: '800', color: '#FFF' }}>{selectedOp?.name}</p>
              </div>
            </div>
            <ActionBtn disabled={false} onClick={closeMomo} label="FERMER" />
          </div>
        </MomoSheet>
      )}

    </div>
  );
}

function MomoSheet({ children, title, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 3000, display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ background: '#FFF', width: '100%', padding: '32px 28px 48px', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', maxHeight: '92vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          {title && <h3 style={{ fontWeight: '900', fontSize: '16px', letterSpacing: '1px' }}>{title}</h3>}
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}>
            <Icons.X size={22} color="#999" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ActionBtn({ onClick, disabled, label }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: '100%', padding: '20px', background: disabled ? '#F0F0F0' : '#000', color: disabled ? '#CCC' : gold, borderRadius: '20px', fontWeight: '900', border: 'none', fontSize: '13px', letterSpacing: '2px', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
      {label}
    </button>
  );
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ width: '100%', padding: '14px', background: 'none', border: 'none', color: '#999', fontSize: '13px', cursor: 'pointer', marginTop: '10px' }}>
      ← Retour
    </button>
  );
}

const btnStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px', background: '#FFF', border: '1px solid #EEEEEE', borderRadius: '24px', cursor: 'pointer', width: '100%' };
const btnLabel = { fontWeight: '800', fontSize: '11px', letterSpacing: '1px', color: '#000' };
