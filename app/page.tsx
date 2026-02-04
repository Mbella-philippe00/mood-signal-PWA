'use client';

import { useState, useEffect } from 'react';
import { LoginScreen } from '@/components/login-screen';
import { PartnerDashboardScreen } from '@/components/partner-dashboard-screen';
import { SendMoodScreen } from '@/components/send-mood-screen';
import { HistoryScreen } from '@/components/history-screen';
import { useAuth } from '@/components/auth-context';

type Screen = 'login' | 'dashboard' | 'send' | 'history';

export default function Home() {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [coupleId, setCoupleId] = useState<string | undefined>();

  useEffect(() => {
    if (user) {
      setCurrentScreen('dashboard');
    } else if (!loading) {
      setCurrentScreen('login');
    }
  }, [user, loading]);

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleBack = () => {
    setCurrentScreen('dashboard');
  };

  if (loading) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-hidden">
      {currentScreen === 'login' && !user && (
        <LoginScreen onLogin={() => setCurrentScreen('dashboard')} />
      )}

      {currentScreen === 'dashboard' && user && (
        <PartnerDashboardScreen onNavigate={handleNavigate} onCoupleSelect={setCoupleId} />
      )}

      {currentScreen === 'send' && user && (
        <SendMoodScreen onBack={handleBack} coupleId={coupleId} />
      )}

      {currentScreen === 'history' && user && (
        <HistoryScreen onBack={handleBack} coupleId={coupleId} />
      )}
    </main>
  );
}
