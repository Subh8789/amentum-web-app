import React from 'react';

function LoadingModal() {
  return (
    <div className="modal-overlay">
    <div className="modal-content">
      <div className="loading-spinner"></div>
      <p>Processing your request...</p>
    </div>
  </div>
  )
}

export default LoadingModal