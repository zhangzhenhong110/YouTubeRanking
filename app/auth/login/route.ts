import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type Provider = 'github' | 'google';

export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  const supabase = await createClient();

  // 允许前端指定登录方式，默认为 GitHub
  let provider: Provider = 'github';
  try {
    const body = await request.json();
    if (body?.provider === 'google' || body?.provider === 'github') {
      provider = body.provider;
    }
  } catch {
    // ignore parse errors; fall back to default provider
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    return NextResponse.json(
      { error: error?.message || '无法生成登录链接' },
      { status: 400 }
    );
  }

  return NextResponse.json({ url: data.url });
}
