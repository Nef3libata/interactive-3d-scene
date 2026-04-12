import "./HelpDialog.scss";

const CONTROLS = [
  { action: "Rotate view", shortcut: "Left drag" },
  { action: "Pan view", shortcut: "Right drag" },
  { action: "Zoom in / out", shortcut: "Scroll" },
  { action: "Focus camera on ball", shortcut: "Eye icon" },
  { action: "Remove ball from scene", shortcut: "Trash icon" },
];

interface HelpDialogProps {
  onClose: () => void;
}

export const HelpDialog = ({ onClose }: HelpDialogProps) => (
  <div className="help-overlay" onClick={onClose}>
    <div className="help-dialog" onClick={(e) => e.stopPropagation()}>
      <div className="help-dialog__header">
        <h3 className="help-dialog__title">Controls</h3>
        <button className="help-dialog__close-x" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="help-dialog__rows">
        {CONTROLS.map(({ action, shortcut }) => (
          <div key={action} className="help-dialog__row">
            <span className="help-dialog__action">{action}</span>
            <kbd className="help-dialog__shortcut">{shortcut}</kbd>
          </div>
        ))}
      </div>

      <div className="help-dialog__footer">
        <button className="help-dialog__close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  </div>
);
