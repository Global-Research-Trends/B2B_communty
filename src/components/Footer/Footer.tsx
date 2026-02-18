import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column footer-about">
          <h3 className="footer-logo">B2B Insights</h3>
          <p>A global professional network for B2B leaders to connect, learn, and grow with verified expertise.</p>
          <div className="social-icons">
            <a href="#" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in" />
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter" />
            </a>
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook-f" />
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fab fa-instagram" />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Explore</h4>
          <ul>
            <li>
              <a href="/about">About Us</a>
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
              <a href="#">Blog</a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Resources</h4>
          <ul>
            <li>
              <a href="#">Case Studies</a>
            </li>
            <li>
              <a href="#">Whitepapers</a>
            </li>
            <li>
              <a href="#">Webinars</a>
            </li>
            <li>
              <a href="#">Support Center</a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Legal</h4>
          <ul>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="/privacy-policy">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Cookie Policy</a>
            </li>
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
        <p>&copy; {new Date().getFullYear()} B2B Insights. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
