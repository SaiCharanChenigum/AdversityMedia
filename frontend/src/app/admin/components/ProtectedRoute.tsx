'use client';

import React, { useState, useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Check if the user is already authenticated
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('admin_authenticated', 'true');
        setIsAuthenticated(true);
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // While checking initial state, show nothing or a loader
  if (isAuthenticated === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If authenticated, render the protected page content
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated, render the lock screen
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      minHeight: '60vh'
    }}>
      <div style={{
        background: '#1a1d2e',
        border: '1px solid #2d3748',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: 'rgba(249, 115, 22, 0.1)',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto 24px auto'
        }}>
          <i className="fas fa-lock" style={{ fontSize: '24px', color: '#f97316' }}></i>
        </div>
        <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Admin Login</h2>
        <p style={{ color: '#a0aec0', fontSize: '14px', marginBottom: '32px' }}>Enter the password to access this page.</p>

        <form onSubmit={handleUnlock}>
          <div style={{ marginBottom: '24px', textAlign: 'left' }}>
            <label style={{ display: 'block', color: '#cbd5e0', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: '100%',
                background: '#0f1117',
                border: '1px solid #4a5568',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '15px',
                outline: 'none'
              }}
              required
            />
          </div>

          {error && (
            <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '16px', textAlign: 'left' }}>
              <i className="fas fa-exclamation-circle me-1"></i> {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isVerifying}
            style={{
              width: '100%',
              background: 'linear-gradient(90deg, #f97316 0%, #ea580c 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: isVerifying ? 'not-allowed' : 'pointer',
              opacity: isVerifying ? 0.7 : 1,
              transition: 'opacity 0.2s',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isVerifying ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <i className="fas fa-unlock"></i>
            )}
            {isVerifying ? 'Verifying...' : 'Unlock Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}
