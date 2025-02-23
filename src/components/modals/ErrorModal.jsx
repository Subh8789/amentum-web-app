import React from 'react';

const ErrorModal = ({ message, onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="error-title">Error</h3>
        <p className="error-message">{message}</p>
        <button className="modal-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );

  export default ErrorModal;