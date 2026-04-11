import { useState } from "react";
import { useStore } from "@core/store/useStore";
import controlIcon from "@components/icons/control-icon.svg";
import chevronIcon from "@components/icons/chevron-right-icon.svg";
import eyeIcon from "@components/icons/eye-icon.svg";
import trashIcon from "@components/icons/trash-gray-icon.svg";
import "./RightSidebar.scss";

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

const getBallStyle = (hex: string): React.CSSProperties => {
  const rgb = hexToRgb(hex);
  return {
    background: `radial-gradient(circle at 35% 35%, rgba(${rgb}, 0.8), rgba(${rgb}, 0.27))`,
    border: `1.5px solid rgba(${rgb}, 0.4)`,
    boxShadow: `rgba(${rgb}, 0.27) 0px 0px 8px`,
  };
};

const PRESET_COLORS = [
  "#5b8def",
  "#22c55e",
  "#ef4444",
  "#f59e0b",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#f5f5f5",
  "#737373",
];

export const RightSidebar = () => {
  const spheres = useStore((state) => state.spheres);
  const addSphere = useStore((state) => state.addSphere);
  const removeSphere = useStore((state) => state.removeSphere);
  const clearAllSpheres = useStore((state) => state.clearAllSpheres);

  const [collapsed, setCollapsed] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#5b8def");
  const [ballSize, setBallSize] = useState(5);

  const handleAddBall = () => {
    const newSphere = {
      id: Date.now().toString(),
      position: [0, ballSize / 2, 0] as [number, number, number],
      color: selectedColor,
      radius: ballSize / 10,
      visible: true,
    };
    addSphere(newSphere);
  };

  return (
    <aside
      className={`right-sidebar ${collapsed ? "right-sidebar--collapsed" : ""}`}
    >
      <div className="right-sidebar__header">
        <img src={controlIcon} alt="" width="20" height="20" />
        <h4 className="right-sidebar__title">Scene Controls</h4>
        <button
          className="right-sidebar__collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand panel" : "Collapse panel"}
        >
          <img src={chevronIcon} alt="" width="16" height="16" />
        </button>
      </div>

      <div className="right-sidebar__body">
        <div className="right-sidebar__card">
          <section className="right-sidebar__section">
            <div className="right-sidebar__section-header">
              <h5 className="right-sidebar__label">BALL COLOR</h5>
              <div className="right-sidebar__color-display">
                <div
                  className="right-sidebar__color-dot"
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="right-sidebar__color-hex">
                  {selectedColor}
                </span>
              </div>
            </div>

            <div className="right-sidebar__color-grid">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  className={`right-sidebar__swatch ${
                    selectedColor === color
                      ? "right-sidebar__swatch--active"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>

            <button className="right-sidebar__custom-color">
              Custom color
            </button>
          </section>

          <section className="right-sidebar__section">
            <div className="right-sidebar__section-header">
              <h5 className="right-sidebar__label">BALL SIZE</h5>
              <span className="right-sidebar__size-value">{ballSize}</span>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              value={ballSize}
              onChange={(e) => setBallSize(Number(e.target.value))}
              className="right-sidebar__slider"
              style={{
                background: `linear-gradient(to right, #4b8cff ${
                  ((ballSize - 1) / 9) * 100
                }%, #262626 0%)`,
              }}
            />

            <div className="right-sidebar__slider-labels">
              <span>Small</span>
              <span>Large</span>
            </div>
          </section>
        </div>

        <button className="right-sidebar__add-btn" onClick={handleAddBall}>
          + Add Ball to Scene
        </button>
      </div>

      <div className="right-sidebar__scene-objects">
        <div className="right-sidebar__scene-objects-header">
          <h5 className="right-sidebar__label">SCENE OBJECTS</h5>
          {spheres.length > 0 && (
            <button
              className="right-sidebar__clear-btn"
              onClick={clearAllSpheres}
            >
              Clear all
            </button>
          )}
        </div>

        <div className="right-sidebar__objects">
          {spheres.length === 0 ? (
            <p className="right-sidebar__empty">No objects in scene</p>
          ) : (
            spheres.map((sphere, index) => (
              <div key={sphere.id} className="right-sidebar__object">
                <span className="right-sidebar__object-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div
                  className="right-sidebar__object-color"
                  style={getBallStyle(sphere.color)}
                />
                <div className="right-sidebar__object-info">
                  <span className="right-sidebar__object-name">
                    Ball #{index + 1}
                  </span>
                  <span className="right-sidebar__object-size">
                    Size {sphere.radius * 10} M
                  </span>
                </div>
                <button
                  className="right-sidebar__object-btn"
                  aria-label="Toggle visibility"
                >
                  <img src={eyeIcon} alt="" width="16" height="16" />
                </button>
                <button
                  className="right-sidebar__object-btn right-sidebar__object-btn--delete"
                  onClick={() => removeSphere(sphere.id)}
                  aria-label="Delete ball"
                >
                  <img src={trashIcon} alt="" width="16" height="16" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};
