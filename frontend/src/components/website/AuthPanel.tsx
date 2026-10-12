import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { isAxiosError } from 'axios';
import { Eye, EyeOff, Loader2, Mail, X } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import type { ApiErrorResponse } from '../../types';
import type { LoginPayload ,AuthPanelProps, SignupForm } from '@/types/website';


function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const message = error.response?.data?.message;
    return Array.isArray(message) ? message.join(', ') : message || fallback;
  }
  return fallback;
}

export function AuthPanel({
  mode,
  notice = '',
  resetToken = '',
  onModeChange,
  onClose,
}: AuthPanelProps) {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState<LoginPayload>({ username: '', password: '' });
  const [signup, setSignup] = useState<SignupForm>({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(notice);
  const [loading, setLoading] = useState(false);
  const [requestResetToken, setRequestResetToken] = useState(resetToken);

  useEffect(() => {
    setError('');
    setSuccess(notice);
    setRequestResetToken(resetToken);
  }, [mode, notice, resetToken]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const response = await authService.login(credentials);
        login(response.token, response.user);
        window.location.assign('/dashboard');
        return;
      }

      if (mode === 'signup') {
        if (signup.password !== signup.confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        if (signup.password.length < 6) {
          setError('Password must be at least 6 characters.');
          return;
        }
        await authService.signup({
          name: signup.name,
          username: signup.username,
          email: signup.email,
          password: signup.password,
        });
        setSuccess('Account created. Sign in to open your workspace.');
        onModeChange('login');
        return;
      }

      if (mode === 'forgot') {
        const response = await authService.forgotPassword(email);
        setSuccess(response.message || 'Check your email for a password reset link.');
        if (response.resetToken) {
          setRequestResetToken(response.resetToken);
        }
        return;
      }

      if (!requestResetToken) {
        setError('This reset link is missing or expired. Request a new one.');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      await authService.resetPassword(requestResetToken, newPassword);
      setSuccess('Password updated. You can now sign in.');
      onModeChange('login');
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Something went wrong. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const title = mode === 'login'
    ? 'Welcome back'
    : mode === 'signup'
      ? 'Create your workspace'
      : mode === 'forgot'
        ? 'Recover your account'
        : 'Set a new password';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 px-4 py-8" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-yellow-700">MaizeTrack AI</p>
            <h2 id="auth-title" className="mt-1 text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && <div className="mt-5 rounded-md border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {success && <div className="mt-5 rounded-md border-l-4 border-green-500 bg-green-50 p-3 text-sm text-green-700">{success}</div>}

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === 'signup' && (
            <>
              <Field label="Full name" value={signup.name} onChange={(value) => setSignup({ ...signup, name: value })} />
              <Field label="Username" value={signup.username} onChange={(value) => setSignup({ ...signup, username: value })} />
              <Field label="Email" type="email" value={signup.email} onChange={(value) => setSignup({ ...signup, email: value })} />
              <PasswordField label="Password" value={signup.password} show={showPassword} onToggle={() => setShowPassword(!showPassword)} onChange={(value) => setSignup({ ...signup, password: value })} />
              <PasswordField label="Confirm password" value={signup.confirmPassword} show={showPassword} onToggle={() => setShowPassword(!showPassword)} onChange={(value) => setSignup({ ...signup, confirmPassword: value })} />
            </>
          )}

          {mode === 'login' && (
            <>
              <Field label="Username" value={credentials.username} onChange={(value) => setCredentials({ ...credentials, username: value })} />
              <PasswordField label="Password" value={credentials.password} show={showPassword} onToggle={() => setShowPassword(!showPassword)} onChange={(value) => setCredentials({ ...credentials, password: value })} />
            </>
          )}

          {mode === 'forgot' && <Field label="Email address" type="email" value={email} onChange={setEmail} icon={<Mail className="h-4 w-4" />} />}

          {mode === 'reset' && (
            <>
              <PasswordField label="New password" value={newPassword} show={showPassword} onToggle={() => setShowPassword(!showPassword)} onChange={setNewPassword} />
              <PasswordField label="Confirm new password" value={confirmNewPassword} show={showPassword} onToggle={() => setShowPassword(!showPassword)} onChange={setConfirmNewPassword} />
            </>
          )}

          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-md bg-yellow-600 px-4 py-3 font-semibold text-white transition hover:bg-yellow-700 disabled:bg-yellow-400">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : mode === 'forgot' ? 'Send reset link' : 'Update password'}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm text-gray-600">
          {mode === 'login' && <><span>New to MaizeTrack?</span><button type="button" onClick={() => onModeChange('signup')} className="font-semibold text-yellow-700 hover:text-yellow-800">Create an account</button><button type="button" onClick={() => onModeChange('forgot')} className="basis-full font-medium text-yellow-700 hover:text-yellow-800">Forgot password?</button></>}
          {mode === 'signup' && <><span>Already have an account?</span><button type="button" onClick={() => onModeChange('login')} className="font-semibold text-yellow-700 hover:text-yellow-800">Sign in</button></>}
          {mode === 'forgot' && <button type="button" onClick={() => onModeChange('login')} className="font-semibold text-yellow-700 hover:text-yellow-800">Back to sign in</button>}
          {mode === 'reset' && <button type="button" onClick={() => onModeChange('login')} className="font-semibold text-yellow-700 hover:text-yellow-800">Back to sign in</button>}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', icon }: { label: string; value: string; onChange: (value: string) => void; type?: string; icon?: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <span className="relative mt-1 block">
        {icon && <span className="absolute left-3 top-3 text-gray-400">{icon}</span>}
        <input required type={type} value={value} onChange={(event) => onChange(event.target.value)} className={`w-full rounded-md border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 ${icon ? 'pl-9' : ''}`} />
      </span>
    </label>
  );
}

function PasswordField({ label, value, onChange, show, onToggle }: { label: string; value: string; onChange: (value: string) => void; show: boolean; onToggle: () => void }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <span className="relative mt-1 block">
        <input required type={show ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-3 pr-11 text-gray-900 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100" />
        <button type="button" onClick={onToggle} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-3 text-gray-500 hover:text-gray-800">
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </span>
    </label>
  );
}

