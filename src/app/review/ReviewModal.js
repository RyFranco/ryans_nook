import './ReviewModal.css';

export default function ReviewModal({ children, onClose, size = "default" }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className={`modal-content ${size === "small" ? "modal-small" : ""}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}
