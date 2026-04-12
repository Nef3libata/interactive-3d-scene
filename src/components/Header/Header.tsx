import logoIcon from "@components/icons/logo-icon.svg";
import "./Header.scss";

export const Header = () => {
  return (
    <header className="header">
      <div className="header__left">
        <div className="header__logo">
          <div className="header__logo-icon">
            <img src={logoIcon} />
          </div>
          <span className="header__title">3D Viewer</span>
        </div>
      </div>
    </header>
  );
};
