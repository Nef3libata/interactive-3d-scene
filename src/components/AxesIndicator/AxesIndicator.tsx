import { useState, useEffect } from "react";
import { Quaternion, Vector3 } from "three";
import "./AxesIndicator.scss";

export const cameraQuaternionRef = { current: new Quaternion() };

const SIZE = 64;
const CENTER = SIZE / 2;
const AXIS_RADIUS = 21;
const LABEL_RADIUS = 30;

const AXES_CONFIG = [
  { dir: [0, 1, 0] as const, color: "#4ADE80", label: "Y" },
  { dir: [1, 0, 0] as const, color: "#F87171", label: "X" },
  { dir: [0, 0, 1] as const, color: "#60A5FA", label: "Z" },
];

interface ProjectedAxis {
  color: string;
  label: string;
  tipX: number;
  tipY: number;
  labelX: number;
  labelY: number;
}

const _v = new Vector3();
const _invQuat = new Quaternion();
const _prevQuat = new Quaternion();

function projectAxes(): ProjectedAxis[] {
  _invQuat.copy(cameraQuaternionRef.current).invert();

  return AXES_CONFIG.map(({ dir, color, label }) => {
    _v.set(dir[0], dir[1], dir[2]).applyQuaternion(_invQuat);
    return {
      color,
      label,
      tipX: CENTER + _v.x * AXIS_RADIUS,
      tipY: CENTER - _v.y * AXIS_RADIUS,
      labelX: CENTER + _v.x * LABEL_RADIUS,
      labelY: CENTER - _v.y * LABEL_RADIUS,
    };
  });
}

export const AxesIndicator = () => {
  const [axes, setAxes] = useState<ProjectedAxis[]>(projectAxes);

  useEffect(() => {
    let rafId: number;

    const update = () => {
      if (!_prevQuat.equals(cameraQuaternionRef.current)) {
        _prevQuat.copy(cameraQuaternionRef.current);
        setAxes(projectAxes());
      }
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="axes-indicator">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {axes.map((axis) => (
          <g key={axis.label}>
            <line
              x1={CENTER}
              y1={CENTER}
              x2={axis.tipX}
              y2={axis.tipY}
              stroke={axis.color}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx={axis.tipX} cy={axis.tipY} r="2" fill={axis.color} />
            <text
              x={axis.labelX}
              y={axis.labelY}
              fill={axis.color}
              fontSize="8"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontWeight: 600 }}
            >
              {axis.label}
            </text>
          </g>
        ))}
        <circle cx={CENTER} cy={CENTER} r="2.5" fill="#475569" />
      </svg>
      <span className="axes-indicator__label">AXES</span>
    </div>
  );
};
