import { useMemo, useState } from 'react';
import { signOut } from 'aws-amplify/auth';
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

const navigation = ['Dashboard', 'Community', 'Profile', 'Reports', 'Settings'];

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

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
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
            alt="Alex Morgan"
            className="sidebar-avatar-img"
          />
          <div className="sidebar-avatar-info">
            <span className="sidebar-avatar-name">Alex Morgan</span>
            <span className="sidebar-avatar-role">Marketing Director</span>
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
          <ProfilePage onBack={() => setActiveView('Dashboard')} />
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


