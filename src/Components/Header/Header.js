import pokeLogo from "../../Assets/logo.png";
import "./Header.css";

export function Header() {
  return (
    <>
      <header className="header">
        <img src={pokeLogo} alt="pokemon dex logo"/>
      </header>
    </>
  );
}
