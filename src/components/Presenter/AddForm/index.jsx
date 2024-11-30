import React, { useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import api from '../../../services/api';


const CreateFolderForm = ({ showForm ,setShowForm }) => {
  const [folderName, setFolderName] = useState('');
  const [isSecure, setIsSecure] = useState(false);
  const [password, setPassword] = useState('');

  const setInfo = async (body) => {
    const x = await api.post("/api/folder/create", body);

  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    // Validation
    if (!folderName.trim()) {
      alert('Folder name is required');
      return;
    }

    if (isSecure && !password.trim()) {
      alert('Password is required for a secure folder');
      return;
    }

    // Form data to send
    const data = {
      folderName,
      isSecure,
      password: isSecure ? password : null,
    };

    // Pass the data to the parent component's handler
    await setInfo(data)
    setShowForm(false);
    // Clear the form
    setFolderName('');
    setIsSecure(false);
    setPassword('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg relative">
        <RxCross2 className='absolute right-6 top-6 cursor-pointer' onClick={()=>setShowForm(false)}/>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Create Folder</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Folder Name</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isSecure}
                onChange={(e) => setIsSecure(e.target.checked)}
              />
              <span>Secure Folder</span>
            </label>
          </div>

          {isSecure && (
            <div>
              <label className="block font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderForm;
