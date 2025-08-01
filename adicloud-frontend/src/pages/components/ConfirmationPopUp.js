import React from 'react';
import './ConfirmationPopUp.css';

function ConfirmationPopup({ message, onConfirm, onCancel }) {
  return (
    <div className="popup-backdrop">
      <div className="popup-box">
        <div className='ContenidoPopUp'>
          <p className='ComfirmationQuestion'>{message}</p>
          <div className="popup-actions">
            <button onClick={onConfirm} className="confirm">Yes</button>
            <button onClick={onCancel} className="cancel">No</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPopup;