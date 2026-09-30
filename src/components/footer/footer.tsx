import FooterBrand from "./footerBrand";
import FooterExplore from "./footerExplore";
import FooterTeam from "./footerTeam";

export default function Footer() {
  return (
    <footer className="footer-shell">
      <div className="footer-top">
        <FooterBrand />
        <FooterExplore />
        <FooterTeam />
      </div>
    </footer>
  );
}
