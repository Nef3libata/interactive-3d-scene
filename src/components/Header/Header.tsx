import { useStore } from "@/core/store/useStore";
import logoIcon from "@components/icons/logo-icon.svg";
import resetIcon from "@components/icons/reset-icon.svg";
import trashIcon from "@components/icons/trash-icon.svg";
import "./Header.scss";

export const Header = () => {
  const spheres = useStore((state) => state.spheres);
  const clearAllSpheres = useStore((state) => state.clearAllSpheres);

  return (
    <header className="header">
      <div className="header__left">
        <div className="header__logo">
          <div className="header__logo-icon">
            <img src={logoIcon} />
          </div>
          <span className="header__title">3D Scene Viewer</span>
        </div>
      </div>

      <div className="header__right">
        <button className="header__action" onClick={() => {}}>
          <img src={resetIcon} />
          Reset View
        </button>

        <button
          className="header__action header__action--danger"
          onClick={clearAllSpheres}
          disabled={spheres.length === 0}
        >
          <img src={trashIcon} alt="delete spheres" width="16" height="16" />
          Clear All
        </button>
      </div>
    </header>
  );
};
