import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import trash from '../../../assets/trash-ico.png';
import { ToastContainer, toast } from 'react-toastify';

export const Trash = () => {
    const [trashed, setTrashed] = useState([]);
    const [files, setFiles] = useState([]);
    const [currentFolderName, setCurrentFolderName] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [fileIdToDelete, setFileIdToDelete] = useState(null);
    const [fileName,setFileName] =useState(null)
    const [size,setSize]= useState(null)
    const [createdAt , setCreatedAt] = useState(null)

    const getSize = (sizeInBytes)=>{
        if (sizeInBytes < 1024) {
          return `${sizeInBytes} B`; // Bytes
        } else if (sizeInBytes < 1024 * 1024) {
          return `${(sizeInBytes / 1024).toFixed(2)} KB`; // Kilobytes
        } else {
          return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`; // Megabytes
        }
      }

    const getMyTrashRepo = async () => {
        try {
            const result = await api.get('/api/folder/trash/getFolders');
            setTrashed(result.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const openTrashFolder = async (folderName) => {
        try {
            const result = await api.post('/api/files/trash/getFiles', { folderName });
            setFiles(result.data.files);
            setCurrentFolderName(folderName);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    const restoreFile = async (fileData) => {
        try {
            await api.post(`/api/files/trash/restoreFile`,{
                folderName:currentFolderName,
                fileData:fileData
            });
            toast.success('File Restored Successfully')
        } catch (error) {
            console.error("Error restoring folder:", error);
        }
    };

    const deleteForever = async (fileData) => {
        setFileIdToDelete(fileData.fileUrl); // Set the file ID to be deleted
        setFileName(fileData.name);
        setSize(fileData.size);
        setCreatedAt(fileData.createdAt)
        setShowModal(true); // Show the modal
    };

    const confirmDelete = async () => {
        try {
            await api.post(`/api/files/trash/deleteFile/`,{
                folderName:currentFolderName,
                fileData:{
                    name: fileName,
                    size:size,
                    fileUrl:fileIdToDelete,
                    createdAt:createdAt
                }

            });
            setFiles(files.filter(file => file.fileUrl !== fileIdToDelete));
            toast.success('File Deleted Successfully')
            setShowModal(false); // Hide the modal after deletion
        } catch (error) {
            console.error("Error deleting file forever:", error);
            setShowModal(false); // Hide the modal if there's an error
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        getMyTrashRepo();
    }, []);

    return (
        
        <div className="md:ml-60 flex-grow bg-gray-50 p-8 transition-all duration-200 ease-in-out">
            {/* Header */}<ToastContainer/>
            <div className="flex items-center gap-2 mb-6">
                <img src={trash} className="w-16 h-16" alt="Trash Icon" />
                <h3 className="text-2xl font-bold">{currentFolderName ? `Folder: ${currentFolderName}` : "Trash"}</h3>
            </div>

            {/* Back Button */}
            {currentFolderName && (
                <button
                    className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    onClick={() => setFiles([]) || setCurrentFolderName(null)}
                >
                    Back to Folders
                </button>
            )}

            {/* Folder or File Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-4 text-left text-gray-600 font-medium">Name</th>
                            <th className="p-4 text-left text-gray-600 font-medium">
                                {currentFolderName ? "Type" : "Deleted At"}
                            </th>
                            <th className="p-4 text-left text-gray-600 font-medium">Size</th>
                            <th className="p-4 text-center text-gray-600 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentFolderName
                            ? // Render Files
                            files.length > 0 ? (
                                files.map((file, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="p-4">{file?.name || "Unnamed"}</td>
                                        <td className="p-4 text-gray-500">{file.type || "File"}</td>
                                        <td className="p-4 text-gray-500">{getSize(file?.size) || "0 KB"}</td>
                                        <td className="p-4 text-center">
                                            <button
                                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                onClick={() => restoreFile({fileUrl : file?.fileUrl ,name: file?.name,size:file?.size,createdAt:file.createdAt})}
                                            >
                                                Restore
                                            </button>
                                            <button
                                                className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                onClick={() => deleteForever({fileUrl : file?.fileUrl ,name: file?.name,size:file?.size,createdAt:file.createdAt})}
                                            >
                                                Delete Forever
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center p-4 text-gray-500">
                                        No files found in this folder.
                                    </td>
                                </tr>
                            )
                            : // Render Folders
                            trashed.length > 0 ? (
                                trashed.map((folder, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="p-4">
                                            <button
                                                className="text-blue-500 hover:underline"
                                                onClick={() => openTrashFolder(folder)}
                                            >
                                                {folder || "Unnamed"}
                                            </button>
                                        </td>
                                        <td className="p-4 text-gray-500">{folder.deletedAt || "N/A"}</td>
                                        <td className="p-4 text-gray-500">{folder.size || "0 KB"}</td>
                                        <td className="p-4 flex justify-center space-x-4">
                                           -
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center p-4 text-gray-500">
                                        No trashed items found.
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
                        <p>Are you sure you want to delete this file forever?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 mr-2"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={confirmDelete}
                            >
                                Delete Forever
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
