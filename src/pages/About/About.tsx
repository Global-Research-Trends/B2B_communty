import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header/Header.tsx';
import Footer from '../../components/Footer/Footer.tsx';
import './About.css';

const About: React.FC = () => {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [activeValue, setActiveValue] = useState(0);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.08 }
    );
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);

  const principles = [
    {
      number: '01',
      title: 'Verified Authority',
      body: 'Every member undergoes a rigorous vetting process. We verify credentials, confirm seniority, and validate industry standing before granting access. There are no exceptions.',
    },
    {
      number: '02',
      title: 'Intentional Connection',
      body: 'We reject the premise that more connections equal more value. Our AI matches executives based on strategic alignment, not algorithmic volume. Every introduction is deliberate.',
    },
    {
      number: '03',
      title: 'Confidential by Default',
      body: 'Conversations, profiles, and engagements within our platform are governed by strict confidentiality standards. Your data is never sold, shared, or weaponized.',
    },
    {
      number: '04',
      title: 'Long-Term Thinking',
      body: 'We are building a generational institution — not chasing quarterly metrics. Every product decision, every admitted member, every partnership reflects a 10-year horizon.',
    },
  ];

  const leadership = [
    { initials: 'SM', name: 'Sarah Mitchell', title: 'Chief Executive Officer', tenure: 'Est. 2018' },
    { initials: 'JO', name: 'James Okonkwo', title: 'Chief Technology Officer', tenure: 'Est. 2019' },
    { initials: 'PA', name: 'Priya Anand', title: 'Head of Community', tenure: 'Est. 2020' },
    { initials: 'DR', name: 'Daniel Reyes', title: 'Head of Partnerships', tenure: 'Est. 2021' },
    { initials: 'LC', name: 'Laura Chen', title: 'Chief Revenue Officer', tenure: 'Est. 2022' },
  ];

  const numbers = [
    { value: '5,000+', label: 'Verified Members' },
    { value: '75+', label: 'Industries' },
    { value: '$2.4B', label: 'Deals Facilitated' },
    { value: '40+', label: 'Countries' },
  ];

  return (
    <div className="ap-root">

      {/* ── NAVBAR ── */}
      <Header />

      {/* ── HERO — Editorial Typographic ── */}
      <section className="ap-hero">
        <div className="ap-hero__inner">
          <div className="ap-hero__meta">
            <span className="ap-rule-line" />
            <span className="ap-meta-text">About Us &nbsp;·&nbsp; Since 2018</span>
          </div>
          <h1 className="ap-hero__headline">
            <span className="ap-hero__line">We exist</span>
            <span className="ap-hero__line ap-hero__line--indent">to elevate</span>
            <span className="ap-hero__line">
              <em>the way</em>
            </span>
            <span className="ap-hero__line ap-hero__line--indent">leaders</span>
            <span className="ap-hero__line">connect.</span>
          </h1>
          <div className="ap-hero__aside">
            <p className="ap-hero__sub">
              B2B Community is the world's most selective professional network for senior business leaders. We curate the conditions for consequential conversation.
            </p>
            <a href="#mission" className="ap-hero__scroll">
              <span>Read our story</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
          </div>
        </div>
        <div className="ap-hero__stats">
          {numbers.map((n, i) => (
            <div className="ap-hero__stat" key={i}>
              <strong>{n.value}</strong>
              <span>{n.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── MISSION — Manifesto Style ── */}
      <section
        id="mission"
        ref={(el) => { sectionRefs.current['mission'] = el; }}
        className={`ap-section ap-manifesto ${isVisible['mission'] ? 'ap-visible' : ''}`}
      >
        <div className="ap-manifesto__inner">
          <div className="ap-manifesto__label">
            <span className="ap-folio">01</span>
            <span className="ap-label-text">Our Mission</span>
          </div>
          <div className="ap-manifesto__body">
            <h2 className="ap-manifesto__statement">
              The world's best ideas don't live in boardrooms.<br />
              They emerge when the right leaders<br />
              <span className="ap-red-text">find each other.</span>
            </h2>
            <div className="ap-manifesto__columns">
              <p>
                B2B Community was founded on a conviction: that traditional networking is broken. It rewards volume over value, speed over substance, and connection counts over actual consequence. We built the antidote.
              </p>
              <p>
                Our platform carefully engineers the conditions under which senior executives can share knowledge, build strategic alliances, and access opportunities that genuinely move the needle — without the noise that has come to define professional networking.
              </p>
            </div>
            <div className="ap-manifesto__pull">
              <div className="ap-pull-rule" />
              <blockquote>
                "Quality of connection is the only metric that matters."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRINCIPLES — Accordion List ── */}
      <section
        id="principles"
        ref={(el) => { sectionRefs.current['principles'] = el; }}
        className={`ap-section ap-principles ${isVisible['principles'] ? 'ap-visible' : ''}`}
      >
        <div className="ap-principles__inner">
          <div className="ap-principles__header">
            <span className="ap-folio">02</span>
            <h2 className="ap-section-title">What We Stand For</h2>
          </div>
          <div className="ap-principles__list">
            {principles.map((p, i) => (
              <div
                key={i}
                className={`ap-principle ${activeValue === i ? 'ap-principle--active' : ''}`}
                onClick={() => setActiveValue(i)}
              >
                <div className="ap-principle__header">
                  <span className="ap-principle__num">{p.number}</span>
                  <h3 className="ap-principle__title">{p.title}</h3>
                  <div className="ap-principle__toggle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d={activeValue === i ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
                    </svg>
                  </div>
                </div>
                <div className="ap-principle__body">
                  <p>{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE — Horizontal Rule Style ── */}
      <section
        id="history"
        ref={(el) => { sectionRefs.current['history'] = el; }}
        className={`ap-section ap-history ${isVisible['history'] ? 'ap-visible' : ''}`}
      >
        <div className="ap-history__inner">
          <div className="ap-history__header">
            <span className="ap-folio">03</span>
            <h2 className="ap-section-title">A Brief History</h2>
          </div>
          <div className="ap-history__track">
            <div className="ap-history__rail" />
            {[
              { year: '2018', event: 'Founded', detail: '50 hand-picked executives. One shared belief.' },
              { year: '2019', event: 'First 1K Members', detail: 'Expanded to London and Singapore.' },
              { year: '2021', event: 'Series A', detail: '$12M raised. AI matching engine launched.' },
              { year: '2022', event: 'Global Reach', detail: '40 countries. 75+ industries represented.' },
              { year: '2024', event: 'Enterprise Tier', detail: 'Survey intelligence services introduced.' },
              { year: '2025', event: 'Platform 2.0', detail: 'Rebuilt for scale. Uncompromising quality.' },
            ].map((m, i) => (
              <div className="ap-history__node" key={i}>
                <div className="ap-history__dot" />
                <div className="ap-history__year">{m.year}</div>
                <div className="ap-history__event">{m.event}</div>
                <div className="ap-history__detail">{m.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP — Dark Strip ── */}
      <section
        id="leadership"
        ref={(el) => { sectionRefs.current['leadership'] = el; }}
        className={`ap-leadership ${isVisible['leadership'] ? 'ap-visible' : ''}`}
      >
        <div className="ap-leadership__inner">
          <div className="ap-leadership__header">
            <div className="ap-leadership__label">
              <span className="ap-folio ap-folio--light">04</span>
              <h2 className="ap-section-title ap-section-title--light">The Leadership</h2>
            </div>
            <p className="ap-leadership__sub">
              Operators and strategists who have led at the world's most consequential organizations.
            </p>
          </div>
          <div className="ap-leadership__grid">
            {leadership.map((m, i) => (
              <div className="ap-leader-card" key={i}>
                <div className="ap-leader-card__avatar">{m.initials}</div>
                <div className="ap-leader-card__info">
                  <span className="ap-leader-card__tenure">{m.tenure}</span>
                  <h3 className="ap-leader-card__name">{m.name}</h3>
                  <p className="ap-leader-card__title">{m.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMITMENT — Red Accent Block ── */}
      <section
        id="commitment"
        ref={(el) => { sectionRefs.current['commitment'] = el; }}
        className={`ap-section ap-commitment ${isVisible['commitment'] ? 'ap-visible' : ''}`}
      >
        <div className="ap-commitment__inner">
          <div className="ap-commitment__left">
            <span className="ap-folio">05</span>
            <h2 className="ap-section-title">Our Commitment<br />to You</h2>
            <a href="#" className="ap-text-link">
              View membership standards
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          </div>
          <div className="ap-commitment__right">
            {[
              { label: 'Time Respect', desc: 'Opportunities are concise, targeted, and always worth your attention.' },
              { label: 'Curated Access', desc: 'Every member you meet has been vetted to the same standard as you.' },
              { label: 'Zero Spam', desc: 'No cold outreach. No irrelevant pings. Signal only, always.' },
              { label: 'Privacy First', desc: 'Your data, your network, your control. We never monetize your identity.' },
              { label: 'Continuous Value', desc: 'Events, insights, and introductions that compound over time.' },
            ].map((item, i) => (
              <div className="ap-commitment__item" key={i}>
                <div className="ap-commitment__item-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="ap-commitment__item-content">
                  <strong>{item.label}</strong>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        id="ap-cta"
        ref={(el) => { sectionRefs.current['ap-cta'] = el; }}
        className={`ap-cta ${isVisible['ap-cta'] ? 'ap-visible' : ''}`}
      >
        <div className="ap-cta__inner">
          <div className="ap-cta__left">
            <span className="ap-label-text ap-label-text--dim">Membership</span>
            <h2 className="ap-cta__headline">
              Ready to join<br />the network?
            </h2>
          </div>
          <div className="ap-cta__right">
            <p>Selective admission. Verified members.<br />Real, consequential opportunities.</p>
            <div className="ap-cta__actions">
              <button className="ap-cta__btn ap-cta__btn--primary">Apply for Membership</button>
              <button className="ap-cta__btn ap-cta__btn--ghost">Request Information</button>
            </div>
            <p className="ap-cta__note">Limited spots available each quarter.</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />

    </div>
  );
};

export default About;

