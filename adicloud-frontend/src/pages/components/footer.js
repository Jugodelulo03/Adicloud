import './footer.css';

function Footer() {

  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text"> {new Date().getFullYear()} Adicloud. For Technical Test </p>
        <p className="footer-text">  Created by Julian Pinzon and Luna Zambrano</p>
        <div className="footer-links">
        </div>
      </div>
    </footer>
  );
}

export default Footer;
