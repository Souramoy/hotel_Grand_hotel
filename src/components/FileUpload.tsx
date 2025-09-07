import React, { useState, ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (fileUrl: string) => void;
  currentImage?: string;
  label?: string;
  accept?: string;
  fileType?: 'image' | 'video';
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  currentImage,
  label,
  accept,
  fileType = 'image'
}) => {
  // Set defaults based on fileType
  const defaultLabel = fileType === 'image' ? 'Upload Image' : 'Upload Video';
  const defaultAccept = fileType === 'image' ? 'image/*' : 'video/*';
  
  // Use provided values or defaults
  const finalLabel = label || defaultLabel;
  const finalAccept = accept || defaultAccept;
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the file
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Use API URL from environment variables
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onFileUpload(data.fileUrl);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {finalLabel}
      </label>
      <div className="mt-1 flex flex-col items-center">
        {preview ? (
          <div className="relative w-full h-48 mb-3">
            {fileType === 'image' ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <video
                src={preview}
                controls
                className="w-full h-full rounded-md"
              />
            )}
          </div>
        ) : (
          <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center mb-3">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
        )}

        <div className="w-full">
          <label
            htmlFor="file-upload"
            className="cursor-pointer w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 flex justify-center items-center"
          >
            {uploading ? 'Uploading...' : `Choose ${fileType === 'image' ? 'Image' : 'Video'}`}
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              accept={finalAccept}
              disabled={uploading}
            />
          </label>
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default FileUpload;