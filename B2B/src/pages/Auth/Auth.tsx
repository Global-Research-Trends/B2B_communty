import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  confirmResetPassword,
  confirmSignUp,
  resendSignUpCode,
  resetPassword,
  signIn,
  signUp,
  updateUserAttributes,
} from 'aws-amplify/auth';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

type AuthMode = 'signup' | 'signin';

type ResetPasswordStep = 'request' | 'confirm' | null;
type VerificationTarget = 'email' | null;

type FormState = {
  firstName: string;
  lastName: string;
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
  const [verificationTarget, setVerificationTarget] = useState<VerificationTarget>(null);
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [verificationDestination, setVerificationDestination] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadCountries = async () => {
      try {
        const response = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,cca2,idd',
          { signal: controller.signal },
        );

        if (!response.ok) return;

        const data = (await response.json()) as Array<{
          name?: { common?: string };
          cca2?: string;
          idd?: { root?: string; suffixes?: string[] };
        }>;

        const mapped = data
          .map((country) => {
            const root = country.idd?.root ?? '';
            const suffix = country.idd?.suffixes?.[0] ?? '';
            const dialCode = root && suffix ? `${root}${suffix}` : '';

            return {
              label: country.name?.common ?? '',
              value: country.cca2 ?? '',
              dialCode,
            };
          })
          .filter((country) => country.label && country.value && country.dialCode)
          .sort((a, b) => a.label.localeCompare(b.label));

        if (mapped.length > 0) {
          setCountries(mapped);
        }
      } catch {
        // Keep fallback list if lookup fails.
      }
    };

    void loadCountries();

    return () => controller.abort();
  }, []);

  const helperText = useMemo(() => {
    if (resetPasswordStep === 'request') {
      return 'Enter your account email to receive a verification code.';
    }

    if (resetPasswordStep === 'confirm') {
      return 'Use the code from your email to set a new password.';
    }

    if (mode === 'signup') {
      return 'Create your account and complete core profile details in one step.';
    }

    return 'Sign in to access your professional workspace.';
  }, [mode, resetPasswordStep]);

  const selectedCountry = useMemo(() => {
    return countries.find((country) => country.value === form.country) ?? fallbackCountries[0];
  }, [countries, form.country]);

  const maxDobDate = useMemo(() => {
    const today = new Date();
    const limit = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return limit.toISOString().split('T')[0];
  }, []);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetMessages = () => {
    setErrorMessage('');
    setStatusMessage('');
  };

  const isOlderThan18 = (dateString: string) => {
    if (!dateString) return false;

    const today = new Date();
    const birthDate = new Date(dateString);

    if (Number.isNaN(birthDate.getTime())) return false;

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }

    return age >= 18;
  };

  const validateSignupCoreFields = () => {
    const normalizedFirstName = form.firstName.trim();
    const normalizedLastName = form.lastName.trim();
    const normalizedEmail = form.email.trim();
    const normalizedPhoneLocal = form.phoneLocal.replace(/\D/g, '');

    if (!normalizedFirstName) {
      setErrorMessage('Enter your first name.');
      return null;
    }

    if (!normalizedLastName) {
      setErrorMessage('Enter your last name.');
      return null;
    }

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrorMessage('Enter a valid email before requesting verification.');
      return null;
    }

    if (!form.password || form.password.length < 8) {
      setErrorMessage('Enter a password with at least 8 characters.');
      return null;
    }

    if (!normalizedPhoneLocal) {
      setErrorMessage('Enter your phone number before requesting verification.');
      return null;
    }

    if (!isOlderThan18(form.dateOfBirth)) {
      setErrorMessage('You must be at least 18 years old to register.');
      return null;
    }

    return {
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      email: normalizedEmail,
      phoneLocal: normalizedPhoneLocal,
      phoneNumber: `${selectedCountry.dialCode}${normalizedPhoneLocal}`,
    };
  };

  const openVerificationModal = async () => {
    resetMessages();
    setIsSubmitting(true);

    try {
      const normalized = validateSignupCoreFields();
      if (!normalized) return;

      let destination = normalized.email;

      try {
        const response = await signUp({
          username: normalized.email,
          password: form.password,
          options: {
            userAttributes: {
              given_name: normalized.firstName,
              family_name: normalized.lastName,
              email: normalized.email,
              birthdate: form.dateOfBirth,
              locale: form.country,
              gender: 'other',
            },
            autoSignIn: false,
          },
        });

        if (response.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
          destination = response.nextStep.codeDeliveryDetails.destination ?? destination;
        }
      } catch (error) {
        const errorName = getAuthErrorName(error);
        const message = error instanceof Error ? error.message : '';

        if (errorName !== 'UsernameExistsException' && !message.includes('UsernameExistsException')) {
          throw error;
        }

        const resendResponse = await resendSignUpCode({ username: normalized.email });
        destination = resendResponse.destination ?? destination;
      }

      setVerificationTarget('email');
      setVerificationDestination(destination);
      setVerificationCodeInput('');
      setStatusMessage(`Verification code sent to ${destination}.`);
    } catch (error) {
      const errorName = getAuthErrorName(error);
      const errorText = error instanceof Error ? error.message : '';

      if (errorName === 'UserNotFoundException') {
        setErrorMessage('No pending signup found for this email. Click "Create account" first to request OTP.');
        return;
      }

      if (errorName === 'NotAuthorizedException' && errorText.includes('Current status is CONFIRMED')) {
        setEmailVerified(true);
        setStatusMessage('Email is already verified. You can continue.');
        return;
      }

      const message = error instanceof Error ? error.message : 'Unable to send verification code.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeVerificationModal = () => {
    setVerificationTarget(null);
    setVerificationCodeInput('');
    setVerificationDestination('');
  };

  const confirmVerificationCode = async () => {
    resetMessages();
    setIsSubmitting(true);

    try {
      if (!verificationCodeInput.trim()) {
        setErrorMessage('Enter the verification code.');
        return;
      }

      await confirmSignUp({
        username: form.email.trim(),
        confirmationCode: verificationCodeInput.trim(),
      });

      setEmailVerified(true);
      setStatusMessage('Email verified.');
      closeVerificationModal();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to verify code.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    setIsSubmitting(true);

    try {
      const response = await signIn({
        username: form.email.trim(),
        password: form.password,
      });

      if (response.isSignedIn) {
        navigate('/questionnaire');
        return;
      }

      setStatusMessage('Additional verification is required for this account.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    setIsSubmitting(true);

    try {
      const normalized = validateSignupCoreFields();
      if (!normalized) return;

      if (!emailVerified) {
        setErrorMessage('Request and verify OTP before creating your account.');
        return;
      }

      const response = await signIn({
        username: normalized.email,
        password: form.password,
      });

      if (response.isSignedIn) {
        navigate('/questionnaire');
        return;
      }

      setStatusMessage('Account verified. Please complete sign-in to continue.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign up.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPasswordRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    setIsSubmitting(true);

    try {
      const response = await resetPassword({ username: form.email.trim() });
      const destination = response.nextStep.codeDeliveryDetails?.destination;

      setResetPasswordStep('confirm');
      setStatusMessage(destination ? `A reset code was sent to ${destination}.` : 'A reset code was sent to your email.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to start password reset.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPasswordConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    setIsSubmitting(true);

    try {
      await confirmResetPassword({
        username: form.email.trim(),
        confirmationCode: form.resetCode.trim(),
        newPassword: form.resetNewPassword,
      });

      setResetPasswordStep(null);
      updateField('password', form.resetNewPassword);
      updateField('resetCode', '');
      updateField('resetNewPassword', '');
      setStatusMessage('Password updated. Sign in with your new password.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to reset password.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <aside className="auth-visual">
          <div className="auth-brand-mark" aria-hidden="true" />
          <div className="auth-brand-copy">
            <p className="auth-brand-name">GLOBAL RESEARCH TRENDS</p>
            <h1>Trusted Insights for Global B2B Decision-Makers</h1>
            <p>
              Join a verified network of business leaders and access high-quality research opportunities.
            </p>
          </div>
          <div className="auth-dots" aria-hidden="true" />
          <div className="auth-orbit auth-orbit-a" aria-hidden="true" />
          <div className="auth-orbit auth-orbit-b" aria-hidden="true" />
        </aside>

        <section className="auth-form-panel">
          <div className="auth-head">
            <h2>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h2>
            <p>{helperText}</p>
          </div>

          {!resetPasswordStep && (
            <form
              className={`auth-form ${mode === 'signup' ? 'auth-form-signup' : ''}`}
              onSubmit={mode === 'signup' ? handleSignUp : handleSignIn}
            >
              {mode === 'signup' && (
                <>
                  <div className="auth-field">
                    <label htmlFor="firstName">First name</label>
                    <input
                      id="firstName"
                      type="text"
                      value={form.firstName}
                      onChange={(event) => updateField('firstName', event.target.value)}
                      placeholder="Alex"
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label htmlFor="lastName">Last name</label>
                    <input
                      id="lastName"
                      type="text"
                      value={form.lastName}
                      onChange={(event) => updateField('lastName', event.target.value)}
                      placeholder="Morgan"
                      required
                    />
                  </div>
                </>
              )}

              <div className="auth-field auth-span-2">
                <label htmlFor="email">Business email</label>
                <div className="auth-input-with-action">
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) => {
                      updateField('email', event.target.value);
                      setEmailVerified(false);
                    }}
                    placeholder="name@company.com"
                    required
                  />
                  {mode === 'signup' && (
                    <button
                      type="button"
                      className={`auth-verify-btn ${emailVerified ? 'auth-verify-btn-verified' : ''}`}
                      onClick={() => {
                        void openVerificationModal();
                      }}
                      aria-label={emailVerified ? 'Email verified, request OTP again' : 'Request email OTP'}
                    >
                      {emailVerified ? '✓' : 'OTP'}
                    </button>
                  )}
                </div>
              </div>

              <div className="auth-field auth-span-2">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>

              {mode === 'signup' && (
                <>
                  <div className="auth-field">
                    <label htmlFor="country">Country</label>
                    <select
                      id="country"
                      value={form.country}
                      onChange={(event) => {
                        updateField('country', event.target.value);
                      }}
                      required
                    >
                      {countries.map((country) => (
                        <option value={country.value} key={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="auth-field">
                    <label htmlFor="dob">Date of birth</label>
                    <input
                      id="dob"
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(event) => updateField('dateOfBirth', event.target.value)}
                      max={maxDobDate}
                      required
                    />
                  </div>

                  <div className="auth-field auth-span-2">
                    <label htmlFor="phone">Phone number</label>
                    <div className="auth-phone-group">
                      <input
                        aria-label="Country code"
                        className="auth-phone-code"
                        value={selectedCountry.dialCode}
                        readOnly
                      />
                      <input
                        id="phone"
                        type="tel"
                        value={form.phoneLocal}
                        onChange={(event) => {
                          updateField('phoneLocal', event.target.value);
                        }}
                        placeholder=""
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="auth-span-2">
                {errorMessage && <p className="auth-feedback auth-error">{errorMessage}</p>}
                {statusMessage && <p className="auth-feedback auth-info">{statusMessage}</p>}

                {mode === 'signin' && (
                  <button
                    type="button"
                    className="auth-forgot-link"
                    onClick={() => {
                      resetMessages();
                      setResetPasswordStep('request');
                    }}
                  >
                    Forgot password?
                  </button>
                )}

                <button type="submit" className="auth-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : mode === 'signup' ? 'Create account' : 'Sign in'}
                </button>
              </div>
            </form>
          )}

          {resetPasswordStep === 'request' && (
            <form className="auth-form" onSubmit={handleResetPasswordRequest}>
              <div className="auth-field auth-span-2">
                <label htmlFor="resetEmail">Business email</label>
                <input
                  id="resetEmail"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div className="auth-span-2">
                {errorMessage && <p className="auth-feedback auth-error">{errorMessage}</p>}
                {statusMessage && <p className="auth-feedback auth-info">{statusMessage}</p>}

                <button type="submit" className="auth-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending code...' : 'Send reset code'}
                </button>

                <button
                  type="button"
                  className="auth-secondary-link"
                  onClick={() => {
                    resetMessages();
                    setResetPasswordStep(null);
                  }}
                >
                  Back to sign in
                </button>
              </div>
            </form>
          )}

          {resetPasswordStep === 'confirm' && (
            <form className="auth-form" onSubmit={handleResetPasswordConfirm}>
              <div className="auth-field auth-span-2">
                <label htmlFor="resetCode">Verification code</label>
                <input
                  id="resetCode"
                  type="text"
                  value={form.resetCode}
                  onChange={(event) => updateField('resetCode', event.target.value)}
                  placeholder="Enter the code from your email"
                  required
                />
              </div>

              <div className="auth-field auth-span-2">
                <label htmlFor="resetNewPassword">New password</label>
                <input
                  id="resetNewPassword"
                  type="password"
                  value={form.resetNewPassword}
                  onChange={(event) => updateField('resetNewPassword', event.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>

              <div className="auth-span-2">
                {errorMessage && <p className="auth-feedback auth-error">{errorMessage}</p>}
                {statusMessage && <p className="auth-feedback auth-info">{statusMessage}</p>}

                <button type="submit" className="auth-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating password...' : 'Update password'}
                </button>

                <button
                  type="button"
                  className="auth-secondary-link"
                  onClick={() => {
                    resetMessages();
                    setResetPasswordStep('request');
                  }}
                >
                  Resend code
                </button>
              </div>
            </form>
          )}

          {!resetPasswordStep && mode === 'signin' && (
            <div className="auth-social-row" aria-label="Social sign in options">
              <button
                type="button"
                className="auth-social-btn auth-social-linkedin"
                onClick={() => window.open('https://www.linkedin.com/', '_blank', 'noopener,noreferrer')}
                aria-label="Sign in with LinkedIn"
                title="Sign in with LinkedIn"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M4.98 3.5A2.49 2.49 0 1 0 5 8.48 2.49 2.49 0 0 0 4.98 3.5zM3 9h4v12H3zm7 0h3.83v1.64h.06c.53-1.01 1.84-2.08 3.79-2.08C21 8.56 22 10.55 22 14.06V21h-4v-6.07c0-1.45-.03-3.32-2.02-3.32-2.02 0-2.33 1.58-2.33 3.21V21h-4z"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="auth-social-btn auth-social-google"
                onClick={() => window.open('https://accounts.google.com/', '_blank', 'noopener,noreferrer')}
                aria-label="Sign in with Google"
                title="Sign in with Google"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M12 10.2v3.9h5.5c-.24 1.26-.97 2.33-2.05 3.05l3.3 2.56c1.92-1.77 3.03-4.38 3.03-7.5 0-.73-.06-1.43-.19-2.1H12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 22c2.73 0 5.01-.9 6.68-2.3l-3.3-2.56c-.92.62-2.09.98-3.38.98-2.6 0-4.8-1.76-5.58-4.13H3.02v2.6A10 10 0 0 0 12 22z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M6.42 13.99A5.99 5.99 0 0 1 6.1 12c0-.69.12-1.35.32-1.99V7.4H3.02A10 10 0 0 0 2 12c0 1.61.39 3.13 1.02 4.59l3.4-2.6z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M12 5.88c1.48 0 2.8.51 3.85 1.51l2.9-2.9C17 2.91 14.72 2 12 2A10 10 0 0 0 3.02 7.4l3.4 2.6C7.2 7.64 9.4 5.88 12 5.88z"
                  />
                </svg>
              </button>
            </div>
          )}

          {verificationTarget && (
            <div className="auth-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="verificationTitle">
              <div className="auth-modal">
                <h3 id="verificationTitle">
                  Verify email
                </h3>
                <p>Enter the 6-digit code sent to {verificationDestination}.</p>
                <input
                  type="text"
                  value={verificationCodeInput}
                  onChange={(event) => setVerificationCodeInput(event.target.value)}
                  placeholder="6-digit code"
                  maxLength={6}
                />
                <div className="auth-modal-actions">
                  <button type="button" className="auth-modal-secondary" onClick={closeVerificationModal}>
                    Cancel
                  </button>
                  <button type="button" className="auth-modal-primary" onClick={confirmVerificationCode}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          <p className="auth-switch">
            {mode === 'signup' ? 'Already have an account?' : 'Need an account?'}
            <button
              type="button"
              onClick={() => {
                resetMessages();
                setResetPasswordStep(null);
                closeVerificationModal();
                setMode((prev) => (prev === 'signup' ? 'signin' : 'signup'));
              }}
            >
              {mode === 'signup' ? 'Sign in' : 'Create one'}
            </button>
          </p>

          <Link to="/" className="auth-back-link">
            Back to home
          </Link>
        </section>
      </section>
    </main>
  );
};

export default Auth;
