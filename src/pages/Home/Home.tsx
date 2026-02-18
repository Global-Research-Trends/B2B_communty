import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [isNavHidden, setIsNavHidden] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const lastScrollY = useRef(0);
  const isNavHiddenRef = useRef(isNavHidden);
  const downAccum = useRef(0);
  const upAccum = useRef(0);

  useEffect(() => {
    isNavHiddenRef.current = isNavHidden;
  }, [isNavHidden]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let ticking = false;
    const THRESHOLD = 14; // px required in one direction before toggling

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const previousY = lastScrollY.current;
          const delta = currentY - previousY;

          // Near top - always show and reset accumulators
          if (currentY < 100) {
            if (isNavHiddenRef.current) setIsNavHidden(false);
            downAccum.current = 0;
            upAccum.current = 0;
          } else {
            if (delta > 0) {
              // Scrolling down
              downAccum.current += delta;
              upAccum.current = 0;
              if (!isNavHiddenRef.current && downAccum.current > THRESHOLD) {
                setIsNavHidden(true);
                downAccum.current = 0;
              }
            } else if (delta < 0) {
              // Scrolling up
              upAccum.current += -delta;
              downAccum.current = 0;
              if (isNavHiddenRef.current && upAccum.current > THRESHOLD) {
                setIsNavHidden(false);
                upAccum.current = 0;
              }
            }
          }

          lastScrollY.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className={`navbar ${isNavHidden ? 'nav-hidden' : ''}`}>
        <div className="nav-content">
          <div className="nav-logo">Global Research Trends</div>
          <ul className="nav-menu">
            <li><a href="/about">About</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="nav-actions">
            <Link to="/auth" className="nav-btn nav-login">Sign In</Link>
            <Link to="/auth" className="nav-btn nav-signup">Request Access</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            A Trusted Network for
            <span className="highlight"> B2B Leaders</span>
          </h1>
          <p className="hero-subtitle">
            Connect with verified decision-makers, access qualified market intelligence, and advance strategic growth through a trusted B2B network.
          </p>
          <div className="hero-cta">
            <Link to="/auth" className="btn-primary">Join the Network</Link>
            <Link to="/auth" className="btn-secondary">Request Access</Link>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span>Scroll to Continue</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Trusted By Section - Client Logos */}
      <section 
        id="trusted-by" 
        ref={(el) => { sectionRefs.current['trusted-by'] = el; }}
        className={`trusted-section ${isVisible['trusted-by'] ? 'fade-in' : ''}`}
      >
        <p className="trusted-label">Trusted by Leaders at</p>
        <div className="logo-marquee">
          <div className="logo-track">
            <div className="company-logo">Microsoft</div>
            <div className="company-logo">Amazon</div>
            <div className="company-logo">IBM</div>
            <div className="company-logo">Oracle</div>
            <div className="company-logo">Salesforce</div>
            <div className="company-logo">SAP</div>
            <div className="company-logo">Adobe</div>
            <div className="company-logo">Cisco</div>
            {/* Duplicate for seamless loop */}
            <div className="company-logo">Microsoft</div>
            <div className="company-logo">Amazon</div>
            <div className="company-logo">IBM</div>
            <div className="company-logo">Oracle</div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section 
        id="stats" 
        ref={(el) => { sectionRefs.current['stats'] = el; }}
        className={`stats-section ${isVisible['stats'] ? 'fade-in' : ''}`}
      >
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">5,000+</div>
            <div className="stat-label">Active Members</div>
            <div className="stat-description">Verified B2B professionals</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">75+</div>
            <div className="stat-label">Industries</div>
            <div className="stat-description">Represented globally</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">200+</div>
            <div className="stat-label">Industry Events</div>
            <div className="stat-description">Workshops and peer sessions</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction Rate</div>
            <div className="stat-description">Member feedback</div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section 
        id="benefits" 
        ref={(el) => { sectionRefs.current['benefits'] = el; }}
        className={`benefits-section ${isVisible['benefits'] ? 'fade-in' : ''}`}
      >
        <div className="section-header">
          <h2 className="section-title">Why Join Our Network?</h2>
        </div>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3>Qualified Networking</h3>
            <p>Connect with verified executives and decision-makers across enterprise organizations and growth-stage companies.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <h3>Knowledge Library</h3>
            <p>Access curated resources, industry reports, case studies, and practical insights from experienced operators.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <h3>Expert-Led Sessions</h3>
            <p>Participate in focused workshops, webinars, and interactive sessions led by recognized industry experts.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h3>Growth Opportunities</h3>
            <p>Identify partnership opportunities, strategic alliances, and collaborations that support sustainable growth.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about" 
        ref={(el) => { sectionRefs.current['about'] = el; }}
        className={`about-section ${isVisible['about'] ? 'fade-in' : ''}`}
      >
        <div className="about-container">
          <div className="section-header">
            <h2 className="section-title">About Global Research Trends</h2>
            <p className="section-subtitle">Connecting business leaders with strategic opportunities</p>
          </div>
          
          <div className="about-content">
            <div className="about-text">
              <p className="about-paragraph">
                Global Research Trends is a professional network connecting strategic decision-makers with organizations seeking informed perspectives.
              </p>
              <p className="about-paragraph">
                Our platform matches participants to relevant opportunities based on role, expertise, and industry context.
              </p>
            </div>
            <div className="about-card">
              <h3 className="about-card-title">Why Leaders Choose Us</h3>
              <div className="about-features">
                <div className="about-feature-item">
                  <div className="feature-check">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h4>Time Efficient</h4>
                    <p>Engagements are concise and aligned to your expertise</p>
                  </div>
                </div>
                <div className="about-feature-item">
                  <div className="feature-check">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h4>Meaningful Impact</h4>
                    <p>Your input contributes directly to strategic decisions</p>
                  </div>
                </div>
                <div className="about-feature-item">
                  <div className="feature-check">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h4>Privacy by Design</h4>
                    <p>Your information is protected and not sold to third parties</p>
                  </div>
                </div>
                <div className="about-feature-item">
                  <div className="feature-check">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h4>Relevant Network</h4>
                    <p>Connect with qualified peers across industries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        id="how-it-works" 
        ref={(el) => { sectionRefs.current['how-it-works'] = el; }}
        className={`how-it-works-section ${isVisible['how-it-works'] ? 'fade-in' : ''}`}
      >
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">A clear 3-step process to join, get matched, and collaborate with relevant stakeholders.</p>
        </div>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">
              <span>1</span>
            </div>
            <h3>Create Your Profile</h3>
            <p>Provide your professional background, expertise, and industry experience to support accurate matching.</p>
          </div>
          <div className="step-item">
            <div className="step-number">
              <span>2</span>
            </div>
            <h3>Get Matched</h3>
            <p>Receive relevant invitations and networking opportunities aligned to your profile.</p>
          </div>
          <div className="step-item">
            <div className="step-number">
              <span>3</span>
            </div>
            <h3>Grow and Contribute</h3>
            <p>Connect with peers, join focused events, and expand your professional network.</p>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section 
        id="value-prop" 
        ref={(el) => { sectionRefs.current['value-prop'] = el; }}
        className={`value-prop-section ${isVisible['value-prop'] ? 'fade-in' : ''}`}
      >
        <div className="value-prop-container">
          <div className="value-prop-card value-prop-primary">
            <div className="value-prop-badge">For Businesses and Institutions</div>
            <h2 className="value-prop-title">How We Support Your Team</h2>
            <p className="value-prop-description">
              Get qualified insights for research, product strategy, and survey design to support informed decisions.
            </p>
            <div className="value-prop-features">
              <div className="value-feature-item">
                <div className="feature-icon-circle">1</div>
                <div className="feature-content">
                  <h4>End-to-End Survey Delivery</h4>
                  <p>We design, distribute, and analyze on your behalf</p>
                </div>
              </div>
              <div className="value-feature-item">
                <div className="feature-icon-circle">2</div>
                <div className="feature-content">
                  <h4>Access to Verified Executives</h4>
                  <p>Reach decision-makers in your target industries efficiently</p>
                </div>
              </div>
              <div className="value-feature-item">
                <div className="feature-icon-circle">3</div>
                <div className="feature-content">
                  <h4>Timely Turnaround</h4>
                  <p>Receive decision-ready insights within days</p>
                </div>
              </div>
              <div className="value-feature-item">
                <div className="feature-icon-circle">4</div>
                <div className="feature-content">
                  <h4>Comprehensive Reporting</h4>
                  <p>Receive detailed analysis with clear visuals and recommendations</p>
                </div>
              </div>
            </div>
            <button className="value-prop-btn">Request Survey Support</button>
          </div>
          <div className="value-prop-card value-prop-secondary">
            <h3 className="value-secondary-title">Our Survey Services Include</h3>
            <div className="value-secondary-list">
              <div className="value-secondary-item">
                <div className="value-prop-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </div>
                <h4>Survey Design</h4>
                <p className="value-secondary-text">Custom questionnaires tailored to your research objectives</p>
              </div>
              <div className="value-secondary-item">
                <div className="value-prop-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h4>Participant Recruitment</h4>
                <p className="value-secondary-text">Target specific industries, roles, and demographics</p>
              </div>
              <div className="value-secondary-item">
                <div className="value-prop-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3v18h18"></path>
                    <path d="M18 17V9"></path>
                    <path d="M13 17V5"></path>
                    <path d="M8 17v-3"></path>
                  </svg>
                </div>
                <h4>Data Analysis</h4>
                <p className="value-secondary-text">In-depth analysis with charts, trends, and insights</p>
              </div>
              <div className="value-secondary-item">
                <div className="value-prop-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <h4>Executive Reports</h4>
                <p className="value-secondary-text">Presentation-ready deliverables for stakeholders</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Advance Your Business?</h2>
          <p className="cta-subtitle">
            Join B2B leaders using trusted connections and expert insight to improve business outcomes.
          </p>
          <button className="btn-primary-large">Apply for Membership</button>
          <p className="cta-note">Limited capacity available • Selective onboarding • Professional network</p>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column footer-about">
            <h3 className="footer-logo">Global Research Trends</h3>
            <p>A global professional network for B2B leaders to connect, learn, and grow with verified expertise.</p>
            <div className="social-icons">
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          <div className="footer-column">
            <h4>Explore</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Case Studies</a></li>
              <li><a href="#">Whitepapers</a></li>
              <li><a href="#">Webinars</a></li>
              <li><a href="#">Support Center</a></li>
              <li><a href="#">API Docs</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="#">Cookie Policy</a></li>
              <li><a href="#">Acceptable Use</a></li>
            </ul>
          </div>
          <div className="footer-column footer-subscribe">
            <h4>Subscribe to Updates</h4>
            <p>Receive industry insights, event invitations, and platform updates.</p>
            <div className="subscribe-form">
              <input type="email" placeholder="Your email address" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Global Research Trends. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;


