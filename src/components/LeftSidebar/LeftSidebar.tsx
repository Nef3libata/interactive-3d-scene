import { useStore } from "@core/store/useStore";
import navigationIcon from "@components/icons/navigation-icon.svg";
import "./LeftSidebar.scss";

const VIEW_PRESETS = ["Top View", "Front View", "Side View", "Reset"] as const;

const MOUSE_CONTROLS = [
  { label: "Rotate", action: "Left Drag" },
  { label: "Pan", action: "Right Drag" },
  { label: "Zoom", action: "Scroll" },
] as const;

export const LeftSidebar = () => {
  const cameraPosition = useStore((state) => state.cameraPosition);

  const handleViewPreset = (view: string) => {
    console.log("View preset:", view);
  };

  return (
    <div className="left-panels">
      <div className="left-panels__panel">
        <h4 className="left-panels__title">CAMERA</h4>
        <div className="left-panels__camera">
          {(["x", "y", "z"] as const).map((axis) => (
            <div className="left-panels__camera-row" key={axis}>
              <span
                className={`left-panels__camera-label left-panels__camera-label--${axis}`}
              >
                {axis.toUpperCase()}
              </span>
              <span className="left-panels__camera-value">
                {cameraPosition[axis].toFixed(1)}
              </span>
            </div>
          ))}
        </div>

        <h4 className="left-panels__title">VIEWS</h4>
        <div className="left-panels__views">
          {VIEW_PRESETS.map((view) => (
            <button
              className="left-panels__view-btn"
              key={view}
              onClick={() => handleViewPreset(view)}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      <div className="left-panels__panel">
        <h4 className="left-panels__title">MOUSE CONTROLS</h4>
        <div className="left-panels__controls">
          {MOUSE_CONTROLS.map(({ label, action }) => (
            <div className="left-panels__control-row" key={label}>
              <img src={navigationIcon} alt="navigation" />
              <span className="left-panels__control-label">{label}</span>
              <span className="left-panels__control-badge">{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
