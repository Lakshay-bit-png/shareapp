import React, { useState } from 'react';
import fold from '../../../assets/fold.png'
import filei from '../../../assets/file.png'
import { FaRegShareSquare } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { CgOptions } from "react-icons/cg";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import api from "../../../services/api";
import { toast } from 'react-toastify';

export const Files = ({ setNullFolder, fileData ,folderName }) => {

  const [shareAbleLink,setShareLink] = useState(null)
  console.log(fileData)
  const getShareableLinkForThisEntity = async(key)=>{
    try{
      const data = {
        isFile:true,
        folderName:folderName,
        fileId:key
      }
      const link = await api.post('/api/share/generateLink',data)
      setShareLink(link?.data?.link);
      await navigator.clipboard.writeText(link?.data?.link);
      toast.success('Link Copied to Clipboard')
    }
    catch{}
  }

  const addFileToTrash = async(fileUrl)=> { 
    try{
      const body = {
        folderName : folderName,
        fileId : fileUrl
      }
      const response = await api.post('/api/files/trash/add',body)
      if(response.status==200) toast.success(response.data.message)
      else{ toast.error(response.data.message)}
    } 
    catch{
      toast.error('Some Error Occurred')
    }
  }

  return (

    <>
      <tbody>
      <tr className='border-b hover:bg-blue-100' onClick={() => setNullFolder()}>
  {/* Stylish Folder Dot Button */}
  <td className="p-2 text-gray-500 flex "  >
  <img className="h-6 w-6" src={fold} />
  <button
    className="flex items-end justify-center p-0 text-blue-600  rounded-full"
     // Navigate back to the parent folder
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 inline-block" // Ensure the SVGs are inline and closely packed
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
    </svg>
   
  </button>
</td>


  {/* Conditional rendering of empty folder message */}
  {fileData && fileData?.files?.length === 0 && (
    <td className="text-gray-400">Empty Folder</td>
  )}
  <td></td>
  <td></td>
  <td></td>
  <td></td>
</tr>


        {/* Correctly map through the fileData.files */}
        {fileData &&
  fileData?.files?.map((file, index) => (
    <tr key={index} className="border-b">
      {/* Render the file name extracted from fileUrl */}
      <td className="p-4 flex gap-4 text-gray-500">
        <img className="h-6 w-6" src={filei} alt="file-icon" />
        <a
          href={file.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {file?.fileUrl?.split('/').pop() || "Unknown File"}
        </a>
      </td>

      {/* Render the createdAt date */}
      <td className="p-4">
        {new Date(file.createdAt).toLocaleString() || "Unknown Date"}
      </td>

      {/* Placeholder for owner and size (if available) */}
      <td className="p-4">{file.size || 0}</td>

      {/* Dropdown options */}
      <td className="relative p-4">
        <div className="group relative">
          {/* CgOptions Icon */}
          <CgOptions className="text-gray-500 text-xl cursor-pointer hover:text-gray-700" />
          {/* Dropdown Menu */}
          <div
            className="absolute top-0 bg-black text-white text-sm rounded-lg opacity-0 invisible 
              group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out 
              flex flex-col py-2 shadow-lg z-10"
          >
            <div
              className="hover:bg-gray-700 p-2 rounded cursor-pointer flex items-center"
              onClick={() => getShareableLinkForThisEntity(file?.fileUrl)}
            >
              <FaRegShareSquare className="mr-2" /> Share
            </div>
            <div
              className="hover:bg-gray-700 p-2 rounded cursor-pointer flex items-center"
              onClick={() => addFileToTrash(file?.fileUrl)}
            >
              <MdOutlineDelete className="mr-2" /> Delete
            </div>
            
          </div>
        </div>
      </td>
    </tr>
  ))}

      </tbody>
    </>
  );
};
