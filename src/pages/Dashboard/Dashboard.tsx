import { useEffect, useMemo, useState } from 'react';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import ProfilePage from '../profile/profile';

const surveys = [
  {
    id: '1',
    title: 'Consumer Behavior Study 2024',
    company: 'Acme Corp',
    surveyType: 'Opinion',
    incentive: '$15',
    completionTime: 15,
    lastActivity: '2 mins ago',
    status: 'Active',
    participants: 230
  },
  {
    id: '2',
    title: 'Technology Adoption Survey',
    company: 'Globex Inc',
    surveyType: 'Measure',
    incentive: '$75',
    completionTime: 20,
    lastActivity: '3 days ago',
    status: 'Active',
    participants: 182
  },
  {
    id: '3',
    title: 'Food Preferences Analysis',
    company: 'Soylent Corp',
    surveyType: 'Quick Poll',
    incentive: '$25',
    completionTime: 10,
    lastActivity: '1 week ago',
    status: 'Paused',
    participants: 157
  },
  {
    id: '4',
    title: 'Healthcare Service Feedback',
    company: 'Opinion',
    surveyType: 'Measure',
    incentive: '$15',
    completionTime: 25,
    lastActivity: '2 hours ago',
    status: 'Active',
    participants: 94
  }
];

const discussionCards = [
  {
    id: 'd1',
    author: 'BrainyOlivia',
    initials: 'BO',
    title: 'What is the best way to stay consistent with learning?',
    replies: 120,
    tags: ['LearningHabits', 'Motivation', 'TimeManagement'],
  },
  {
    id: 'd2',
    author: 'Katie02',
    initials: 'K2',
    title: 'How I landed a freelance gig after finishing strategy training',
    replies: 43,
    tags: ['CareerJourney', 'Freelancing', 'BusinessCourse'],
  },
];

const peerGroups = [
  {
    id: 'g1',
    name: 'Business and Leadership Learners',
    description: 'For founders, marketers, and business strategists shaping modern teams.',
    members: '4.2k',
  },
  {
    id: 'g2',
    name: 'Design and Creative Circle',
    description: 'A space for UX, product, and visual storytellers to exchange practical workflows.',
    members: '3.5k',
  },
  {
    id: 'g3',
    name: 'Web Developers Unite',
    description: 'Frontend, backend, and full-stack professionals building better products.',
    members: '5.1k',
  },
];

const trendingHashtags = [
  'LearningStreak',
  'BuiltWithCode',
  'DesignInspo',
  'AskTheCommunity',
  'ChallengeAccepted',
  'CareerSwitch',
  'StudySetup',
  'MyFirstCourse',
  'WomenInTech',
  'DailyWin',
];

const peopleToFollow = [
  { id: 'p1', name: 'Uchiha_Obito', role: 'UX Enthusiast' },
  { id: 'p2', name: 'Karina01', role: 'Designer' },
  { id: 'p3', name: 'Designerzzz', role: 'Full-Stack Designer' },
  { id: 'p4', name: 'StuartSmart', role: 'Mobile App Developer' },
  { id: 'p5', name: 'OliviaRod01', role: 'Web Designer' },
];

const navigation = ['Dashboard', 'Community', 'Profile', 'Reports', 'Settings'];

type DashboardUserProfile = {
  displayName: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  emailVerified: boolean;
  jobTitle: string;
};

const notProvided = 'Not provided';

const getValueOrFallback = (value?: string) => {
  const normalized = value?.trim();
  return normalized ? normalized : notProvided;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type: 'all',
    duration: 'all'
  });
  const [showWithdrawOptions, setShowWithdrawOptions] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState('cash');
  const [activeView, setActiveView] = useState('Dashboard');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userProfile, setUserProfile] = useState<DashboardUserProfile>({
    displayName: 'User',
    fullName: notProvided,
    email: notProvided,
    phone: notProvided,
    location: notProvided,
    emailVerified: false,
    jobTitle: notProvided,
  });

  const profileCompletion = 65;
  const engagementScore = 78;
  const currentEarnings = 85;
  const payoutGoal = 100;
  const payoutRemaining = 15;
  const totalWithdrawable = 85;
  const withdrawOptions = ['cash', 'voucher', 'gift card'];

  const filteredSurveys = useMemo(() => {
    return surveys.filter((survey) => {
      if (filters.type !== 'all' && survey.surveyType !== filters.type) return false;

      if (filters.duration === 'short' && survey.completionTime > 15) return false;
      if (filters.duration === 'medium' && (survey.completionTime <= 15 || survey.completionTime > 20)) return false;
      if (filters.duration === 'long' && survey.completionTime <= 20) return false;

      return true;
    });
  }, [filters]);

  const activeFilters = Object.values(filters).filter((value) => value !== 'all').length;

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const [currentUser, attributes] = await Promise.all([
          getCurrentUser(),
          fetchUserAttributes(),
        ]);

        const firstName = attributes.given_name?.trim() ?? '';
        const lastName = attributes.family_name?.trim() ?? '';
        const fullName = `${firstName} ${lastName}`.trim();
        const displayName = fullName || attributes.name?.trim() || currentUser.username || 'User';

        setUserProfile({
          displayName,
          fullName: getValueOrFallback(fullName || attributes.name),
          email: getValueOrFallback(attributes.email),
          phone: getValueOrFallback(attributes.phone_number),
          location: getValueOrFallback(attributes.locale),
          emailVerified: attributes.email_verified === 'true',
          jobTitle: getValueOrFallback(attributes['custom:job_title']),
        });
      } catch {
        setUserProfile((prev) => ({
          ...prev,
          displayName: 'User',
        }));
      }
    };

    void loadUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      //await signOut();
      navigate('/auth');
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <p className="sidebar-kicker">Global Research Trends</p>
          <h3 className="sidebar-title">Workspace</h3>
        </div>

        {/* Profile Avatar in Sidebar */}
        <div className="sidebar-profile-avatar" onClick={() => setActiveView('Profile')}>
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            alt={userProfile.displayName}
            className="sidebar-avatar-img"
          />
          <div className="sidebar-avatar-info">
            <span className="sidebar-avatar-name">{userProfile.displayName}</span>
            <span className="sidebar-avatar-role">{userProfile.jobTitle}</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Dashboard sections">
          {navigation.map((item) => (
            <button
              key={item}
              className={`sidebar-link ${item === activeView ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveView(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </aside>

      {activeView === 'Profile' ? (
        <section className="dashboard">
          <ProfilePage onBack={() => setActiveView('Dashboard')} profileData={userProfile} />
        </section>
      ) : activeView === 'Community' ? (
        <section className="dashboard dashboard-community-view">
          <section className="community-topbar">
            <input
              className="community-search"
              type="search"
              placeholder="Search discussions, groups, members..."
              aria-label="Search dashboard community"
            />
            <div className="community-topbar-right">
              <button type="button" className="community-icon-btn">Mail</button>
              <button type="button" className="community-icon-btn">Alerts</button>
              <div className="community-user-pill">
                <span className="community-user-avatar">{userProfile.displayName.slice(0, 1).toUpperCase()}</span>
                <span className="community-user-name">{userProfile.displayName}</span>
              </div>
            </div>
          </section>

          <section className="community-layout">
            <div className="community-main">
              <section className="community-section">
                <div className="community-section-head">
                  <h2>Trending Discussions</h2>
                  <button type="button" className="community-link-btn">See More</button>
                </div>
                <div className="discussion-grid">
                  {discussionCards.map((discussion) => (
                    <article key={discussion.id} className="discussion-card">
                      <div className="discussion-author">
                        <span className="discussion-avatar">{discussion.initials}</span>
                        <span className="discussion-name">{discussion.author}</span>
                      </div>
                      <h3>{discussion.title}</h3>
                      <p>{discussion.replies} replies</p>
                      <div className="discussion-tags">
                        {discussion.tags.map((tag) => (
                          <span key={tag} className="discussion-tag">{tag}</span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="community-section">
                <div className="community-section-head">
                  <h2>Peer Groups</h2>
                  <button type="button" className="community-link-btn">See More</button>
                </div>
                <div className="group-list">
                  {peerGroups.map((group) => (
                    <article key={group.id} className="group-card">
                      <div className="group-thumb" aria-hidden="true" />
                      <div className="group-copy">
                        <h3>{group.name}</h3>
                        <p>{group.description}</p>
                        <span>{group.members} members</span>
                      </div>
                      <button type="button" className="secondary-button group-join-btn">Join Group</button>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="community-rail">
              <article className="community-event-card">
                <h3>Live Session This Friday: Designing for Impact</h3>
                <p>May 24, 6:00 PM (GMT)</p>
                <p>Join our expert-led workshop on practical B2B UX patterns and research-backed decisions.</p>
                <button type="button" className="community-event-btn">Save Your Seat</button>
              </article>

              <article className="community-side-card">
                <h3>Trending Hashtags</h3>
                <div className="hashtag-list">
                  {trendingHashtags.map((tag) => (
                    <span key={tag} className="hashtag-chip">{tag}</span>
                  ))}
                </div>
              </article>

              <article className="community-side-card">
                <h3>People to Follow</h3>
                <div className="follow-list">
                  {peopleToFollow.map((person) => (
                    <div key={person.id} className="follow-row">
                      <div>
                        <p>{person.name}</p>
                        <span>{person.role}</span>
                      </div>
                      <button type="button" className="community-follow-btn">Follow</button>
                    </div>
                  ))}
                </div>
              </article>
            </aside>
          </section>
        </section>
      ) : (
      <section className="dashboard">
        <section className="dashboard-hero">
          <div>
            <p className="dashboard-kicker">Research Operations</p>
            <h1 className="dashboard-title">Dashboard Overview</h1>
            <p className="dashboard-subtitle">
              Monitor survey performance, response quality, and panel activity from one workspace.
            </p>
          </div>
          <button className="primary-button">Export Report</button>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <p className="stat-label">Profile Completion</p>
            <h2 className="stat-value">{profileCompletion}%</h2>
            <div className="profile-progress-track" aria-hidden="true">
              <div className="profile-progress-fill" />
            </div>
            <p className="stat-meta">Complete your profile to access additional features</p>
          </article>

          <article className="stat-card engagement-card">
            <div className="engagement-header">
              <p className="stat-label">Engagement Score</p>
              <span className="health-pill">High</span>
            </div>
            <div className="engagement-body">
              <div className="engagement-ring" aria-hidden="true">
                <span>{engagementScore}</span>
              </div>
              <div className="engagement-copy">
                <h3>Strong Standing</h3>
                <p>Based on survey completion and account activity</p>
              </div>
            </div>
          </article>

          <article className="stat-card earnings-card">
            <p className="stat-label">Earnings Progress</p>
            <div className="earnings-visual">
              <div className="earnings-badge">
                <span className="earnings-badge-value">${currentEarnings}</span>
                <span className="earnings-badge-label">Current</span>
              </div>
              <div className="earnings-metrics">
                <div className="earnings-metric">
                  <p>Next Payout</p>
                  <strong>${payoutGoal}</strong>
                </div>
                <div className="earnings-metric">
                  <p>Remaining</p>
                  <strong>${payoutRemaining}</strong>
                </div>
              </div>
            </div>
            <p className="stat-meta">You are ${payoutRemaining} away from your next ${payoutGoal} payout.</p>
          </article>

          <article className="stat-card withdraw-card">
            <div className="withdraw-head">
              <p className="stat-label">Withdrawal Options</p>
              <span className="withdraw-amount">${totalWithdrawable}</span>
            </div>
            <button
              type="button"
              className="withdraw-toggle"
              onClick={() => setShowWithdrawOptions((prev) => !prev)}
            >
              Withdraw Funds
            </button>
            <div className={`withdraw-options ${showWithdrawOptions ? 'open' : ''}`}>
              {withdrawOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`withdraw-option ${withdrawMethod === option ? 'active' : ''}`}
                  onClick={() => setWithdrawMethod(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="withdraw-foot">
              <p className="withdraw-total">Total withdrawable balance</p>
              <p className="stat-meta">Selected method: {withdrawMethod}</p>
            </div>
          </article>
        </section>

        <section className="surveys-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Available Surveys</h3>
              <p className="panel-subtitle">
                Recommended for you
              </p>
            </div>
            <div className="filters">
              <select
                className="filter-select"
                value={filters.type}
                onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))}
              >
                <option value="all">All types</option>
                <option value="Opinion">Opinion</option>
                <option value="Number">Measure</option>
                <option value="Quick Poll">Quick Poll</option>
              </select>

              <select
                className="filter-select"
                value={filters.duration}
                onChange={(event) => setFilters((prev) => ({ ...prev, duration: event.target.value }))}
              >
                <option value="all">Any duration</option>
                <option value="short">0-15 min</option>
                <option value="medium">16-20 min</option>
                <option value="long">21+ min</option>
              </select>

              <button
                className="secondary-button"
                onClick={() => setFilters({ type: 'all', duration: 'all' })}
              >
                Reset {activeFilters > 0 ? `(${activeFilters})` : ''}
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="surveys-table">
              <thead>
                <tr>
                  <th>Survey</th>
                  <th>Time</th>
                  <th>Participants</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSurveys.map((survey) => (
                  <tr key={survey.id}>
                    <td>
                      <div className="survey-cell">
                        <p className="survey-title">{survey.title}</p>
                        <p className="survey-company">{survey.company}</p>
                      </div>
                    </td>
                    <td>{survey.completionTime} min</td>
                    <td>{survey.participants}</td>
                    <td>
                      <span className={`status-pill ${survey.status === 'Active' ? 'active' : 'paused'}`}>
                        {survey.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredSurveys.length === 0 && (
              <div className="empty-state">
                <p>No surveys match the selected filters.</p>
              </div>
            )}
          </div>
        </section>
      </section>
      )}
    </main>
  );
};

export default Dashboard;


