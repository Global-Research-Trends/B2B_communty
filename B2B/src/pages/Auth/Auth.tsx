import { FormEvent, useEffect, useMemo, useState } from 'react';
//import { confirmSignUp, signIn, signUp } from 'aws-amplify/auth';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

type AuthMode = 'signup' | 'signin';

type FormState = {
  email: string;
  password: string;
  phoneLocal: string;
  country: string;
  dateOfBirth: string;
  gender: string;
  confirmationCode: string;
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
  email: '',
  password: '',
  phoneLocal: '',
  country: 'US',
  dateOfBirth: '',
  gender: 'male',
  confirmationCode: '',
};

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('signup');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [countries, setCountries] = useState<CountryOption[]>(fallbackCountries);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    if (mode === 'signup') {
      return 'Create your account and complete core profile details in one step.';
    }

    return 'Sign in to access your professional workspace.';
  }, [mode]);

  const selectedCountry = useMemo(() => {
    return countries.find((country) => country.value === form.country) ?? fallbackCountries[0];
  }, [countries, form.country]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetMessages = () => {
    setErrorMessage('');
    setStatusMessage('');
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
        navigate('/dashboard');
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
      const normalizedPhoneLocal = form.phoneLocal.replace(/\D/g, '');
      const fullPhoneNumber = `${selectedCountry.dialCode}${normalizedPhoneLocal}`;

      if (!normalizedPhoneLocal) {
        setErrorMessage('Enter your phone number without the country code.');
        setIsSubmitting(false);
        return;
      }

      const response = await signUp({
        username: form.email.trim(),
        password: form.password,
        options: {
          userAttributes: {
            email: form.email.trim(),
            birthdate: form.dateOfBirth,
            phone_number: fullPhoneNumber,
            locale: form.country,
            gender: form.gender,
          },
          autoSignIn: true,
        },
      });

      if (response.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setNeedsConfirmation(true);
        setStatusMessage('A verification code was sent to your email. Enter it below to complete registration.');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign up.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    setIsSubmitting(true);

    try {
      await confirmSignUp({
        username: form.email.trim(),
        confirmationCode: form.confirmationCode.trim(),
      });

      await signIn({
        username: form.email.trim(),
        password: form.password,
      });

      navigate('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to verify account.';
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

          {!needsConfirmation && (
            <form
              className={`auth-form ${mode === 'signup' ? 'auth-form-signup' : ''}`}
              onSubmit={mode === 'signup' ? handleSignUp : handleSignIn}
            >
              <div className="auth-field auth-span-2">
                <label htmlFor="email">Business email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="name@company.com"
                  required
                />
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
                      onChange={(event) => updateField('country', event.target.value)}
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
                        onChange={(event) => updateField('phoneLocal', event.target.value)}
                        placeholder=""
                        required
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      value={form.gender}
                      onChange={(event) => updateField('gender', event.target.value)}
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="auth-field">
                    <label htmlFor="dob">Date of birth</label>
                    <input
                      id="dob"
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(event) => updateField('dateOfBirth', event.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <div className="auth-span-2">
                {errorMessage && <p className="auth-feedback auth-error">{errorMessage}</p>}
                {statusMessage && <p className="auth-feedback auth-info">{statusMessage}</p>}

                <button type="submit" className="auth-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : mode === 'signup' ? 'Create account' : 'Sign in'}
                </button>
              </div>
            </form>
          )}

          {needsConfirmation && (
            <form className="auth-form" onSubmit={handleConfirm}>
              <div className="auth-field auth-span-2">
                <label htmlFor="confirmationCode">Verification code</label>
                <input
                  id="confirmationCode"
                  type="text"
                  value={form.confirmationCode}
                  onChange={(event) => updateField('confirmationCode', event.target.value)}
                  placeholder="Enter the code sent to your email"
                  required
                />
              </div>

              <div className="auth-span-2">
                {errorMessage && <p className="auth-feedback auth-error">{errorMessage}</p>}
                {statusMessage && <p className="auth-feedback auth-info">{statusMessage}</p>}

                <button type="submit" className="auth-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Verifying...' : 'Verify and continue'}
                </button>
              </div>
            </form>
          )}

          <button
            type="button"
            className="auth-linkedin"
            onClick={() => window.open('https://www.linkedin.com/', '_blank', 'noopener,noreferrer')}
          >
            Continue with LinkedIn
          </button>

          <p className="auth-switch">
            {mode === 'signup' ? 'Already have an account?' : 'Need an account?'}
            <button
              type="button"
              onClick={() => {
                resetMessages();
                setNeedsConfirmation(false);
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


