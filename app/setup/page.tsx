'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

export default function SetupPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const initializeDatabase = async () => {
    setLoading(true);
    setStatus('Initializing database...');
    try {
      const response = await fetch('/api/setup', { method: 'POST' });
      const data = await response.json();
      
      if (response.ok) {
        setStatus('✓ Database initialized successfully!');
      } else {
        setStatus(`✗ Error: ${data.error}`);
      }
    } catch (error) {
      setStatus(`✗ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 bg-gradient-to-br from-[#fce4ec] via-background to-[#e3f2fd]">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-primary/10 rounded-full">
            <Heart className="w-12 h-12 text-primary fill-primary" />
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Mood Signal</h1>
          <p className="text-muted-foreground">Setup & Verification</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-border space-y-4">
          <button
            onClick={initializeDatabase}
            disabled={loading}
            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground disabled:text-muted-foreground font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {loading ? 'Initializing...' : 'Initialize Database'}
          </button>

          {status && (
            <div className={`p-4 rounded-lg text-sm font-medium ${
              status.startsWith('✓') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {status}
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-2">
          <p>This page initializes the Supabase database.</p>
          <p>Once complete, you can proceed to the main app.</p>
          <a href="/" className="text-primary hover:underline block">
            Go to app →
          </a>
        </div>
      </div>
    </div>
  );
}
