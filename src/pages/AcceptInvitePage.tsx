import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

type PageState = 'loading' | 'set-password' | 'success' | 'error';

export default function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    if (!tokenHash || type !== 'invite') {
      setPageState('error');
      return;
    }

    supabase.auth
      .verifyOtp({ token_hash: tokenHash, type: 'invite' })
      .then(({ error }) => {
        if (error) {
          setPageState('error');
        } else {
          setPageState('set-password');
        }
      });
  }, [searchParams]);

  const validate = (): string[] => {
    const errs: string[] = [];
    if (password.length < 8) errs.push('Password must be at least 8 characters');
    if (password !== confirmPassword) errs.push('Passwords do not match');
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (errs.length > 0) return;

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setErrors([error.message]);
      return;
    }

    await supabase.auth.signOut();
    setPageState('success');
  };

  return (
    <div className="min-h-screen bg-tavazi-dark flex items-center justify-center px-6">
      <div className="w-full max-w-[480px] bg-tavazi-charcoal border border-tavazi-navy/20 rounded-xl p-10">
        <div className="flex justify-center mb-8">
          <img
            src="/assets/tavazi-logo.png"
            alt="Tavazi"
            className="h-12"
          />
        </div>

        {pageState === 'loading' && <LoadingState />}
        {pageState === 'set-password' && (
          <SetPasswordState
            password={password}
            confirmPassword={confirmPassword}
            showPassword={showPassword}
            showConfirm={showConfirm}
            errors={errors}
            submitting={submitting}
            onPasswordChange={setPassword}
            onConfirmChange={setConfirmPassword}
            onTogglePassword={() => setShowPassword((p) => !p)}
            onToggleConfirm={() => setShowConfirm((p) => !p)}
            onSubmit={handleSubmit}
          />
        )}
        {pageState === 'success' && (
          <SuccessState onNavigate={() => navigate('/login')} />
        )}
        {pageState === 'error' && <ErrorState />}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="text-center space-y-4">
      <Loader2 className="w-8 h-8 text-tavazi-navy animate-spin mx-auto" />
      <p className="text-cream/80 font-body">Verifying your invitation...</p>
    </div>
  );
}

interface SetPasswordProps {
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirm: boolean;
  errors: string[];
  submitting: boolean;
  onPasswordChange: (v: string) => void;
  onConfirmChange: (v: string) => void;
  onTogglePassword: () => void;
  onToggleConfirm: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

function SetPasswordState({
  password,
  confirmPassword,
  showPassword,
  showConfirm,
  errors,
  submitting,
  onPasswordChange,
  onConfirmChange,
  onTogglePassword,
  onToggleConfirm,
  onSubmit,
}: SetPasswordProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-display text-2xl text-cream">Welcome to Tavazi</h2>
        <p className="text-cream/80 font-body text-sm leading-relaxed">
          You have been invited to the Tavazi Creator Portal. Set your password below to access your dashboard.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-cream/60 mb-2">
            Choose a password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-4 py-3 pr-11 bg-tavazi-slate border border-tavazi-navy/20 rounded-lg text-cream placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-tavazi-navy/50 transition-all"
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-semibold text-cream/60 mb-2">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => onConfirmChange(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full px-4 py-3 pr-11 bg-tavazi-slate border border-tavazi-navy/20 rounded-lg text-cream placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-tavazi-navy/50 transition-all"
            />
            <button
              type="button"
              onClick={onToggleConfirm}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60 transition-colors"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-lg px-4 py-3 space-y-1">
            {errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-tavazi-navy text-tavazi-dark font-semibold rounded-lg transition-all duration-300 hover:bg-[#339AF0] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Activating...
            </>
          ) : (
            'Activate My Account'
          )}
        </button>
      </form>
    </div>
  );
}

function SuccessState({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="text-center space-y-5">
      <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
      <h2 className="font-display text-2xl text-cream">You're all set!</h2>
      <p className="text-cream/80 font-body text-sm leading-relaxed">
        Your Tavazi creator account is active. You can now log in to view your analytics and earnings.
      </p>
      <button
        onClick={onNavigate}
        className="w-full py-3 bg-tavazi-navy text-tavazi-dark font-semibold rounded-lg transition-all duration-300 hover:bg-[#339AF0]"
      >
        Go to Dashboard
      </button>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="text-center space-y-5">
      <AlertTriangle className="w-12 h-12 text-warning mx-auto" />
      <h2 className="font-display text-2xl text-cream">This invite link has expired</h2>
      <p className="text-cream/80 font-body text-sm leading-relaxed">
        Invite links expire after 24 hours. Please contact your Tavazi account manager to receive a new invitation.
      </p>
      <a
        href="mailto:hello@tavazi.tv"
        className="inline-block text-tavazi-navy hover:text-[#339AF0] font-semibold transition-colors"
      >
        hello@tavazi.tv
      </a>
    </div>
  );
}
