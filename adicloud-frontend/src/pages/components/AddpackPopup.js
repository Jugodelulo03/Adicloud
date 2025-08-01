import React, { useState } from 'react';
import './AddpackPopup.css'

function AddpackPopup({ categories, onSave, onClose }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [customCategory, setCustomCategory] = useState('');

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = () => {
    const finalCategory = category === 'Otro' ? customCategory : category;
    onSave({ name, category: finalCategory, file });
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>Add a New Asset Pack</h2>

        <label className="upload-label">
          <input type="file" onChange={handleFileChange} hidden />
          <button className="upload-button">Upload a file</button>
        </label>

        <input
          type="text"
          placeholder="Name*"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Category*</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
          <option value="Otro">Otro</option>
        </select>

        {category === 'Otro' && (
          <input
            type="text"
            placeholder="Enter category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
        )}

        <button className="save-button" onClick={handleSubmit}>Save</button>
      </div>
    </div>
  );
}

export default AddpackPopup;
