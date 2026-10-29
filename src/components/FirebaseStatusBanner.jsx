import { useState, useEffect } from 'react';
import { AlertTriangle, Copy, Check, X, ShieldAlert, ExternalLink } from 'lucide-react';
import { subscribeFirebaseStatus } from '../services/dataService';
import Modal from './Modal';

const FirebaseStatusBanner = () => {
  const [status, setStatus] = useState({ permissionDenied: false });
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeFirebaseStatus((newStatus) => {
      setStatus(newStatus);
    });
    return () => unsubscribe();
  }, []);

  const firestoreRulesSnippet = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(firestoreRulesSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!status.permissionDenied || dismissed) {
    return null;
  }

  return (
    <>
      <div 
        style={{
          background: 'linear-gradient(90deg, rgba(234, 179, 8, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%)',
          borderBottom: '1px solid rgba(234, 179, 8, 0.3)',
          color: '#fbbf24',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.875rem',
          gap: '12px',
          zIndex: 90
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <AlertTriangle size={18} style={{ color: '#fbbf24', flexShrink: 0 }} />
          <span>
            <strong>Firebase Firestore Permissions Notice:</strong> Cloud access was denied (permission error). 
            Showing all <strong>16 Tamil Nadu districts</strong> in offline fallback mode.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: 'rgba(234, 179, 8, 0.2)',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              color: '#fef08a',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Fix Cloud Rules
          </button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fbbf24',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px'
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Enable Live Cloud Sync in Firebase"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fbbf24' }}>
            <ShieldAlert size={24} />
            <span style={{ fontWeight: 600 }}>Why are districts / cloud sync locked?</span>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Firestore test security rules expired on your Firebase project (<code>tnstc-smart-transit</code>), causing queries to return <em>"Missing or insufficient permissions"</em>.
          </p>

          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            <strong>How to resolve in 3 steps:</strong>
            <ol style={{ paddingLeft: '20px', marginTop: '8px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              <li>
                Open the <a href="https://console.firebase.google.com/project/tnstc-smart-transit/firestore/rules" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
                  Firebase Console Rules Tab <ExternalLink size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </a>
              </li>
              <li>Replace the existing rules with the snippet below:</li>
            </ol>
          </div>

          <div style={{ position: 'relative' }}>
            <pre style={{
              background: 'var(--bg-tertiary)',
              padding: '14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              overflowX: 'auto',
              border: '1px solid var(--border-color)',
              color: '#38bdf8',
              margin: 0
            }}>
              {firestoreRulesSnippet}
            </pre>
            <button
              onClick={handleCopy}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            3. Click <strong>Publish</strong>. All updates and fleets will immediately sync in real-time across devices!
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(false)}
            >
              Got it, Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FirebaseStatusBanner;
