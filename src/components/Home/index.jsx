import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const HomePage = () => {
  const [folderName, setFolderName] = useState('longy');
  const [password, setPassword] = useState('');
  const [includePassword, setIncludePassword] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [folders, setFolders] = useState([]); // State to store fetched folders

  // Function to create folder
  const handleCreateFolder = async () => {
    try {
      if (!folderName) {
        setMessage('Folder name is required');
        return;
      }

      const data = { folderName };
      if (includePassword) {
        data.password = password;
      }

      const response = await axios.post('http://localhost:3001/api/folder/create', data);
      setMessage(response.data.message || 'Folder created successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error creating folder');
    }
  };

  // Function to upload file
  const handleUploadFile = async () => {
    if (!file) {
      setMessage('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderName', folderName);

    try {
      const response = await axios.post('http://localhost:3001/api/files/upload', formData, {
        // headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message || 'File uploaded successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error uploading file');
    }
  };

  // Automatically fetch folders on component mount
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/folder/get');
        setFolders(response.data.data || []);
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };

    fetchFolders();
  }, []);

  return (
    <div>
      <h1>HomePage</h1>
      <div>
        <h2>Create Folder</h2>
        <input
          type="text"
          placeholder="Folder Name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <br />
        <label>
          <input
            type="checkbox"
            checked={includePassword}
            onChange={() => setIncludePassword(!includePassword)}
          />
          Add Password
        </label>
        {includePassword && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        <button onClick={handleCreateFolder}>Create Folder</button>
      </div>

      <div>
        <h2>Upload File</h2>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={()=>{handleUploadFile()}}>Upload File</button>
      </div>

      <div>
  <h2>Available Folders</h2>
  <ul>
    {folders &&
      Object.keys(folders).map((key) => (
        <li key={key}>
          <strong>{folders[key].name}</strong> (ID: {key})
          <ul>
            {folders[key].files?.length > 0 ? (
              folders[key].files.map((file, index) => (
                <a target="_blank" rel="noopener noreferrer" href={file} key={index}>{file}</a>
              ))
            ) : (
              <li>No files available</li>
            )}
          </ul>
        </li>
      ))}
  </ul>
</div>



      {message && <p>{message}</p>}
    </div>
  );
};
