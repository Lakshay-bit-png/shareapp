import React, { useEffect, useState } from "react";
import { CgOptions } from "react-icons/cg";
import api from "../../../services/api";

export const Share = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const [selectedFile, setSelectedFile] = useState(null); // Holds the selected file for preview
    const [folder,setFolder] = useState(null)
 const [fileData,setFileData]= useState(null)
 const [singleFile, setSingleFile] = useState(null); // Single file (not a folder)

  const files = [
    { name: "Colourful Krishna", owner: "Lakshay Garg", size: "15.51 MB", daysAgo: "13 days ago", type: "image", src: "https://via.placeholder.com/300x200" },
    { name: "3209663-uhd", owner: "Lakshay Garg", size: "18.50 MB", daysAgo: "13 days ago", type: "image", src: "https://via.placeholder.com/300x200" },
    { name: "173282436668-J", owner: "Lakshay Garg", size: "0.16 GB", daysAgo: "10 days ago", type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { name: "25fps.mp4", owner: "Lakshay Garg", size: "18.50 MB", daysAgo: "13 days ago", type: "video", src: "https://www.w3schools.com/html/movie.mp4" },
  ];

  // Open the modal and set the selected file for preview
  const handlePreview = (file) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };



  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  useEffect(() => {
    const fetcher = async () => {
      const pathname = window.location.pathname;
      const lastSegment = pathname.substring(pathname.lastIndexOf("/") + 1);
      try {
        const details = await api.get(`/api/share/getObject/${lastSegment}`);
        if (details.data.data.fileName) {
          // Handle single file
          setSingleFile(details.data.data);
        } else if (details.data.data.folderName) {
          // Handle folder
          setFileData(details.data.data.files);
          setFolder(details.data.data.folderName);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetcher();
  }, []);

  return (
    <div className="md:ml-60 flex-grow bg-gray-50 p-8 transition-all duration-200 ease-in-out">
      <h3 className="text-2xl font-bold mb-6">Shared - {folder|| ""}</h3>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {fileData &&
    fileData?.map((file, index) => (
      <div
        key={index}
        className="relative bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 min-w-sm max-w-sm"
        onClick={() => handlePreview(file?.fileUrl)} // Handle preview on click
      >
        <div className="h-48 bg-gray-200 flex items-center justify-center"> {/* Increased height */}
          {/\.(mp4|mov|webm|ogg|flv)$/i.test(file.fileUrl) ? ( // Video file types
            <video  controls={false} className="w-full h-full object-cover rounded"> {/* Ensures full coverage */}
              <source
                src={file?.fileUrl}
                type={`video/${file?.fileUrl.split('.').pop()}`}
              />
            </video>
          ) : /\.(jpg|jpeg|png|gif|bmp|svg|webp|avif)$/i.test(file?.fileUrl) ? ( // Image file types
            <img
              src={file?.fileUrl}
              alt={file?.fileUrl.split('/').pop()} // Using the last part of the URL as the alt text
              className="w-full h-full object-cover rounded"
            />
          ) : /\.pdf$/i.test(file.fileUrl) ? ( // PDF file type
            <embed
              src={file.fileUrl}
              style={{ overflow: "hidden", pointerEvents: "none" }} 
              type="application/pdf"
              className="w-full  rounded"
            />
          ) : (
            <div className="text-center text-gray-600">
              Unsupported file type
            </div>
          )}
        </div>
        <div className="p-6"> {/* Increased padding */}
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-semibold truncate">{file?.name}</div> {/* Larger text */}
            <CgOptions className="cursor-pointer" />
          </div>
          <p className="text-sm text-gray-600 mb-2">Owner: {file.owner}</p> {/* Added "Owner" label */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Size: {file.size}</span> {/* Added "Size" label */}
            <span className="text-sm text-gray-500">{file.daysAgo}</span>
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-blue-500 w-3 h-3 rounded-full"></div>
      </div>
    ))}
</div>

{singleFile && (
         <div
         className="relative bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 max-w-sm min-w-sm"
         onClick={() => handlePreview(singleFile?.fileId)} // Handle preview on click
       >
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {/\.(mp4|mov|webm|ogg|flv|avif|avi)$/i.test(singleFile.fileId) ? (
                <video controls={false} className="w-full h-full object-cover rounded">
                  <source src={singleFile?.fileId} type={`video/${singleFile?.fileId.split('.').pop()}`} />
                </video>
              ) : /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(singleFile?.fileId) ? (
                <img src={singleFile?.fileId} alt={singleFile?.fileName} className="w-full h-full object-cover rounded" />
              ) : /\.pdf$/i.test(singleFile.fileId) ? (
                <embed src={singleFile.fileId} type="application/pdf" className="w-full h-[calc(100vh-150px)] rounded" />
              ) : (
                <div className="text-center text-gray-600">Unsupported file type</div>
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <div className="text-lg font-semibold truncate">{singleFile?.fileName}</div>
                <CgOptions className="cursor-pointer" />
              </div>
              <p className="text-sm text-gray-600 mb-2">Owner: {singleFile.owner}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Size: {singleFile.size}</span>
                <span className="text-sm text-gray-500">{singleFile.daysAgo}</span>
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-blue-500 w-3 h-3 rounded-full"></div>
          </div>
        )}
      {/* Modal for Preview */}
      {isModalOpen && selectedFile && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
    <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl h-auto">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-black"
        onClick={closeModal}
      >
        ✕
      </button>
      {/\.(mp4|mov|webm|ogg|flv)$/i.test(selectedFile) ? ( // Video file types
        <video controls className="w-full rounded">
          <source src={selectedFile} type={`video/${selectedFile.split('.').pop()}`} />
        </video>
      ) : /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(selectedFile) ? ( // Image file types
        <img
          src={selectedFile}
          alt={selectedFile.split('/').pop()} // Using the last part of the URL as the alt text
          className="w-full h-auto rounded"
        />
      ) : /\.pdf$/i.test(selectedFile) ? ( // PDF file type
        <embed
          src={selectedFile}
          type="application/pdf"
          className="w-full min-h-[calc(100vh-80px)] rounded"

        />
      ) : (
        <div className="text-center text-gray-600">Unsupported file type</div>
      )}
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold">{selectedFile.name}</h3>
        <p className="text-sm text-gray-600">{selectedFile.owner}</p>
      </div>
    </div>
  </div>
)}


    </div>
  );
};
