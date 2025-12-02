'use client';

import { useCallback, useEffect, useState } from 'react';
import { SearchForm } from '@/components/search-form';
import { VideoResults } from '@/components/video-results';
import { ErrorDisplay } from '@/components/error-display';
import { SearchParams, SearchResponse } from '@/lib/types';
import { LogOut, UserRound, Youtube, Github, X, Loader2 } from 'lucide-react';

type SimpleUser = {
  id: string;
  email: string | null;
  user_metadata?: Record<string, unknown>;
};

type Provider = 'github' | 'google';

export default function Home() {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [providerLoading, setProviderLoading] = useState<Provider | null>(null);

  const fetchSession = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/session', { credentials: 'include' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '无法获取登录状态');
      }

      setUser(data.user);
    } catch (err: any) {
      setUser(null);
      setAuthError(err.message || '无法获取登录状态');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', params.q);
      queryParams.append('timeRange', params.timeRange);
      queryParams.append('limit', params.limit?.toString() || '10');
      queryParams.append('candidates', params.candidates?.toString() || '80');
      queryParams.append('safeSearch', params.safeSearch || 'moderate');

      if (params.start) queryParams.append('start', params.start);
      if (params.end) queryParams.append('end', params.end);
      if (params.regionCode) queryParams.append('regionCode', params.regionCode);

      const response = await fetch(`/api/search?${queryParams.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to search videos');
      }

      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
  };

  const handleLogin = async (provider: Provider = 'github') => {
    setAuthError(null);
    setAuthLoading(true);
    setProviderLoading(provider);
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || '无法生成登录链接');
      }

      window.location.href = data.url;
    } catch (err: any) {
      setAuthError(err.message || '登录失败');
      setAuthLoading(false);
      setProviderLoading(null);
    }
  };

  const handleLogout = async () => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      const res = await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '退出失败');
      }

      await fetchSession();
    } catch (err: any) {
      setAuthError(err.message || '退出失败');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-white via-white to-blue-50/40">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* 顶部导航，右侧增加登录按钮 */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800">
              <Youtube className="w-7 h-7 text-red-600" />
              <span className="text-lg font-semibold">YouTube Top Videos</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700">
              {user ? (
                <>
                  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm">
                    <UserRound className="h-4 w-4 text-slate-600" />
                    <span className="text-slate-800">{user.email || 'GitHub 用户'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={authLoading}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-slate-700 shadow-sm transition hover:-translate-y-[1px] hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
                  >
                    <LogOut className="h-4 w-4" />
                    退出
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  disabled={authLoading}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-slate-700 shadow-sm transition hover:-translate-y-[1px] hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
                >
                  <UserRound className="h-4 w-4" />
                  登录
                </button>
              )}
            </div>
          </div>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Youtube className="w-12 h-12 text-red-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
                YouTube Top Videos
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Search and discover the most viewed videos by keyword
            </p>

            {authError && (
              <p className="mt-2 text-sm text-destructive text-center">{authError}</p>
            )}
          </header>

          {/* Search Form */}
          <div className="mb-8" id="search">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-muted-foreground">Searching YouTube...</p>
            </div>
          )}

          {/* Error Display */}
          {error && !isLoading && (
            <ErrorDisplay error={error} onRetry={handleRetry} />
          )}

          {/* Results */}
          {results && !isLoading && !error && (
            <VideoResults results={results} />
          )}

          {/* Footer */}
          <footer className="mt-16 text-center text-sm text-muted-foreground border-t pt-8">
            <p>
              This application uses the{' '}
              <a
                href="https://developers.google.com/youtube/v3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                YouTube Data API v3
              </a>
              . Data is subject to YouTube's Terms of Service.
            </p>
            <p className="mt-2">
              By using this service, you agree to Google's{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </a>
              .
            </p>
          </footer>
        </div>
      </main>
      {showLoginModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowLoginModal(false)}
          />
          <div className="relative z-50 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">选择登录方式</h3>
                <p className="mt-1 text-sm text-slate-600">请选择第三方登录提供商</p>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => handleLogin('google')}
                disabled={authLoading}
                className="flex h-11 w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-800 shadow-sm transition hover:-translate-y-[1px] hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
              >
                {providerLoading === 'google' ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                    <span className="text-lg">G</span>
                  </span>
                )}
                {providerLoading === 'google'
                  ? '正在使用 Google 登录...'
                  : '使用 Google 登录'}
              </button>

              <button
                onClick={() => handleLogin('github')}
                disabled={authLoading}
                className="flex h-11 w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-slate-900 text-sm font-medium text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-slate-800 disabled:opacity-60"
              >
                {providerLoading === 'github' ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <Github className="h-5 w-5" />
                )}
                {providerLoading === 'github'
                  ? '正在使用 GitHub 登录...'
                  : '使用 GitHub 登录'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
