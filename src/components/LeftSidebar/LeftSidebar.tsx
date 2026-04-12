import { useStore } from "@core/store/useStore";
import { type ViewPreset } from "@core/models/types";
import resetIcon from "@components/icons/reset-icon.svg";
import "./LeftSidebar.scss";

const VIEW_PRESETS: { label: string; preset: ViewPreset }[] = [
  { label: "Top", preset: "top" },
  { label: "Front", preset: "front" },
  { label: "Side", preset: "side" },
];

export const LeftSidebar = () => {
  const applyViewPreset = useStore((state) => state.applyViewPreset);

  return (
    <div className="view-bar">
      {VIEW_PRESETS.map(({ label, preset }) => (
        <button
          className="view-bar__btn"
          key={preset}
          onClick={() => applyViewPreset(preset)}
        >
          {label}
        </button>
      ))}
      <div className="view-bar__btn--separator"></div>
      <button
        className="view-bar__btn view-bar__btn--icon"
        onClick={() => applyViewPreset("reset")}
        aria-label="Reset view"
        title="Reset view"
      >
        <img src={resetIcon} alt="reset view" />
      </button>
    </div>
  );
};
