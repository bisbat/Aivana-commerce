'use client';
import { useState } from 'react';

interface EditProductFileProps {
  currentFile: string | null;
  newFile: File | null;
  onFileChange: (file: File | null) => void;
  onRemoveFile: () => void;
}

export default function EditProductFile({
  currentFile,
  newFile,
  onFileChange,
  onRemoveFile
}: EditProductFileProps) {
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onFileChange(file);
    }
  };

  const handleRemove = () => {
    onRemoveFile();
    // Clear the input
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) input.value = '';
  };

  // Extract filename from URL path
  const getFileName = (url: string | null) => {
    if (!url) return '';
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    // Remove timestamp prefix if exists (e.g., "uploaded-1763474259391-MochikokEieie.zip" -> "MochikokEieie.zip")
    return filename.replace(/^uploaded-\d+-/, '');
  };

  // Get file extension for icon display
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  // Get icon based on file type
  const getFileIcon = (extension: string) => {
    switch (extension) {
      case 'zip':
      case 'rar':
      case '7z':
        return '📦';
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'fig':
        return '🎨';
      case 'psd':
        return '🖼️';
      default:
        return '📁';
    }
  };

  const displayFile = newFile || currentFile;
  const fileName = newFile ? newFile.name : getFileName(currentFile);
  const fileExtension = getFileExtension(fileName);
  const fileIcon = getFileIcon(fileExtension);

  return (
    <div className="space-y-4">
      {/* Current/New Product File */}
      {displayFile && (
        <div className="border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{fileIcon}</span>
              <div>
                <p className="font-medium">{fileName}</p>
                {newFile && (
                  <p className="text-sm text-green-600">
                    ✓ New file selected (will replace current file when saved)
                  </p>
                )}
                {currentFile && !newFile && (
                  <a 
                    href={currentFile} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Download current file
                  </a>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Upload New Product File */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {displayFile ? 'Replace Product File' : 'Upload Product File'}
        </label>
        <input
          type="file"
          onChange={handleFileSelect}
          accept=".zip,.rar,.7z,.fig,.psd,.pdf,.doc,.docx"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: ZIP, RAR, 7Z, FIG, PSD, PDF, DOC, DOCX
        </p>
      </div>

      {!displayFile && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <span className="text-4xl text-gray-400">📁</span>
          <p className="text-sm text-gray-500 mt-2">No product file uploaded</p>
          <p className="text-xs text-gray-400">Upload a file above</p>
        </div>
      )}
    </div>
  );
}