import React, { useState } from 'react';
import axios from 'axios';
import './AddpackPopup.css'

function AddpackPopup({ categories, token, onClose }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [customCategory, setCustomCategory] = useState('');

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory = category === 'Otro' ? customCategory : category;

    if (!name || !finalCategory || !file) {
        alert("Please, fill in all the fields");
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', finalCategory);
    formData.append('files', file); // solo un archivo o usa bucle si son varios

        try {
                const response = await axios.post('http://localhost:3001/assets/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Uploaded Pack SUccessfully');
            console.log(response.data);
            onClose(); // cierra el popup
        } catch (error) {
            console.error(error);
            alert('ERROR upload pack');
        }
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
