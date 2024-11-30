import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { MdOutlineFileCopy } from "react-icons/md";

const FileUpload = ({ progress,fileName }) => {
  return (
    <div className="fixed flex flex-col gap-2 bottom-4 right-4 shadow-xl w-80 bg-gray-50 rounded-lg p-4">
      {/* Header */}
      <div className="mb-4 border-b-slate-600">
        <h2 className="text-gray-700 font-large font-bold text-sm ">Uploading Files</h2>
      </div>
    <div className="w-full bg-slate-600 h-[0.5px]"></div>
      {/* Upload Section */}
      <div className="flex items-center justify-between">
        {/* File Details */}
        <div className="flex items-center gap-2">
        <MdOutlineFileCopy />
          <span className="text-sm text-gray-700 truncate">{fileName?.slice(0, 15)}</span>
        </div>

        {/* Circular Progress */}
        <div className="relative h-12 w-12 rounded-full shadow-md bg-white flex items-center justify-center">
        <CircularProgressbar value={progress} className="h-12 w-12" strokeWidth={8}  text={`${progress}%`} />
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
