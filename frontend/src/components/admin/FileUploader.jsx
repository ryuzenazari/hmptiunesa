import { useState } from 'react';

export default function FileUploader({ onFileUpload, acceptedTypes = "*", maxSizeMB = 5 }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError('');

    const files = [...e.dataTransfer.files];

    if (files && files[0]) {
      validateAndUploadFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    setError('');
    const files = [...e.target.files];

    if (files && files[0]) {
      validateAndUploadFile(files[0]);
    }
  };

  const validateAndUploadFile = (file) => {
    // Check file type if specific types are required
    if (acceptedTypes !== "*") {
      const fileType = file.type;
      const acceptedTypeArray = acceptedTypes.split(',');
      
      if (!acceptedTypeArray.some(type => fileType.includes(type.trim()))) {
        setError(`Tipe file tidak valid. Hanya ${acceptedTypes} yang diperbolehkan.`);
        return;
      }
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`Ukuran file terlalu besar. Maksimal ${maxSizeMB} MB.`);
      return;
    }

    // Create a preview and call the parent's handler
    const reader = new FileReader();
    reader.onload = () => {
      onFileUpload({ file, preview: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <div className="mb-3 text-3xl text-gray-400">📁</div>
        <p className="mb-2 text-sm font-medium text-gray-700">
          Seret dan lepaskan file di sini atau klik untuk memilih
        </p>
        <p className="text-xs text-gray-500">
          {acceptedTypes === "*" 
            ? `Menerima semua jenis file hingga ${maxSizeMB} MB` 
            : `Menerima file ${acceptedTypes.replace(/\./g, '')} hingga ${maxSizeMB} MB`}
        </p>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      <input
        id="fileInput"
        type="file"
        className="hidden"
        onChange={handleFileInput}
        accept={acceptedTypes}
      />
    </div>
  );
} 