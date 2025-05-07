import React, { useState } from 'react';
import './UploadPage.css';

const UploadPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setProcessedImage(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      console.log("Sending image for processing...");
      const response = await fetch('http://localhost:5000/api/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process the image');
      }

      const blob = await response.blob();
      const imageURL = URL.createObjectURL(blob);
      setProcessedImage(imageURL);
      console.log("Image processed successfully");
    } catch (error) {
      console.error('Upload failed:', error);
      setError('There was an error processing the image');
    }

    setLoading(false);
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <h1 className="upload-title">Upload an Image for Detection</h1>

        <input type="file" onChange={handleImageChange} accept="image/*" />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Processing...' : 'Detect'}
        </button>

        {error && <p className="error-text">{error}</p>}

        <div className="image-preview">
          {selectedImage && (
            <div>
              <h3>Original:</h3>
              <img src={URL.createObjectURL(selectedImage)} alt="Original" />
            </div>
          )}

          {processedImage && (
            <div>
              <h3>Processed:</h3>
              <img src={processedImage} alt="Processed" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
