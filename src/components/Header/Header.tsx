import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isNavHidden, setIsNavHidden] = useState(false);
  const lastScrollY = useRef(0);
  const isNavHiddenRef = useRef(isNavHidden);
  const downAccum = useRef(0);
  const upAccum = useRef(0);

  useEffect(() => {
    isNavHiddenRef.current = isNavHidden;
  }, [isNavHidden]);

  useEffect(() => {
    let ticking = false;
    const THRESHOLD = 14;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const previousY = lastScrollY.current;
          const delta = currentY - previousY;

          if (currentY < 100) {
            if (isNavHiddenRef.current) setIsNavHidden(false);
            downAccum.current = 0;
            upAccum.current = 0;
          } else if (delta > 0) {
            downAccum.current += delta;
            upAccum.current = 0;
            if (!isNavHiddenRef.current && downAccum.current > THRESHOLD) {
              setIsNavHidden(true);
              downAccum.current = 0;
            }
          } else if (delta < 0) {
            upAccum.current += -delta;
            downAccum.current = 0;
            if (isNavHiddenRef.current && upAccum.current > THRESHOLD) {
              setIsNavHidden(false);
              upAccum.current = 0;
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
    <nav className={`navbar ${isNavHidden ? 'nav-hidden' : ''}`}>
      <div className="nav-content">
        <Link to="/" className="nav-logo" aria-label="Go to Home">
          <span className="nav-logo__icon" aria-hidden="true">
            <svg viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <polygon points="9,1.5 17,8.5 1,8.5" />
              <rect x="2.5" y="8" width="13" height="8.5" rx="1.2" />
              <rect x="6.5" y="11" width="5" height="5.5" rx="0.8" fill="white" opacity="0.25" />
            </svg>
          </span>
          <span className="nav-logo__text">B2B Insights</span>
        </Link>

        <ul className="nav-menu">
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#how-it-works">How It Works</a>
          </li>
          <li>
            <a href="#pricing">Pricing</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>

        <div className="nav-actions">
          <Link to="/auth" className="nav-btn nav-login">
            Sign In
          </Link>
          <Link to="/auth" className="nav-btn nav-signup">
            Request Access
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
