import { useState } from "react";
import logoIcon from "@components/icons/logo-icon.svg";
import { HelpIcon } from "@components/icons/HelpIcon";
import { HelpDialog } from "../HelpDialog/HelpDialog";
import "./Header.scss";

export const Header = () => {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header__left">
          <div className="header__logo">
            <div className="header__logo-icon">
              <img src={logoIcon} alt="logo" />
            </div>
            <span className="header__title">3D Viewer</span>
          </div>
        </div>

        <div className="header__right">
          <button
            className="header__help-btn"
            onClick={() => setHelpOpen(true)}
            aria-label="Help"
          >
            <HelpIcon />
          </button>
        </div>
      </header>

      {helpOpen && <HelpDialog onClose={() => setHelpOpen(false)} />}
    </>
  );
};
