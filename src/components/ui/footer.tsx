import "./footer.css";
import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="footer">
      <div className="ndwlogofooter">
        <Link to="/">
          <img src="/ndw.svg" alt="NDW Logo" />
        </Link>
      </div>
      <div className="theme-toggle">
        <ThemeToggle />
      </div>
    </div>
  );
}
