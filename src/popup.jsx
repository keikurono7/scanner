// PopupModal.js
import React from 'react';
import './App.css'; // Create this CSS file for styling

const PopupModal = ({ message, color, onClose }) => {
    return (
        <div className="popup-modal" style={{ backgroundColor: color }}>
            <div className="popup-content">
                <h2>{message}</h2>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default PopupModal;
