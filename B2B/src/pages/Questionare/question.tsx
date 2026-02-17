import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import './question.css';

const client = generateClient<Schema>();

/* ─── Question data ─── */

const educationLevels = [
  'High School Diploma or Equivalent',
  'Bachelor\'s Degree',
  'Master\'s Degree',
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

const organizationTypes = [
  'Public/Government Organization',
  'Private Sector',
  'Multinational Corporation',
  'Non-Governmental Organization (NGO)',
  'Non-Profit Organization',
  'Educational Institution',
  'Healthcare / Hospital',
  'Startup Company',
  'Family Business',
  'Self-employed / Solo Practice',
  'Currently not employed',
  'Other',
];

const industries = [
  'Technology / Software / IT Services',
  'Healthcare / Pharmaceuticals / Biotechnology',
  'Finance / Banking / Insurance',
  'Education / Training / Research',
  'Manufacturing / Production',
  'Retail / E-commerce / Wholesale',
  'Construction / Real Estate',
  'Transportation / Logistics / Supply Chain',
  'Energy / Utilities / Mining',
  'Agriculture / Forestry / Fishing',
  'Telecommunications',
  'Media / Entertainment / Publishing',
  'Hospitality / Tourism / Travel',
  'Food & Beverage',
  'Professional Services (Legal, Consulting, Accounting)',
  'Government / Public Administration',
  'Non-Profit / Social Services',
  'Defense / Aerospace',
  'Automotive',
  'Other',
];

const departments = [
  'Executive / Senior Management',
  'Operations / Production',
  'Sales / Business Development',
  'Marketing / Advertising / Public Relations',
  'Customer Service / Support',
  'Human Resources / People Operations',
  'Finance / Accounting / Treasury',
  'Information Technology / IT Support',
  'Research & Development / Innovation',
  'Legal / Compliance',
  'Quality Assurance / Quality Control',
  'Supply Chain / Procurement / Purchasing',
  'Project Management',
  'Administration / Office Management',
  'Product Development / Product Management',
  'Data Analytics / Business Intelligence',
  'Engineering / Technical',
  'Design / Creative Services',
  'Training / Learning & Development',
  'Other',
];

const roleLevels = [
  'C-Level Executive (CEO, CFO, CTO, etc.)',
  'Vice President / Director',
  'Senior Manager / Department Head',
  'Manager / Team Lead',
  'Supervisor / Team Coordinator',
  'Senior Professional / Senior Specialist',
  'Professional / Specialist',
  'Junior Professional / Associate',
  'Entry-Level / Trainee',
  'Intern / Apprentice',
  'Consultant / Advisor',
  'Contractor',
  'Other',
];

const yearsOptions = [
  'Less than 1 year',
  '1-2 years',
  '3-5 years',
  'More than 10 years',
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

const consentOptions = [
  'Yes, I am willing to participate',
  'No, I do not wish to participate',
  'I need more information before deciding',
];

const contactOptions = [
  'Email',
  'Phone call',
  
];

/* ─── Sections ─── */

const SECTIONS = [
  { key: 'A', title: 'Educational Background' },
  { key: 'B', title: 'Current Occupation & Employment' },
  { key: 'C', title: 'Personal Information & Demographics' },
  { key: 'D', title: 'Interests & Lifestyle' },
  { key: 'E', title: 'Additional Information' },
  { key: 'F', title: 'Research Participation Consent' },
] as const;

/* ─── Component ─── */

const Questionnaire = () => {
  const navigate = useNavigate();

  /* form state */
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [otherFields, setOtherFields] = useState<Record<string, string>>({});

  /* answers */
  const [educationLevel, setEducationLevel] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [graduationYear, setGraduationYear] = useState('');

  const [occupationStatus, setOccupationStatus] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [department, setDepartment] = useState('');
  const [roleLevel, setRoleLevel] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');

  const [provinceState, setProvinceState] = useState('');
  const [city, setCity] = useState('');

  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const [participationConsent, setParticipationConsent] = useState('');
  const [contactPreference, setContactPreference] = useState('');

  /* auth guard – disabled for preview */
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       await getCurrentUser();
  //     } catch {
  //       navigate('/auth');
  //     }
  //   };
  //   void checkAuth();
  // }, [navigate]);

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

  const validateCurrentSection = (): boolean => {
    setErrorMessage('');
    switch (currentSection) {
      case 0:
        if (!educationLevel) { setErrorMessage('Please select your education level.'); return false; }
        if (!fieldOfStudy) { setErrorMessage('Please select your field of study.'); return false; }
        if (!graduationYear) { setErrorMessage('Please enter your graduation year.'); return false; }
        return true;
      case 1:
        if (!occupationStatus) { setErrorMessage('Please select your occupation status.'); return false; }
        if (!organizationType) { setErrorMessage('Please select your organization type.'); return false; }
        if (selectedIndustries.length === 0) { setErrorMessage('Please select at least one industry.'); return false; }
        if (!department) { setErrorMessage('Please select your department.'); return false; }
        if (!roleLevel) { setErrorMessage('Please select your role level.'); return false; }
        if (!yearsExperience) { setErrorMessage('Please select your years of experience.'); return false; }
        return true;
      case 2:
        if (!provinceState.trim()) { setErrorMessage('Please enter your province/state.'); return false; }
        if (!city.trim()) { setErrorMessage('Please enter your city.'); return false; }
        return true;
      case 3:
        if (selectedHobbies.length === 0) { setErrorMessage('Please select at least one hobby or interest.'); return false; }
        return true;
      case 4:
        if (selectedLanguages.length === 0) { setErrorMessage('Please select at least one language.'); return false; }
        return true;
      case 5:
        if (!participationConsent) { setErrorMessage('Please select a participation option.'); return false; }
        if (!contactPreference) { setErrorMessage('Please select a contact preference.'); return false; }
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

      await client.models.QuestionnaireResponse.create({
        owner: userId,
        educationLevel: resolveValue(educationLevel, 'educationLevel'),
        fieldOfStudy: resolveValue(fieldOfStudy, 'fieldOfStudy'),
        graduationYear,
        occupationStatus: resolveValue(occupationStatus, 'occupationStatus'),
        organizationType: resolveValue(organizationType, 'organizationType'),
        industry: JSON.stringify(resolveMulti(selectedIndustries, 'industry')),
        department: resolveValue(department, 'department'),
        roleLevel: resolveValue(roleLevel, 'roleLevel'),
        yearsExperience,
        provinceState: provinceState.trim(),
        city: city.trim(),
        hobbies: JSON.stringify(resolveMulti(selectedHobbies, 'hobbies')),
        languages: JSON.stringify(resolveMulti(selectedLanguages, 'languages')),
        participationConsent,
        contactPreference,
        completedAt: new Date().toISOString(),
      });

      navigate('/dashboard');
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

  /* ─── Section renderers ─── */

  const renderSectionContent = () => {
    switch (currentSection) {
      case 0:
        return (
          <>
            <div className="q-question-block">
              <h3 className="q-question-title">1. What is your highest level of education completed?</h3>
              {renderRadioGroup('educationLevel', educationLevels, educationLevel, setEducationLevel)}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">2. What was your primary field of study?</h3>
              {renderRadioGroup('fieldOfStudy', fieldsOfStudy, fieldOfStudy, setFieldOfStudy)}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">3. In which year did you graduate from your highest level of education?</h3>
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
          </>
        );

      case 1:
        return (
          <>
            <div className="q-question-block">
              <h3 className="q-question-title">4. What is your current occupation status?</h3>
              {renderRadioGroup('occupationStatus', occupationStatuses, occupationStatus, setOccupationStatus)}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">5. What type of organization do you currently work for?</h3>
              {renderRadioGroup('organizationType', organizationTypes, organizationType, setOrganizationType)}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">6. Which industry best describes your organization? <span className="q-multi-hint">(Select all that apply)</span></h3>
              {renderCheckboxGroup('industry', industries, selectedIndustries, (v) => toggleMulti(setSelectedIndustries, v))}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">7. In which department do you primarily work?</h3>
              {renderRadioGroup('department', departments, department, setDepartment)}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">8. What is your current role level in the organization?</h3>
              {renderRadioGroup('roleLevel', roleLevels, roleLevel, setRoleLevel)}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">9. How many years of professional experience do you have?</h3>
              {renderRadioGroup('yearsExperience', yearsOptions, yearsExperience, setYearsExperience)}
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="q-question-block">
              <h3 className="q-question-title">10. In which province/state do you currently reside?</h3>
              <input
                type="text"
                className="q-text-input"
                placeholder="Enter your province or state"
                value={provinceState}
                onChange={(e) => setProvinceState(e.target.value)}
              />
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">11. Which city do you currently live in?</h3>
              <input
                type="text"
                className="q-text-input"
                placeholder="Enter your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </>
        );

      case 3:
        return (
          <div className="q-question-block">
            <h3 className="q-question-title">12. What are your primary  interests? <span className="q-multi-hint">(Select all that apply)</span></h3>
            {renderCheckboxGroup('hobbies', hobbiesList, selectedHobbies, (v) => toggleMulti(setSelectedHobbies, v))}
          </div>
        );

      case 4:
        return (
          <div className="q-question-block">
            <h3 className="q-question-title">13. What languages are you proficient in? <span className="q-multi-hint">(Select all that apply)</span></h3>
            {renderCheckboxGroup('languages', languagesList, selectedLanguages, (v) => toggleMulti(setSelectedLanguages, v))}
          </div>
        );

      case 5:
        return (
          <>
            <div className="q-question-block">
              <h3 className="q-question-title">14. Are you willing to be a part of this research platform?</h3>
              {renderRadioGroup('participationConsent', consentOptions, participationConsent, setParticipationConsent)}
            </div>
            <div className="q-question-block">
              <h3 className="q-question-title">15. If you agreed to participate, how would you prefer to be contacted?</h3>
              {renderRadioGroup('contactPreference', contactOptions, contactPreference, setContactPreference)}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <main className="q-page">
      <div className="q-container">
        {/* Header */}
        <header className="q-header">
          <div className="q-brand-mark" />
          <div>
            <p className="q-brand-name">GLOBAL RESEARCH TRENDS</p>
            <h1 className="q-title">Getting Started</h1>
            <p className="q-subtitle">
              Please answer all questions honestly. We will try to connect you to people based on your responses.
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
              Section {SECTIONS[currentSection].key}: {SECTIONS[currentSection].title}
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
              Section {SECTIONS[currentSection].key} — {SECTIONS[currentSection].title}
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
                Next Section →
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

export default Questionnaire;
