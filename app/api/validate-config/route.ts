import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    nodeEnv: process.env.NODE_ENV,
  };

  const allValid = checks.supabaseUrl && checks.supabaseAnonKey && checks.supabaseServiceKey;

  return NextResponse.json({
    status: allValid ? 'OK' : 'MISSING_CONFIG',
    checks,
    message: allValid 
      ? 'All environment variables are configured correctly!'
      : 'Missing environment variables. Please check MOBILE_DEPLOYMENT.md',
  });
}
