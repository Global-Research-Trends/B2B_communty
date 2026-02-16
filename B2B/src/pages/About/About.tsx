import './About.css';

const values = [
  {
    title: 'Integrity First',
    description: 'We keep research transparent and verifiable so every decision is built on trusted data.'
  },
  {
    title: 'Quality at Scale',
    description: 'From respondent screening to reporting, we maintain consistent quality across every project.'
  },
  {
    title: 'Client Partnership',
    description: 'We work as an extension of your team, aligning research workflows with business outcomes.'
  }
];

const stats = [
  { value: '12+', label: 'Years in Market Insights' },
  { value: '430+', label: 'Enterprise Projects Delivered' },
  { value: '1.8M', label: 'Verified Survey Responses' },
  { value: '96%', label: 'Client Satisfaction Rate' }
];

const leaders = [
  { name: 'Amina Rahman', role: 'Chief Executive Officer' },
  { name: 'Daniel Price', role: 'VP, Research Operations' },
  { name: 'Sophia Chen', role: 'Director, Data Quality' }
];

function About() {
  return (
    <main className="about-shell">
      <section className="about-hero">
        <p className="about-kicker">About Us</p>
        <h1 className="about-title">Building Confident Decisions Through Better Research</h1>
        <p className="about-subtitle">
          We help organizations understand people, markets, and behavior with reliable panel data and clear
          reporting.
        </p>
      </section>

      <section className="about-story">
        <div className="about-story-copy">
          <h2>Our Story</h2>
          <p>
            PanelHub began as a small research operations team focused on one goal: making survey intelligence
            faster, cleaner, and more actionable for growing businesses.
          </p>
          <p>
            Today, we support cross-functional teams with end-to-end survey execution, response quality control,
            and insight delivery that supports strategic decisions.
          </p>
        </div>
        <div className="about-story-panel" aria-hidden="true">
          <div className="story-badge">
            <span>Trusted by product, marketing, and strategy teams</span>
          </div>
        </div>
      </section>

      <section className="about-stats" aria-label="Company highlights">
        {stats.map((item) => (
          <article key={item.label} className="about-stat">
            <h3>{item.value}</h3>
            <p>{item.label}</p>
          </article>
        ))}
      </section>

      <section className="about-values">
        <div className="about-values-head">
          <h2>What We Stand For</h2>
          <p>Our operating principles keep research outcomes accurate, fast, and business-ready.</p>
        </div>
        <div className="about-values-grid">
          {values.map((value) => (
            <article key={value.title} className="value-card">
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-team">
        <div className="about-team-head">
          <h2>Leadership</h2>
          <p>Experienced operators with deep expertise in insights, research, and data standards.</p>
        </div>
        <div className="about-team-grid">
          {leaders.map((leader) => (
            <article key={leader.name} className="leader-card">
              <div className="leader-avatar" aria-hidden="true">
                {leader.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')}
              </div>
              <h3>{leader.name}</h3>
              <p>{leader.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-cta">
        <h2>Partner With PanelHub</h2>
        <p>Need a reliable research partner for ongoing surveys and panel analytics?</p>
        <button type="button">Talk to Our Team</button>
      </section>
    </main>
  );
}

export default About;
