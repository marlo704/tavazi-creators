import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const { signIn, resetPassword } = useAuth();
  const { creatorProfile, profileError, loading: authLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || !creatorProfile) return;
    if (creatorProfile.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  }, [creatorProfile, authLoading, navigate]);

  useEffect(() => {
    if (profileError && loading) {
      setError(profileError);
      setLoading(false);
    }
  }, [profileError, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await signIn(email, password);
    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    const { error: resetError } = await resetPassword(resetEmail);
    setResetLoading(false);
    if (resetError) {
      toast.error(resetError.message);
    } else {
      toast.success('Check your inbox for a password reset link.');
      setShowForgot(false);
      setResetEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-tavazi-dark flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-tavazi-charcoal border border-tavazi-navy/20 rounded-xl p-8">
        <div className="text-center mb-8">
          <img
            src="/assets/tavazi-logo.png"
            alt="Tavazi"
            className="max-h-[60px] mx-auto mb-6"
          />
          <h2 className="font-display text-2xl text-cream">
            {showForgot ? 'Reset your password' : 'Sign in to your creator portal'}
          </h2>
        </div>

        {showForgot ? (
          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-semibold text-cream/60 mb-2">
                Email address
              </label>
              <input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-tavazi-slate border border-tavazi-navy/20 rounded-lg text-cream placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-tavazi-navy/50 transition-all"
                placeholder="creator@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={resetLoading}
              className="w-full py-3 bg-tavazi-navy text-tavazi-dark font-semibold rounded-lg transition-all duration-300 hover:bg-[#339AF0] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resetLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button
              type="button"
              onClick={() => setShowForgot(false)}
              className="w-full text-sm text-cream/40 hover:text-cream/60 transition-colors"
            >
              Back to sign in
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-cream/60 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-tavazi-slate border border-tavazi-navy/20 rounded-lg text-cream placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-tavazi-navy/50 transition-all"
                  placeholder="creator@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-cream/60 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-tavazi-slate border border-tavazi-navy/20 rounded-lg text-cream placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-tavazi-navy/50 transition-all"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-tavazi-navy text-tavazi-dark font-semibold rounded-lg transition-all duration-300 hover:bg-[#339AF0] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm">
              <button
                onClick={() => setShowForgot(true)}
                className="text-cream/40 hover:text-cream/60 transition-colors"
              >
                Forgot password?
              </button>
              <Link to="/" className="text-gold-accent hover:text-gold-accent/80 transition-colors">
                Not a creator yet? Apply to join &rarr;
              </Link>
            </div>
            <div className="mt-3 text-center">
              <Link to="/demo" className="text-xs text-cream/[0.7] hover:text-cream/90 transition-colors">
                View Demo Dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
