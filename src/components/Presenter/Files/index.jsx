import React from 'react';
import fold from '../../../assets/fold.png'
import filei from '../../../assets/file.png'

export const Files = ({ setNullFolder, fileData }) => {

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
              <img className="h-6 w-6" src={filei} />
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
              <td className="p-4">Owner Name (if available)</td>
            </tr>
          ))}
      </tbody>
    </>
  );
};
