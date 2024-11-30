import React, { useState } from 'react';

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);

  // Handle file selection from input
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleRemoveFile = (fileName) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to upload files goes here
    alert('Files uploaded');
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Upload Files</h2>
      <form onSubmit={handleSubmit}>
        {/* File Upload Section */}
        <div
          className={`p-6 border-2 border-dashed rounded-lg mb-4 transition-all ${
            dragging ? 'border-blue-500' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 7v10l3-3 3 3V7M17 7l-5-5-5 5"
              />
            </svg>
            <p className="text-gray-500">
              Drag & Drop files here or{' '}
              <label htmlFor="file-upload" className="text-blue-500 cursor-pointer">
                Browse
              </label>
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Selected Files</h3>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
                >
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file.name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Upload Files
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUploader;
