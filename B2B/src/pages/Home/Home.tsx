import React, { useEffect, useRef, useState } from 'react';
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
          <div className="nav-logo">B2B Community</div>
          <ul className="nav-menu">
            <li><a href="#about">About</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="nav-actions">
            <button className="nav-btn nav-login">Sign In</button>
            <button className="nav-btn nav-signup">Join Now</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            The Premier Community for
            <span className="highlight"> B2B Leaders</span>
          </h1>
          <p className="hero-subtitle">
            Connect with verified industry leaders, access exclusive insights, and accelerate your business growth in the world's most trusted B2B community.
          </p>
          <div className="hero-cta">
            <button className="btn-primary">Join the Community</button>
            <button className="btn-secondary">Request Invitation</button>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span>Scroll to Explore</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Trusted By Section - Client Logos */}
      <section 
        id="trusted-by" 
        ref={(el) => { sectionRefs.current['trusted-by'] = el; }}
        className={`trusted-section ${isVisible['trusted-by'] ? 'fade-in' : ''}`}
      >
        <p className="trusted-label">Trusted by Leaders From</p>
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
            <div className="stat-label">Events Hosted</div>
            <div className="stat-description">Workshops & networking sessions</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction Rate</div>
            <div className="stat-description">Member testimonials</div>
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
          <h2 className="section-title">Why Join Our Community</h2>
          <p className="section-subtitle">
            Unlock exclusive benefits designed to accelerate your business growth and expand your professional network
          </p>
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
            <h3>Exclusive Networking</h3>
            <p>Connect with verified C-level executives and decision-makers from Fortune 500 companies and fast-growing startups.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <h3>Knowledge Library</h3>
            <p>Access curated resources, industry reports, case studies, and actionable insights from leading business experts.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <h3>Expert-Led Workshops</h3>
            <p>Participate in masterclasses, webinars, and interactive sessions led by industry thought leaders and successful entrepreneurs.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h3>Growth Opportunities</h3>
            <p>Discover partnership opportunities, strategic alliances, and collaborative ventures to scale your business faster.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        id="testimonials" 
        ref={(el) => { sectionRefs.current['testimonials'] = el; }}
        className={`testimonials-section ${isVisible['testimonials'] ? 'fade-in' : ''}`}
      >
        <h2 className="section-title">What Our Members Say</h2>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="testimonial-text">
              "Joining this community was a game-changer for our business. The quality of connections and the depth of insights shared here are unparalleled. We've closed three major deals through relationships built in this network."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">SC</div>
              <div className="author-info">
                <h4>Sarah Chen</h4>
                <p>CEO, TechVentures Inc.</p>
                <p className="company-tag">SaaS • $50M ARR</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card featured">
            <div className="stars">★★★★★</div>
            <p className="testimonial-text">
              "The expert-led workshops alone are worth the membership. I've implemented strategies that increased our operational efficiency by 40%. This community genuinely cares about member success."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">MR</div>
              <div className="author-info">
                <h4>Michael Rodriguez</h4>
                <p>COO, Global Logistics Solutions</p>
                <p className="company-tag">Supply Chain • 2000+ Employees</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="testimonial-text">
              "As a newcomer to the B2B space, this community provided the mentorship and connections I desperately needed. The verification process ensures you're networking with serious professionals."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">ET</div>
              <div className="author-info">
                <h4>Emma Thompson</h4>
                <p>Founder, Digital Commerce Partners</p>
                <p className="company-tag">E-commerce • Series A</p>
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
        <h2 className="section-title">Your Journey Starts Here</h2>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <h3>Apply for Membership</h3>
            <p>Submit your application with your business details and professional background.</p>
          </div>
          <div className="step-connector"></div>
          <div className="step-item">
            <div className="step-number">2</div>
            <h3>Verification Process</h3>
            <p>Our team reviews your application to ensure community quality and alignment.</p>
          </div>
          <div className="step-connector"></div>
          <div className="step-item">
            <div className="step-number">3</div>
            <h3>Get Approved</h3>
            <p>Receive your welcome package and access to our exclusive member portal.</p>
          </div>
          <div className="step-connector"></div>
          <div className="step-item">
            <div className="step-number">4</div>
            <h3>Start Growing</h3>
            <p>Connect with peers, attend events, and unlock your business potential.</p>
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
            <div className="value-prop-badge">For Businesses & Institutions</div>
            <h2 className="value-prop-title">We Can Help For You</h2>
            <p className="value-prop-description">
              Need expert insights to conduct research, guide product development, or survey design to gain critical business intelligence.
            </p>
            <div className="value-prop-features">
              <div className="value-feature-item">
                <div className="feature-icon-circle">✓</div>
                <div className="feature-content">
                  <h4>End-to-End Survey Solutions</h4>
                  <p>We design, distribute, and analyze for you</p>
                </div>
              </div>
              <div className="value-feature-item">
                <div className="feature-icon-circle">✓</div>
                <div className="feature-content">
                  <h4>Access to Verified Executives</h4>
                  <p>Reach decision-makers in your target industry instantly</p>
                </div>
              </div>
              <div className="value-feature-item">
                <div className="feature-icon-circle">✓</div>
                <div className="feature-content">
                  <h4>Fast Turnaround</h4>
                  <p>Get actionable insights within days, not weeks</p>
                </div>
              </div>
              <div className="value-feature-item">
                <div className="feature-icon-circle">✓</div>
                <div className="feature-content">
                  <h4>Comprehensive Reports</h4>
                  <p>Receive detailed analysis with visualizations and recommendations</p>
                </div>
              </div>
            </div>
            <button className="value-prop-btn">Request Survey Services</button>
          </div>
          <div className="value-prop-card value-prop-secondary">
            <div className="value-prop-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18"></path>
                <path d="M18 17V9"></path>
                <path d="M13 17V5"></path>
                <path d="M8 17v-3"></path>
              </svg>
            </div>
            <h3 className="value-secondary-title">Data Analysis</h3>
            <p className="value-secondary-text">
              In-depth analysis with charts, trends, and insights
            </p>
          </div>
          <div className="value-prop-card value-prop-secondary">
            <div className="value-prop-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <h3 className="value-secondary-title">Executive Reports</h3>
            <p className="value-secondary-text">
              Presentation-ready deliverables for stakeholders
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Elevate Your Business?</h2>
          <p className="cta-subtitle">
            Join thousands of B2B leaders who are already transforming their businesses through meaningful connections and expert insights.
          </p>
          <button className="btn-primary-large">Apply for Membership</button>
          <p className="cta-note">Limited spots available • Selective admission • Premium community</p>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column footer-about">
            <h3 className="footer-logo">B2B Community</h3>
            <p>The premier global community for B2B leaders to connect, learn, and grow. Built on trust and verified expertise.</p>
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
              <li><a href="#about">About Us</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
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
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Cookie Policy</a></li>
              <li><a href="#">Acceptable Use</a></li>
            </ul>
          </div>
          <div className="footer-column footer-subscribe">
            <h4>Subscribe to our Newsletter</h4>
            <p>Get exclusive insights, event invitations, and community updates.</p>
            <div className="subscribe-form">
              <input type="email" placeholder="Your email address" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} B2B Community. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
