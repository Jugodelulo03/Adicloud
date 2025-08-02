import React, { useState } from 'react';
import axios from 'axios';
import './AddpackPopup.css'

function AddpackPopup({ categories, token, onClose }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [files, setFiles] = useState([]);
    const [customCategory, setCustomCategory] = useState('');

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalCategory = category === 'Otro' ? customCategory : category;

        if (!name || !finalCategory || !files) {
            alert("Please, fill in all the fields");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('category', finalCategory);

            files.forEach((file) => {
                formData.append('files', file);
            });

            const response = await axios.post('https://adicloud.onrender.com/assets/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Uploaded Pack Successfully');
            console.log(response.data);
            onClose();

        } catch (error) {
            console.error('Upload error:', error.response ? error.response.data : error.message);
            alert('ERROR upload pack');
        }
    }

    return (
        <div className="popup-overlay">
            <div className="popup-card">
                <button className="close-btn" onClick={onClose}>✕</button>
                <h2>Add a New Asset Pack</h2>

                {files.length > 0 && (
                    <div className="preview-container">
                        {files.map((file, index) => (
                        <div key={index} className="file-preview">
                            {file.type.startsWith('image/') && (
                            <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="preview-image"
                            />
                            )}
                            <p className='nameFiless'>{file.name}</p>
                        </div>
                        ))}
                    </div>
                )}

                <div className='contenttt'>
                    <label className="upload-button" htmlFor="fileInput">
                        Upload a file
                    </label>
                    <input id="fileInput" type="file" onChange={handleFileChange} multiple hidden />

                    <div className='textFiels'>
                        <input
                            type="text"
                            placeholder="Name*"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className='textboxs'
                        />

                        <select className='textboxs' value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Category*</option>
                        {categories.map((cat, idx) => (
                            <option key={idx} value={cat}>{cat}</option>
                        ))}
                        <option value="Other">Other</option>
                        </select>
                    </div>

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
        </div>
    );
}

export default AddpackPopup;
