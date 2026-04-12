import { useState, useRef } from "react";
import { Vector3 } from "three";
import { useStore } from "@core/store/useStore";
import eyeIcon from "@components/icons/eye-icon.svg";
import trashIcon from "@components/icons/trash-gray-icon.svg";
import objectsIcon from "@components/icons/objects-icon.svg";
import "./RightSidebar.scss";

const PRESET_COLORS = [
  "#3b82f6",
  "#2563eb",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#22c55e",
  "#14b8a6",
  "#a1a1aa",
  "#6b7280",
];

export const RightSidebar = () => {
  const spheres = useStore((state) => state.spheres);
  const addSphere = useStore((state) => state.addSphere);
  const removeSphere = useStore((state) => state.removeSphere);
  const toggleSphereVisibility = useStore(
    (state) => state.toggleSphereVisibility
  );
  const clearAllSpheres = useStore((state) => state.clearAllSpheres);
  const setCameraTarget = useStore((state) => state.setCameraTarget);

  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [ballSize, setBallSize] = useState(4);
  const [selectedBallId, setSelectedBallId] = useState<string | null>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleAddBall = () => {
    const radius = ballSize / 10;
    const offset = spheres.length * 1.5;
    const angle = spheres.length * 1.2;
    const newSphere = {
      id: Date.now().toString(),
      position: [
        Math.cos(angle) * (2 + offset * 0.3),
        radius,
        Math.sin(angle) * (2 + offset * 0.3),
      ] as [number, number, number],
      color: selectedColor,
      radius,
      visible: true,
    };
    addSphere(newSphere);
  };

  const handleFocusBall = (position: [number, number, number]) => {
    setCameraTarget(
      new Vector3(position[0] + 3, position[1] + 2, position[2] + 3)
    );
  };

  return (
    <aside className="right-sidebar">
      <div className="right-sidebar__header">
        <h4 className="right-sidebar__title">Properties</h4>
        <span className="right-sidebar__count">
          {spheres.length} {spheres.length === 1 ? "object" : "objects"}
        </span>
      </div>

      <div className="right-sidebar__body">
        <section className="right-sidebar__section">
          <h5 className="right-sidebar__label">Color</h5>

          <div className="right-sidebar__color-grid">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                className={`right-sidebar__swatch ${
                  selectedColor === color ? "right-sidebar__swatch--active" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>

          <div
            className="right-sidebar__color-display"
            onClick={() => colorInputRef.current?.click()}
          >
            <div
              className="right-sidebar__color-preview"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="right-sidebar__color-hex">
              {selectedColor.toUpperCase()}
            </span>
            <input
              ref={colorInputRef}
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="right-sidebar__color-input"
            />
          </div>
        </section>

        <section className="right-sidebar__section">
          <h5 className="right-sidebar__label">Size</h5>

          <div className="right-sidebar__size-row">
            <div
              className="right-sidebar__size-preview"
              style={{
                width: 8 + ballSize * 2,
                height: 8 + ballSize * 2,
                background:
                  "radial-gradient(circle at 38% 35%, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.05))",
                border: "1px solid #ffffff40",
              }}
            />
            <input
              type="range"
              min="1"
              max="10"
              value={ballSize}
              onChange={(e) => setBallSize(Number(e.target.value))}
              className="right-sidebar__slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 ${
                  ((ballSize - 1) / 9) * 100
                }%, #262626 0%)`,
              }}
            />
            <span className="right-sidebar__size-value">{ballSize}</span>
          </div>

          <div className="right-sidebar__slider-labels">
            <span>1</span>
            <span>10</span>
          </div>
        </section>

        <button className="right-sidebar__add-btn" onClick={handleAddBall}>
          + Add to Scene
        </button>
      </div>

      <div className="right-sidebar__scene-objects">
        <div className="right-sidebar__scene-objects-header">
          <div className="right-sidebar__objects-header">
            <img src={objectsIcon} alt="objects" />
            <h5 className="right-sidebar__label">Scene Objects</h5>
          </div>
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
            <div className="right-sidebar__empty">
              <div className="right-sidebar__empty-icon" />
              <p className="right-sidebar__empty-title">No objects in scene.</p>
              <p className="right-sidebar__empty-subtitle">
                Add a ball to get started.
              </p>
            </div>
          ) : (
            spheres.map((sphere, index) => (
              <div
                key={sphere.id}
                className={`right-sidebar__object ${
                  selectedBallId === sphere.id
                    ? "right-sidebar__object--selected"
                    : ""
                }`}
                onClick={() => {
                  setSelectedBallId(sphere.id);
                  handleFocusBall(sphere.position);
                }}
              >
                <div
                  className="right-sidebar__object-color"
                  style={{ backgroundColor: sphere.color }}
                />
                <div className="right-sidebar__object-info">
                  <span className="right-sidebar__object-name">
                    Ball {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="right-sidebar__object-size">
                    size {sphere.radius * 10}
                  </span>
                </div>
                <button
                  className="right-sidebar__object-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSphereVisibility(sphere.id);
                  }}
                  aria-label="Toggle visibility"
                >
                  <img src={eyeIcon} alt="toggle visibility" />
                </button>
                <button
                  className="right-sidebar__object-btn right-sidebar__object-btn--delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSphere(sphere.id);
                  }}
                  aria-label="Delete ball"
                >
                  <img src={trashIcon} alt="delete object" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};
