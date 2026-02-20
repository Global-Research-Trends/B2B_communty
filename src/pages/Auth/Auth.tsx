import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  confirmResetPassword,
  confirmSignUp,
  getCurrentUser,
  resendSignUpCode,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const client = generateClient<Schema>();

const checkQuestionnaireCompleted = async (): Promise<boolean> => {
  try {
    const { userId } = await getCurrentUser();
    const { data } = await client.models.QuestionnaireResponse.list({
      filter: { owner: { eq: userId } },
    });
    return data.length > 0;
  } catch {
    return false;
  }
};

type AuthMode = 'signup' | 'signin';
type ResetPasswordStep = 'request' | 'confirm' | null;
type VerificationTarget = 'email' | null;
type UsernameAvailability = 'idle' | 'checking' | 'available' | 'taken' | 'unknown';

type FormState = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phoneLocal: string;
  country: string;
  dateOfBirth: string;
  resetCode: string;
  resetNewPassword: string;
};

type CountryOption = {
  label: string;
  value: string;
  dialCode: string;
};

const fallbackCountries: CountryOption[] = [
  { label: 'United States', value: 'US', dialCode: '+1' },
  { label: 'United Kingdom', value: 'GB', dialCode: '+44' },
  { label: 'India', value: 'IN', dialCode: '+91' },
  { label: 'Germany', value: 'DE', dialCode: '+49' },
  { label: 'United Arab Emirates', value: 'AE', dialCode: '+971' },
  { label: 'South Africa', value: 'ZA', dialCode: '+27' },
];

const initialFormState: FormState = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  phoneLocal: '',
  country: 'US',
  dateOfBirth: '',
  resetCode: '',
  resetNewPassword: '',
};

const getAuthErrorName = (error: unknown) => {
  if (!error || typeof error !== 'object' || !('name' in error)) return '';
  const maybeName = (error as { name?: unknown }).name;
  return typeof maybeName === 'string' ? maybeName : '';
};

const getFriendlyPasswordError = (error: unknown) => {
  const errorName = getAuthErrorName(error);
  const message = error instanceof Error ? error.message : '';
  if (errorName === 'InvalidPasswordException' || 
      (/password/i.test(message) && /(policy|conform|requirement|minimum|uppercase|lowercase|number|special)/i.test(message))) {
    return 'Password is not strong enough.';
  }
  return message;
};

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('signup');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetPasswordStep, setResetPasswordStep] = useState<ResetPasswordStep>(null);
  const [countries, setCountries] = useState<CountryOption[]>(fallbackCountries);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingSignupUsername, setPendingSignupUsername] = useState('');
  const [usernameAvailability, setUsernameAvailability] = useState<UsernameAvailability>('idle');
  const [verificationTarget, setVerificationTarget] = useState<VerificationTarget>(null);
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [verificationDestination, setVerificationDestination] = useState('');
  const usernameCheckSeqRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const loadCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd', { signal: controller.signal });
        if (!response.ok) return;
        const data = await response.json();
        const mapped = data.map((country: any) => ({
          label: country.name?.common ?? '',
          value: country.cca2 ?? '',
          dialCode: country.idd?.root ? `${country.idd.root}${country.idd.suffixes?.[0] ?? ''}` : '',
        })).filter((c: any) => c.label && c.value && c.dialCode).sort((a: any, b: any) => a.label.localeCompare(b.label));
        if (mapped.length > 0) setCountries(mapped);
      } catch { /* Stay with fallbacks */ }
    };
    loadCountries();
    return () => controller.abort();
  }, []);

  const selectedCountry = useMemo(() => countries.find((c) => c.value === form.country) ?? fallbackCountries[0], [countries, form.country]);

  // Username Availability Check Logic
  useEffect(() => {
    if (mode !== 'signup' || resetPasswordStep) { setUsernameAvailability('idle'); return; }
    const username = form.username.trim();
    if (!username || !/^[a-zA-Z0-9._-]{3,30}$/.test(username)) { setUsernameAvailability('idle'); return; }
    setUsernameAvailability('checking');
    const seq = ++usernameCheckSeqRef.current;
    const timeoutId = window.setTimeout(async () => {
      try {
        await signIn({ username, password: 'AvailabilityProbe_9x@Q3' });
        if (seq === usernameCheckSeqRef.current) setUsernameAvailability('unknown');
      } catch (error) {
        if (seq !== usernameCheckSeqRef.current) return;
        const name = getAuthErrorName(error);
        if (name === 'UserNotFoundException') setUsernameAvailability('available');
        else if (name === 'UserNotConfirmedException' || name === 'PasswordResetRequiredException') setUsernameAvailability('taken');
        else setUsernameAvailability('unknown');
      }
    }, 500);
    return () => window.clearTimeout(timeoutId);
  }, [form.username, mode, resetPasswordStep]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm(p => ({ ...p, [key]: value }));
  const resetMessages = () => { setErrorMessage(''); setStatusMessage(''); };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsSubmitting(true);
    try {
      const response = await signIn({ username: form.email.trim(), password: form.password });
      if (response.isSignedIn) {
        const done = await checkQuestionnaireCompleted();
        navigate(done ? '/dashboard' : '/questionnaire');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Login failed');
    } finally { setIsSubmitting(false); }
  };

  const openVerificationModal = async () => {
    resetMessages();
    setIsSubmitting(true);
    try {
      const { firstName, lastName, username, email, phoneLocal } = form;
      const res = await signUp({
        username: username.trim(),
        password: form.password,
        options: {
          userAttributes: {
            given_name: firstName,
            family_name: lastName,
            email: email.trim(),
            phone_number: `${selectedCountry.dialCode}${phoneLocal.replace(/\D/g, '')}`,
            birthdate: form.dateOfBirth,
          }
        }
      });
      setVerificationDestination(res.nextStep.codeDeliveryDetails?.destination || email);
      setVerificationTarget('email');
      setPendingSignupUsername(username.trim());
    } catch (error) {
      setErrorMessage(getFriendlyPasswordError(error));
    } finally { setIsSubmitting(false); }
  };

  const confirmVerificationCode = async () => {
    setIsSubmitting(true);
    try {
      await confirmSignUp({
        username: pendingSignupUsername,
        confirmationCode: verificationCodeInput.trim()
      });
      setEmailVerified(true);
      setVerificationTarget(null);
      setStatusMessage('Verification successful! You can now create your account.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Verification failed');
    } finally { setIsSubmitting(false); }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <aside className="auth-visual">
          <div className="auth-brand-copy">
            <p className="auth-brand-name">GLOBAL RESEARCH TRENDS</p>
            <h1>Trusted Insights for Global Decision-Makers</h1>
          </div>
        </aside>

        <section className="auth-form-panel">
          <div className="auth-head">
            <h2>{mode === 'signup' ? 'Create account' : 'Welcome back'}</h2>
          </div>

          <form className="auth-form" onSubmit={mode === 'signup' ? (e) => e.preventDefault() : handleSignIn}>
            <div className="auth-field auth-span-2">
              <label>Email</label>
              <div className="auth-input-with-action">
                <input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} required />
                {mode === 'signup' && (
                  <button type="button" onClick={openVerificationModal} className="auth-verify-btn">
                    {emailVerified ? '✓' : 'Verify'}
                  </button>
                )}
              </div>
            </div>

            <div className="auth-field auth-span-2">
              <label>Password</label>
              <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => updateField('password', e.target.value)} required />
            </div>

            {errorMessage && <p className="auth-error">{errorMessage}</p>}
            {statusMessage && <p className="auth-info">{statusMessage}</p>}

            <button type="submit" className="auth-submit" disabled={isSubmitting || (mode === 'signup' && !emailVerified)}>
              {isSubmitting ? 'Processing...' : mode === 'signup' ? 'Create account' : 'Sign in'}
            </button>
          </form>

          {verificationTarget && (
            <div className="auth-modal-overlay">
              <div className="auth-modal">
                <h3>Enter Code</h3>
                <p>Sent to {verificationDestination}</p>
                <input value={verificationCodeInput} onChange={e => setVerificationCodeInput(e.target.value)} />
                <button onClick={confirmVerificationCode}>Verify Code</button>
                <button onClick={() => setVerificationTarget(null)}>Cancel</button>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default Auth;