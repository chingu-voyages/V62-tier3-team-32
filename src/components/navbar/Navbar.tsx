import Logo from "./Logo";
import NavbarActions from "./NavbarActions";

export default function Navbar() {
  return (
    <nav className="navbar-shell">
      <Logo />
      <NavbarActions />
    </nav>
  );
}
