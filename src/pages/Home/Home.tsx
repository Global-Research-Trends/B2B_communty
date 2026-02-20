﻿import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header.tsx';
import Footer from '../../components/Footer/Footer.tsx';
import './Home.css';

const Home: React.FC = () => {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  
  // ===== STATE FOR HOW IT WORKS SECTION ANIMATIONS =====
  const [howItWorksVisible, setHowItWorksVisible] = useState(false);
  const [cardAnimationStage, setCardAnimationStage] = useState(0); // 0,1,2,3 for cards animated
  
  // ===== STATE FOR BENEFITS SECTION ANIMATIONS =====
  const [benefitsHeadingVisible, setBenefitsHeadingVisible] = useState(false);
  const [benefitsCardsAnimated, setBenefitsCardsAnimated] = useState(0); // 0 or 1
  const [benefitsCardsDisappear, setBenefitsCardsDisappear] = useState(0); // 0 or 1 for disappear animation
  
  // ===== STATE FOR VALUE PROP SECTION ANIMATIONS =====
  const [valuePropAnimated, setValuePropAnimated] = useState(0);
  
  // ===== STATE FOR ABOUT SECTION ANIMATIONS =====
  const [aboutAnimated, setAboutAnimated] = useState(0); // 0 or 1 for animations
  
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Network animation setup - only for hero section
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get the hero section dimensions
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    const updateCanvasSize = () => {
      const rect = heroSection.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    updateCanvasSize();

    let width = canvas.width;
    let height = canvas.height;
    let dots: any[] = [];

    const mouse = { x: null as number | null, y: null as number | null, radius: 150 };
    
    const handleMouseMove = (e: MouseEvent) => {
      // Get mouse position relative to hero section
      const rect = heroSection.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right && 
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      } else {
        mouse.x = null;
        mouse.y = null;
      }
    };
    
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const colors = { crimson: '#d80032', slate: '#6e8387', dark: '#0a0a0a' };

    // Initialize dots
    const init = () => {
      updateCanvasSize();
      width = canvas.width;
      height = canvas.height;
      dots = [];
      const numDots = Math.floor((width * height) / 7000);
      for (let i = 0; i < numDots; i++) {
        createDot();
      }
    };

    // Create a bubble dot with fade-in & burst
    const createDot = () => {
      const dot = {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 3 + 1.5,
        color: Math.random() > 0.7 ? colors.crimson : colors.slate,
        glow: Math.random() * 15 + 8,
        alpha: 0,
        alphaSpeed: 0.03,
        burst: 1.5
      };
      dots.push(dot);
    };

    // Draw connections
    const drawConnections = (maxDistance = 150) => {
      ctx.lineWidth = 0.8;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            let opacity = 0.25 * (1 - distance / maxDistance);
            if (mouse.x && mouse.y) {
              const d1 = Math.sqrt((dots[i].x - mouse.x) ** 2 + (dots[i].y - mouse.y) ** 2);
              const d2 = Math.sqrt((dots[j].x - mouse.x) ** 2 + (dots[j].y - mouse.y) ** 2);
              if (d1 < mouse.radius || d2 < mouse.radius) opacity += 0.3;
            }
            ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
            ctx.stroke();
          }
        }
      }
    };

    // Animate dots (Bubble)
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      dots.forEach(dot => {
        // Fade-in & shrink burst
        if (dot.alpha < 1) dot.alpha += dot.alphaSpeed;
        if (dot.alpha > 1) dot.alpha = 1;
        if (dot.burst > 1) dot.burst -= 0.02;

        // Bubble upward movement
        dot.y -= dot.vy * 0.5;
        if (dot.y < 0) dot.y = height;
        if (dot.y > height) dot.y = 0;

        // Horizontal movement with bounce
        dot.x += dot.vx * 0.5;
        if (dot.x < 0) {
          dot.x = 0;
          dot.vx *= -1;
        }
        if (dot.x > width) {
          dot.x = width;
          dot.vx *= -1;
        }

        // Mouse attraction
        const attraction = 0.008;
        if (mouse.x && mouse.y) {
          const dx = mouse.x - dot.x;
          const dy = mouse.y - dot.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            dot.x += dx * attraction;
            dot.y += dy * attraction;
          }
        }

        // Glow effect near mouse
        let glow = dot.glow;
        if (mouse.x && mouse.y) {
          const dx = dot.x - mouse.x;
          const dy = dot.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) glow += 10;
        }

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size * dot.burst, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.globalAlpha = dot.alpha;
        ctx.shadowColor = dot.color;
        ctx.shadowBlur = glow;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      ctx.shadowBlur = 0;
      drawConnections();
      requestAnimationFrame(animate);
    };

    // Dynamic new dots spawn
    const dynamicSpawn = () => {
      const batch = Math.floor(Math.random() * 6 + 5); // 5 to 10 dots
      for (let i = 0; i < batch; i++) {
        createDot();
      }
      const nextTime = Math.floor(Math.random() * 10000 + 20000); // 20000–30000 ms
      setTimeout(dynamicSpawn, nextTime);
    };

    // Handle resize
    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);
    init();
    animate();
    dynamicSpawn();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ===== UPDATED INTERSECTION OBSERVER WITH ALL SECTION ANIMATIONS =====
  useEffect(() => {
    // Use a slightly larger rootMargin so the animations begin just before
    // the section fully enters the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }

          // Special handling for how-it-works section animations
          if (entry.target && (entry.target as HTMLElement).id === 'how-it-works') {
            const visiblePercentage = entry.intersectionRatio;
            
            // Show heading when ~18-20% of section is visible
            if (visiblePercentage >= 0.18) {
              setHowItWorksVisible(true);
            }

            // Animate cards progressively as visibility increases
            if (visiblePercentage >= 0.25) {
              setCardAnimationStage(1);
            }
            if (visiblePercentage >= 0.35) {
              setCardAnimationStage(2);
            }
            if (visiblePercentage >= 0.45) {
              setCardAnimationStage(3);
            }
          }

          // Special handling for benefits section: heading and card animations
          if (entry.target && (entry.target as HTMLElement).id === 'benefits') {
            const visiblePct = entry.intersectionRatio;
            // show heading when ~20% visible
            if (visiblePct >= 0.20) setBenefitsHeadingVisible(true);
            // start cards animation at ~25%
            if (visiblePct >= 0.25) setBenefitsCardsAnimated(1);
            // trigger disappear animation when ~20% or less visible
            if (visiblePct <= 0.10) setBenefitsCardsDisappear(1);
            else setBenefitsCardsDisappear(0);
          }

          // Value-prop section animations at ~30%
          if (entry.target && (entry.target as HTMLElement).id === 'value-prop') {
            const v = entry.intersectionRatio;
            if (v >= 0.20) setValuePropAnimated(1);
            else if (v < 0.10) setValuePropAnimated(0);
          }

          // About section animations: trigger at 30% visible, reverse at 30% or less
          if (entry.target && (entry.target as HTMLElement).id === 'about') {
            const aboutVisibility = entry.intersectionRatio;
            if (aboutVisibility >= 0.30) {
              setAboutAnimated(1);
            } else if (aboutVisibility < 0.30) {
              setAboutAnimated(0);
            }
          }
        });
      },
      { threshold: [0, 0.18, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.75, 1], rootMargin: '0px 0px -15% 0px' }
    );

    // Ensure we observe any section refs that have been assigned
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-container">
      <Header />

      {/* Hero Section with Network Animation */}
      <section className="hero-section">
        {/* Network Animation Canvas - Only in Hero Section */}
        <canvas
          ref={canvasRef}
          id="heroNetworkCanvas"
          className="hero-network-canvas"
        />
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

      {/* Benefits Section - With Animations */}
      <section 
        id="benefits" 
        ref={(el) => { sectionRefs.current['benefits'] = el; }}
        className={`benefits-section ${isVisible['benefits'] ? 'fade-in' : ''} ${benefitsHeadingVisible ? 'heading-visible' : ''}`}
        data-benefits-cards-animated={benefitsCardsAnimated}
        data-benefits-cards-disappear={benefitsCardsDisappear}
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
        className={`about-section ${isVisible['about'] ? 'fade-in' : ''} ${aboutAnimated ? 'about-animated' : ''}`}
        data-about-animated={aboutAnimated}
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

      {/* How It Works Section - With Animations */}
      <section 
        id="how-it-works" 
        ref={(el) => { sectionRefs.current['how-it-works'] = el; }}
        className={`how-it-works-section ${isVisible['how-it-works'] ? 'fade-in' : ''} ${howItWorksVisible ? 'heading-visible' : ''}`}
        data-cards-animated={cardAnimationStage}
      >
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">A clear 3-step process to join, get matched, and collaborate with relevant stakeholders.</p>
        </div>
        <div className="steps-container">
          {/* Card 1 - Will animate first */}
          <div className="step-item" data-card="1">
            <div className="step-number">
              <span>1</span>
            </div>
            <h3>Create Your Profile</h3>
            <p>Provide your professional background, expertise, and industry experience to support accurate matching.</p>
          </div>
          {/* Card 2 - Will animate second */}
          <div className="step-item" data-card="2">
            <div className="step-number">
              <span>2</span>
            </div>
            <h3>Get Matched</h3>
            <p>Receive relevant invitations and networking opportunities aligned to your profile.</p>
          </div>
          {/* Card 3 - Will animate third */}
          <div className="step-item" data-card="3">
            <div className="step-number">
              <span>3</span>
            </div>
            <h3>Grow and Contribute</h3>
            <p>Connect with peers, join focused events, and expand your professional network.</p>
          </div>
        </div>
      </section>

      {/* Value Proposition Section - With Animations */}
      <section 
        id="value-prop" 
        ref={(el) => { sectionRefs.current['value-prop'] = el; }}
        className={`value-prop-section ${isVisible['value-prop'] ? 'fade-in' : ''}`}
        data-valueprop-animated={valuePropAnimated}
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

      <Footer />
    </div>
  );
};

export default Home;