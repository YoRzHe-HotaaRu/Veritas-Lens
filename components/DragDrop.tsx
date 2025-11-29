import React, { useCallback, useState, useRef } from 'react';
import { Upload, FileImage, ScanLine, AlertCircle } from 'lucide-react';
import { DragDropProps } from '../types';

export const DragDrop: React.FC<DragDropProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndPassFile = (file: File) => {
    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Only image files (JPG, PNG, WEBP) are supported.');
      return;
    }
    // Validate size (e.g., max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }
    setError(null);
    onFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  }, [disabled, onFileSelect]);

  const handleManualSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  const triggerClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerClick}
        className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-2xl p-12
          transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center text-center
          ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200' : ''}
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-xl' 
            : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50 bg-white shadow-sm hover:shadow-md'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleManualSelect}
          disabled={disabled}
        />

        <div className={`
          p-4 rounded-full mb-6 transition-colors duration-300
          ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'}
        `}>
          {isDragging ? <ScanLine size={48} /> : <Upload size={48} />}
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {isDragging ? 'Drop to analyze' : 'Drag & Drop your image'}
        </h3>
        <p className="text-slate-500 mb-6 max-w-xs mx-auto">
          Upload any PNG, JPG, or WEBP to begin the forensic analysis.
        </p>

        <button 
          className={`
            px-6 py-2.5 rounded-lg font-medium text-sm transition-all
            ${isDragging 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
            }
          `}
        >
          Select File
        </button>

        {error && (
          <div className="absolute -bottom-12 left-0 right-0 flex items-center justify-center text-red-600 animate-fade-in">
            <AlertCircle size={16} className="mr-2" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};