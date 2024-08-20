import React, { useState } from 'react';
import { useDropzone, Accept } from 'react-dropzone';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const acceptTypes: Accept = {
  'image/jpeg': [],
  'image/png': [],
};

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptTypes,
    maxSize: 5 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFileName(file.name);
        onFileUpload(file);
        setError(null);
      }
    },
    onDropRejected: () => {
      setError('Only image files under 5MB are accepted.');
      setFileName(null);
    },
  });

  return (
    <div className="bg-white rounded-lg space-micro border border-gray-300 p-4 shadow-lg">
      <div {...getRootProps({ className: 'cursor-pointer text-center' })}>
        <input {...getInputProps()} />
        <div className="p-4">
          <p className="text-lg font-semibold text-gray-700">Drag & drop an image file here, or click to select one</p>
          {fileName && (
            <p className="mt-2 text-md font-medium text-gray-600">Selected file: <strong>{fileName}</strong></p>
          )}
          {error && (
            <p className="mt-2 text-md font-medium text-red-500">{error}</p>
          )}
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-500">Allowed file types: .jpg, .jpeg, .png. Maximum size: 5MB.</p>
    </div>
  );
};

export default FileUpload;
