import React, { useEffect } from 'react';
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { MdOutlineFileCopy } from "react-icons/md";


const UploadProgress = ({ messages, setMessages,uuid, fileName }) => {
    useEffect(() => {
        // Create an EventSource to connect to the SSE endpoint
        const eventSource = new EventSource('http://backend.ezly.site/api/uploadPercentage?uuid=${uuid}');

        // Listen for messages from the server
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data); // Parse incoming data
                if(data && data.percentage >= 100 ) setMessages(null)
                setMessages(data)
            } catch (error) {
                console.error('Error parsing SSE data:', error);
            }
        };

        // Handle errors or connection closure
        eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
            eventSource.close(); // Close the connection on error
        };

        // Cleanup on component unmount
        return () => {
            console.log('Closing SSE connection for file:', fileName);
            eventSource.close();
        };
    }, [uuid, messages]); // Dependency array ensures this runs when fileName changes

    return (
        <div className="fixed flex flex-col gap-2 bottom-4 right-4 shadow-xl w-80 bg-gray-50 rounded-lg p-4">
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
          <CircularProgressbar value={messages?.percentage || 0} className="h-12 w-12" strokeWidth={8}  text={`${messages?.percentage || 0}%`} />
          </div>
        </div>
      </div>
    );
};

export default UploadProgress;

