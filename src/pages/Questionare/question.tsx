import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import countriesData from '../../../country/countries+states+cities.json';
import './question.css';

const client = generateClient<Schema>();

type CityData = { name: string };
type StateData = { name: string; cities?: CityData[] };
type CountryData = { name: string; states?: StateData[] };

const countryData = countriesData as CountryData[];

/* ═══════════════════════════════════════════
   Step 1 — Your Role (B2B Onboarding Survey)
   ═══════════════════════════════════════════ */

const jobTitles = [
  'Owner / Founder',
  'C-Level Executive',
  'Vice President',
  'Director',
  'Manager',
  'Senior Individual Contributor',
  'Individual Contributor',
  'Consultant / Freelancer',
  'Student / Intern',
  'Other',
];

const seniorityLevels = [
  'Executive Leadership',
  'Senior Management',
  'Middle Management',
  'Senior Professional',
  'Mid-Level Professional',
  'Junior / Entry Level',
  'Student / Intern',
];

const departmentsList = [
  'Executive / Strategy',
  'Sales',
  'Marketing',
  'Product',
  'Engineering / IT',
  'Operations',
  'Finance',
  'Human Resources',
  'Legal / Compliance',
  'Customer Success',
  'Other',
];

/* ═══════════════════════════════════════════
   Step 2 — Your Company (B2B Onboarding Survey)
   ═══════════════════════════════════════════ */

const companyTypes = [
  'Public Company',
  'Private Company',
  'Startup',
  'Small Business',
  'Family Business',
  'Non-Profit Organization',
  'Government Agency',
  'Educational Institution',
  'Self-Employed / Freelance',
  'Other',
];

const industriesList = [
  'Technology & Software',
  'Financial Services',
  'Healthcare & Life Sciences',
  'Professional Services',
  'Manufacturing & Industrial',
  'Retail & E-commerce',
  'Media & Communications',
  'Education',
  'Government & Non-Profit',
  'Other',
];

const yearsOptions = [
  '0–2 years',
  '3–7 years',
  '8–15 years',
  '16+ years',
];

const companySizeOptions = [
  '1–10',
  '11–50',
  '51–200',
  '201–1,000',
  '1,001–5,000',
  '5,000+',
];

const revenueOptions = [
  'Less than $1 million',
  '$1 million – $10 million',
  '$10 million – $50 million',
  '$50 million – $250 million',
  '$250 million – $1 billion',
  'Over $1 billion',
  'Prefer not to say',
];

const marketOptions = [
  'Local / Regional',
  'National',
  'International / Multi-regional',
  'Global',
];

/* ═══════════════════════════════════════════
   Step 3 — Your Goals (B2B Onboarding Survey)
   ═══════════════════════════════════════════ */

const joinReasons = [
  'Learn from peers and industry experts',
  'Get help with specific business challenges',
  'Stay current on industry trends',
  'Build my professional network',
  'Find partners or collaborators',
  'Share my expertise',
];

const challengeOptions = [
  'Scaling operations',
  'Team alignment and collaboration',
  'Technology adoption',
  'Revenue growth and pipeline',
  'Talent retention and team performance',
  'Compliance and risk management',
  'Other',
];

const contentTypes = [
  'Case studies and real-world examples',
  'Expert discussions and Q&A',
  'Templates and frameworks',
  'Industry data and benchmarks',
  'Live events and webinars',
  'Peer-to-peer problem solving',
];

/* ═══════════════════════════════════════════
   Step 4 — Background & Location (profile)
   ═══════════════════════════════════════════ */

const educationLevels = [
  'High School Diploma or Equivalent',
  "Bachelor's Degree",
  "Master's Degree",
  'Other',
];

const fieldsOfStudy = [
  'Business Administration / Management',
  'Engineering (Civil, Mechanical, Electrical, etc.)',
  'Computer Science / Information Technology',
  'Medicine / Healthcare / Nursing',
  'Natural Sciences (Biology, Chemistry, Physics, etc.)',
  'Social Sciences (Psychology, Sociology, Economics, etc.)',
  'Humanities (Literature, History, Philosophy, etc.)',
  'Education / Teaching',
  'Law / Legal Studies',
  'Arts / Design / Architecture',
  'Agriculture / Environmental Science',
  'Other',
];

const occupationStatuses = [
  'Employed Full-time',
  'Employed Part-time',
  'Self-employed / Entrepreneur',
  'Business Owner',
  'Student',
  'Unemployed',
  'Retired',
  'Other',
];

/* ═══════════════════════════════════════════
   Step 5 — Preferences & Consent (profile)
   ═══════════════════════════════════════════ */

const languagesList = [
  'English',
  'Spanish',
  'Mandarin Chinese',
  'French',
  'German',
  'Japanese',
  'Korean',
  'Portuguese',
  'Russian',
  'Arabic',
  'Hindi',
  'Italian',
  'Dutch',
  'Other',
];

const hobbiesList = [
  'Skills & Micro-Learning (How-to guides & productivity)',
  'Career Pathing (Advancement & management tips)',
  'Work-Life Integration (Mental health & remote work)',
  'Internal Networking (Cross-department mixers)',
  'Recognition & Feedback (Celebrating wins)',
  'Company Culture (Book clubs & fitness)',
  'Other',
];

/* ═══════════════════════════════════════════
   Sections
   ═══════════════════════════════════════════ */

const SECTIONS = [
  { key: '1', title: 'Your Role' },
  { key: '2', title: 'Your Company' },
  { key: '3', title: 'Your Goals' },
  { key: '4', title: 'Background & Location' },
  { key: '5', title: 'Preferences & Consent' },
] as const;

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

const Questionnaire = ({ testMode = false }: { testMode?: boolean }) => {
  const navigate = useNavigate();

  /* form state */
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [otherFields, setOtherFields] = useState<Record<string, string>>({});
  const [checkingAuth, setCheckingAuth] = useState(true);

  /* ── Step 1: Your Role ── */
  const [jobTitle, setJobTitle] = useState('');
  const [seniorityLevel, setSeniorityLevel] = useState('');
  const [department, setDepartment] = useState('');

  /* ── Step 2: Your Company ── */
  const [companyType, setCompanyType] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [yearsExperience, setYearsExperience] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [annualRevenue, setAnnualRevenue] = useState('');
  const [primaryMarket, setPrimaryMarket] = useState('');

  /* ── Step 3: Your Goals ── */
  const [joinReason, setJoinReason] = useState('');
  const [biggestChallenge, setBiggestChallenge] = useState('');
  const [selectedContent, setSelectedContent] = useState<string[]>([]);

  /* ── Step 4: Background & Location ── */
  const [educationLevel, setEducationLevel] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [occupationStatus, setOccupationStatus] = useState('');
  const [country, setCountry] = useState('');
  const [provinceState, setProvinceState] = useState('');
  const [city, setCity] = useState('');

  /* ── Step 5: Preferences & Consent ── */
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [participationConsent] = useState('');
  const [contactPreference] = useState('');

  /* ── auth guard + questionnaire completion check ── */
  useEffect(() => {
    if (testMode) {
      setCheckingAuth(false);
      return;
    }
    const checkAuthAndQuestionnaire = async () => {
      try {
        const { userId } = await getCurrentUser();
        const { data } = await client.models.QuestionnaireResponse.list({
          filter: { owner: { eq: userId } },
        });
        if (data.length > 0) {
          navigate('/dashboard', { replace: true });
          return;
        }
      } catch {
        navigate('/auth', { replace: true });
        return;
      } finally {
        setCheckingAuth(false);
      }
    };
    void checkAuthAndQuestionnaire();
  }, [navigate, testMode]);

  /* helpers */
  const toggleMulti = (
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
  ) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const resolveValue = (value: string, otherKey: string) => {
    if (value === 'Other' && otherFields[otherKey]) {
      return `Other: ${otherFields[otherKey]}`;
    }
    return value;
  };

  const resolveMulti = (values: string[], otherKey: string) => {
    return values.map((v) => {
      if (v === 'Other' && otherFields[otherKey]) return `Other: ${otherFields[otherKey]}`;
      return v;
    });
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setProvinceState('');
    setCity('');
  };

  const handleStateChange = (value: string) => {
    setProvinceState(value);
    setCity('');
  };

  const normalize = (value: string) => value.trim().toLowerCase();

  const findCountry = (value: string) =>
    countryData.find((item) => normalize(item.name) === normalize(value));

  const findState = (countryItem: CountryData | undefined, value: string) =>
    countryItem?.states?.find((item) => normalize(item.name) === normalize(value));

  const findCity = (stateItem: StateData | undefined, value: string) =>
    stateItem?.cities?.find((item) => normalize(item.name) === normalize(value));

  const countryOptions = useMemo(
    () => countryData.map((item) => item.name).sort((a, b) => a.localeCompare(b)),
    [],
  );

  const selectedCountryData = useMemo(() => findCountry(country), [country]);

  const stateOptions = useMemo(
    () => (selectedCountryData?.states ?? []).map((item) => item.name).sort((a, b) => a.localeCompare(b)),
    [selectedCountryData],
  );

  const selectedStateData = useMemo(
    () => findState(selectedCountryData, provinceState),
    [selectedCountryData, provinceState],
  );

  const cityOptions = useMemo(
    () => (selectedStateData?.cities ?? []).map((item) => item.name).sort((a, b) => a.localeCompare(b)),
    [selectedStateData],
  );

  const selectedCityData = useMemo(
    () => findCity(selectedStateData, city),
    [selectedStateData, city],
  );

  const validateCurrentSection = (): boolean => {
    setErrorMessage('');
    switch (currentSection) {
      case 0: // Your Role
        if (!jobTitle) { setErrorMessage('Please select your job title.'); return false; }
        if (!seniorityLevel) { setErrorMessage('Please select your seniority level.'); return false; }
        if (!department) { setErrorMessage('Please select your department.'); return false; }
        return true;
      case 1: // Your Company
        if (!companyType) { setErrorMessage('Please select your company type.'); return false; }
        if (selectedIndustries.length === 0) { setErrorMessage('Please select at least one industry.'); return false; }
        if (!companySize) { setErrorMessage('Please select your company size.'); return false; }
        if (!primaryMarket) { setErrorMessage('Please select your primary market.'); return false; }
        return true;
      case 2: // Your Goals
        if (!joinReason) { setErrorMessage('Please select your primary reason for joining.'); return false; }
        if (!biggestChallenge) { setErrorMessage('Please select your biggest challenge.'); return false; }
        if (selectedContent.length === 0) { setErrorMessage('Please select at least one content type.'); return false; }
        return true;
      case 3: // Background & Location
        if (!educationLevel) { setErrorMessage('Please select your education level.'); return false; }
        if (!fieldOfStudy) { setErrorMessage('Please select your field of study.'); return false; }
        if (!graduationYear) { setErrorMessage('Please enter your graduation year.'); return false; }
        if (!occupationStatus) { setErrorMessage('Please select your occupation status.'); return false; }
        if (!country.trim()) { setErrorMessage('Please select your country.'); return false; }
        if (!selectedCountryData) { setErrorMessage('Please select a valid country from the list.'); return false; }
        if (!provinceState.trim()) { setErrorMessage('Please select your province/state.'); return false; }
        if (!selectedStateData) { setErrorMessage('Please select a valid province/state from the list.'); return false; }
        if (!city.trim()) { setErrorMessage('Please select your city.'); return false; }
        if (!selectedCityData) { setErrorMessage('Please select a valid city from the list.'); return false; }
        return true;
      case 4: // Preferences & Consent
        if (selectedLanguages.length === 0) { setErrorMessage('Please select at least one language.'); return false; }
        if (selectedHobbies.length === 0) { setErrorMessage('Please select at least one interest.'); return false; }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentSection()) return;
    setCurrentSection((prev) => Math.min(prev + 1, SECTIONS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setErrorMessage('');
    setCurrentSection((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateCurrentSection()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      let userId = 'anonymous';
      try {
        const user = await getCurrentUser();
        userId = user.userId;
      } catch {
        // allow preview without login
      }

      const resolvedCountry = selectedCountryData?.name ?? country.trim();
      const resolvedProvince = selectedStateData?.name ?? provinceState.trim();
      const resolvedCity = selectedCityData?.name ?? city.trim();

      const payload = {
        owner: userId,

        // Step 1
        roleLevel: resolveValue(jobTitle, 'jobTitle'),
        seniorityLevel,
        department: resolveValue(department, 'department'),

        // Step 2
        organizationType: resolveValue(companyType, 'companyType'),
        industry: JSON.stringify(resolveMulti(selectedIndustries, 'industry')),
        yearsExperience: yearsExperience || undefined,
        companySize,
        annualRevenue: annualRevenue || undefined,
        primaryMarket,

        // Step 3
        joinReason,
        biggestChallenge: resolveValue(biggestChallenge, 'biggestChallenge'),
        contentPreference: JSON.stringify(selectedContent),

        // Step 4
        educationLevel: resolveValue(educationLevel, 'educationLevel'),
        fieldOfStudy: resolveValue(fieldOfStudy, 'fieldOfStudy'),
        graduationYear,
        occupationStatus: resolveValue(occupationStatus, 'occupationStatus'),
        country: resolvedCountry,
        provinceState: resolvedProvince,
        city: resolvedCity,

        // Step 5
        languages: JSON.stringify(resolveMulti(selectedLanguages, 'languages')),
        hobbies: JSON.stringify(resolveMulti(selectedHobbies, 'hobbies')),
        participationConsent: participationConsent || undefined,
        contactPreference: contactPreference || undefined,
        completedAt: new Date().toISOString(),
      };

      if (testMode) {
        console.log('═══ TEST MODE — Questionnaire Payload ═══');
        console.log(JSON.stringify(payload, null, 2));
        alert('Test submission logged to console! Check DevTools (F12).');
      } else {
        await client.models.QuestionnaireResponse.create(payload);
      }

      if (!testMode) navigate('/dashboard');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to submit questionnaire.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentSection + 1) / SECTIONS.length) * 100;

  /* ─── Render helpers ─── */

  const renderRadioGroup = (
    name: string,
    options: string[],
    value: string,
    onChange: (v: string) => void,
  ) => (
    <div className="q-options-grid">
      {options.map((opt) => (
        <label
          key={opt}
          className={`q-option-card ${value === opt ? 'q-option-selected' : ''}`}
        >
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
          />
          <span className="q-option-radio" />
          <span className="q-option-label">{opt}</span>
          {opt === 'Other' && value === 'Other' && (
            <input
              type="text"
              className="q-other-input"
              placeholder="Please specify..."
              value={otherFields[name] ?? ''}
              onChange={(e) =>
                setOtherFields((prev) => ({ ...prev, [name]: e.target.value }))
              }
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </label>
      ))}
    </div>
  );

  const renderCheckboxGroup = (
    name: string,
    options: string[],
    selected: string[],
    toggle: (v: string) => void,
  ) => (
    <div className="q-options-grid">
      {options.map((opt) => (
        <label
          key={opt}
          className={`q-option-card ${selected.includes(opt) ? 'q-option-selected' : ''}`}
        >
          <input
            type="checkbox"
            name={name}
            value={opt}
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
          />
          <span className="q-option-check" />
          <span className="q-option-label">{opt}</span>
          {opt === 'Other' && selected.includes('Other') && (
            <input
              type="text"
              className="q-other-input"
              placeholder="Please specify..."
              value={otherFields[name] ?? ''}
              onChange={(e) =>
                setOtherFields((prev) => ({ ...prev, [name]: e.target.value }))
              }
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </label>
      ))}
    </div>
  );

  /* ═══════════════════════════════════════════
     Section renderers
     ═══════════════════════════════════════════ */

  const renderSectionContent = () => {
    switch (currentSection) {
      /* ── Step 1: Your Role ── */
      case 0:
        return (
          <>
            <div className="q-question-block">
              <h3 className="q-question-title">1. What is your current job title?</h3>
              {renderRadioGroup('jobTitle', jobTitles, jobTitle, setJobTitle)}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">2. How would you describe your seniority level?</h3>
              <p className="q-question-hint">This helps us match you with peers at a similar stage.</p>
              {renderRadioGroup('seniorityLevel', seniorityLevels, seniorityLevel, setSeniorityLevel)}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">3. Which department do you primarily work in?</h3>
              {renderRadioGroup('department', departmentsList, department, setDepartment)}
            </div>
          </>
        );

      /* ── Step 2: Your Company ── */
      case 1:
        return (
          <>
            <div className="q-question-block">
              <h3 className="q-question-title">4. What type of company do you work for?</h3>
              {renderRadioGroup('companyType', companyTypes, companyType, setCompanyType)}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">5. Which industry does your organization belong to? <span className="q-multi-hint">(Select all that apply)</span></h3>
              {renderCheckboxGroup('industry', industriesList, selectedIndustries, (v) => toggleMulti(setSelectedIndustries, v))}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">6. How many years of professional experience do you have? <span className="q-multi-hint">(Optional)</span></h3>
              {renderRadioGroup('yearsExperience', yearsOptions, yearsExperience, setYearsExperience)}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">7. How many employees does your organization have?</h3>
              {renderRadioGroup('companySize', companySizeOptions, companySize, setCompanySize)}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">8. What is your company's approximate annual revenue? <span className="q-multi-hint">(Optional)</span></h3>
              <p className="q-question-hint">This helps us connect you with peers managing similar business scales.</p>
              {renderRadioGroup('annualRevenue', revenueOptions, annualRevenue, setAnnualRevenue)}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">9. What is your company's primary market?</h3>
              {renderRadioGroup('primaryMarket', marketOptions, primaryMarket, setPrimaryMarket)}
            </div>
          </>
        );

      /* ── Step 3: Your Goals ── */
      case 2:
        return (
          <>
            <div className="q-question-block">
              <h3 className="q-question-title">10. Why are you joining this community?</h3>
              <p className="q-question-hint">Select your primary reason.</p>
              {renderRadioGroup('joinReason', joinReasons, joinReason, setJoinReason)}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">11. What is your biggest professional challenge right now?</h3>
              <p className="q-question-hint">Select the one that fits best.</p>
              {renderRadioGroup('biggestChallenge', challengeOptions, biggestChallenge, setBiggestChallenge)}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">12. What type of content would be most useful to you? <span className="q-multi-hint">(Select all that apply)</span></h3>
              {renderCheckboxGroup('contentPreference', contentTypes, selectedContent, (v) => toggleMulti(setSelectedContent, v))}
            </div>
          </>
        );

      /* ── Step 4: Background & Location ── */
      case 3:
        return (
          <>
            <div className="q-question-block">
              <h3 className="q-question-title">13. What is your highest level of education completed?</h3>
              {renderRadioGroup('educationLevel', educationLevels, educationLevel, setEducationLevel)}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">14. What was your primary field of study?</h3>
              {renderRadioGroup('fieldOfStudy', fieldsOfStudy, fieldOfStudy, setFieldOfStudy)}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">15. In which year did you graduate from your highest level of education?</h3>
              <input
                type="number"
                className="q-text-input"
                placeholder="e.g. 2020"
                min="1950"
                max={new Date().getFullYear()}
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
              />
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">16. What is your current occupation status?</h3>
              {renderRadioGroup('occupationStatus', occupationStatuses, occupationStatus, setOccupationStatus)}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">17. In which country do you currently reside?</h3>
              <input
                type="text"
                className="q-text-input"
                placeholder="Start typing your country"
                list="q-country-options"
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
              />
              <datalist id="q-country-options">
                {countryOptions.map((opt) => (
                  <option key={opt} value={opt} />
                ))}
              </datalist>
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">18. In which province/state do you currently reside?</h3>
              <input
                type="text"
                className="q-text-input"
                placeholder={selectedCountryData ? 'Start typing your province/state' : 'Select a country first'}
                list="q-state-options"
                value={provinceState}
                onChange={(e) => handleStateChange(e.target.value)}
                disabled={!selectedCountryData}
              />
              <datalist id="q-state-options">
                {stateOptions.map((opt) => (
                  <option key={opt} value={opt} />
                ))}
              </datalist>
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">19. Which city do you currently live in?</h3>
              <input
                type="text"
                className="q-text-input"
                placeholder={selectedStateData ? 'Start typing your city' : 'Select a province/state first'}
                list="q-city-options"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!selectedStateData}
              />
              <datalist id="q-city-options">
                {cityOptions.map((opt) => (
                  <option key={opt} value={opt} />
                ))}
              </datalist>
            </div>
          </>
        );

      /* ── Step 5: Preferences & Consent ── */
      case 4:
        return (
          <>
            <div className="q-question-block">
              <h3 className="q-question-title">20. What languages are you proficient in? <span className="q-multi-hint">(Select all that apply)</span></h3>
              {renderCheckboxGroup('languages', languagesList, selectedLanguages, (v) => toggleMulti(setSelectedLanguages, v))}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">21. What are your primary interests? <span className="q-multi-hint">(Select all that apply)</span></h3>
              {renderCheckboxGroup('hobbies', hobbiesList, selectedHobbies, (v) => toggleMulti(setSelectedHobbies, v))}
            </div>
            {/* <div className="q-question-block">
              <h3 className="q-question-title">22. Are you willing to be a part of this research platform?</h3>
              {renderRadioGroup('participationConsent', consentOptions, participationConsent, setParticipationConsent)}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">23. If you agreed to participate, how would you prefer to be contacted?</h3>
              {renderRadioGroup('contactPreference', contactOptions, contactPreference, setContactPreference)}
            </div> */}
          </>
        );

      default:
        return null;
    }
  };

  if (checkingAuth) {
    return (
      <main className="q-page">
        <div className="q-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="q-page">
      <div className="q-container">
        {/* Header */}
        <header className="q-header">
          <div className="q-brand-mark" />
          <div>
            <p className="q-brand-name">B2B INSIGHTS COMMUNITY</p>
            <h1 className="q-title">Welcome — Let's Get You Set Up</h1>
            <p className="q-subtitle">
              Answer a few quick questions so we can route you to the right content, groups, and peers.
              We'll learn more about you over time — no need to share everything now.
            </p>
          </div>
        </header>

        {/* Progress */}
        <div className="q-progress-wrapper">
          <div className="q-progress-bar">
            <div className="q-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="q-progress-info">
            <span className="q-progress-section">
              Step {SECTIONS[currentSection].key}: {SECTIONS[currentSection].title}
            </span>
            <span className="q-progress-step">
              {currentSection + 1} of {SECTIONS.length}
            </span>
          </div>
        </div>

        {/* Section tabs */}
        <nav className="q-tabs">
          {SECTIONS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              className={`q-tab ${i === currentSection ? 'q-tab-active' : ''} ${i < currentSection ? 'q-tab-done' : ''}`}
              onClick={() => {
                if (i < currentSection) {
                  setErrorMessage('');
                  setCurrentSection(i);
                }
              }}
              disabled={i > currentSection}
            >
              <span className="q-tab-key">{s.key}</span>
              <span className="q-tab-label">{s.title}</span>
            </button>
          ))}
        </nav>

        {/* Questions */}
        <form className="q-form" onSubmit={handleSubmit}>
          <div className="q-section-card">
            <h2 className="q-section-heading">
              Step {SECTIONS[currentSection].key} — {SECTIONS[currentSection].title}
            </h2>
            {renderSectionContent()}
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="q-error">
              <span className="q-error-icon">!</span>
              {errorMessage}
            </div>
          )}

          {/* Navigation */}
          <div className="q-nav-buttons">
            {currentSection > 0 && (
              <button type="button" className="q-btn q-btn-back" onClick={handleBack}>
                ← Previous
              </button>
            )}
            <div className="q-nav-spacer" />
            {currentSection < SECTIONS.length - 1 ? (
              <button type="button" className="q-btn q-btn-next" onClick={handleNext}>
                Next Step →
              </button>
            ) : (
              <button type="submit" className="q-btn q-btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Questionnaire'}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
};

export const TestQuestionnaire = () => <Questionnaire testMode />;

export default Questionnaire;
