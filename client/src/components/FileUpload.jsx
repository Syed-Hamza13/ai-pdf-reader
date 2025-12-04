// ============================================
// client/src/components/FileUpload.jsx
// ============================================
import { useRef, useState } from "react";

function FileUpload({ onFileUploaded }) {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const uploadWithXHR = (file) => {
    const xhr = new XMLHttpRequest();
    const url = (process.env.REACT_APP_API_URL || "http://localhost:5000") + "/upload/pdf";
    const formData = new FormData();
    formData.append("pdf", file);

    xhr.open("POST", url, true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      setProgress(0);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText);
          onFileUploaded && onFileUploaded(json);
        } catch (err) {
          console.error("Invalid JSON response:", xhr.responseText);
        }
      } else {
        console.error("Upload failed", xhr.status, xhr.responseText);
        alert("Upload failed");
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setProgress(0);
      alert("Network error during upload");
    };

    setUploading(true);
    xhr.send(formData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }
    uploadWithXHR(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      uploadWithXHR(file);
    } else {
      alert("Please upload a PDF file");
    }
  };

  return (
    <div
      className={`upload-container ${isDragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
      onClick={() => fileRef.current.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="upload-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <p className="upload-text">
        {uploading ? `Uploading... ${progress}%` : "Drag and Drop Your PDF Here"}
      </p>
      <p className="upload-subtext">or click to browse</p>

      <input
        type="file"
        accept="application/pdf"
        ref={fileRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {uploading && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

export default FileUpload;

