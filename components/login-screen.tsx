'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from './auth-context';

type LoginMode = 'choice' | 'signup' | 'signin';

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const { signUp, signIn } = useAuth();
  const [mode, setMode] = useState<LoginMode>('choice');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUp(email, password, username, displayName);
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'choice') {
    return (
      <div className="flex flex-col h-screen w-full justify-center items-center px-6 pb-8 pt-8 bg-gradient-to-br from-[#fce4ec] via-background to-[#e3f2fd]">
        <div className="w-full max-w-sm space-y-2 text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Heart className="w-8 h-8 text-primary fill-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-foreground text-balance">
            Mood Signal
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A simple way to share how you feel
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={() => setMode('signup')}
            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors"
          >
            Create Account
          </button>
          <button
            onClick={() => setMode('signin')}
            className="w-full py-3 px-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8 max-w-xs">
          Connect with your partner to share moods and be there for each other.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full justify-center items-center px-6 pb-8 pt-8 bg-gradient-to-br from-[#fce4ec] via-background to-[#e3f2fd]">
      <button
        onClick={() => setMode('choice')}
        className="absolute top-6 left-6 text-muted-foreground hover:text-foreground"
      >
        ← Back
      </button>

      <div className="w-full max-w-sm space-y-2 text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground">
          {mode === 'signup' ? 'Create Account' : 'Sign In'}
        </h2>
      </div>

      <form
        onSubmit={mode === 'signup' ? handleSignUp : handleSignIn}
        className="w-full max-w-sm space-y-4"
      >
        {error && (
          <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        {mode === 'signup' && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_username"
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
