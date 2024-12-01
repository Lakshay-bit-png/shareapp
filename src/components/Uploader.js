import React, { useEffect } from 'react';
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { MdOutlineFileCopy } from "react-icons/md";

const UploadProgress = ({ messages, setMessages, uuid,folderName }) => {
    useEffect(() => {
        // Create an EventSource to connect to the SSE endpoint
        const eventSource = new EventSource(`https://backend.ezly.site/api/uploadPercentage?folderName=${folderName}`);

        // Listen for messages from the server
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data); // Parse incoming data
                
                if (data) {
                    // If data is an array, filter and set messages only with valid percentage
                    const validMessages = data.filter(item => item.percentage < 100 && item.percentage !== null);
                    setMessages(validMessages); // Update progress state with valid messages
                }
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
            eventSource.close();
        };
    }, [uuid]); // Dependency array ensures this runs when `uuid` changes

    return (
        <div className="fixed flex flex-col gap-2 bottom-4 right-4 shadow-xl w-80 bg-gray-50 rounded-lg p-4">
            <div className="mb-4 border-b-slate-600">
                <h2 className="text-gray-700 font-large font-bold text-sm">Uploading Files</h2>
            </div>
            <div className="w-full bg-slate-600 h-[0.5px]"></div>
            {/* Upload Section */}
            {messages && messages.length > 0 ? (
                messages.map((message, index) => (
                    <div key={index} className="flex items-center justify-between mb-4">
                        {/* File Details */}
                        <div className="flex items-center gap-2">
                            <MdOutlineFileCopy />
                            <span className="text-sm text-gray-700 truncate">{message.fileName?.slice(0, 15)}</span>
                        </div>

                        {/* Circular Progress */}
                        <div className="relative h-12 w-12 rounded-full shadow-md bg-white flex items-center justify-center">
                            <CircularProgressbar 
                                value={message.percentage || 0} 
                                className="h-12 w-12" 
                                strokeWidth={8} 
                                text={`${message.percentage || 0}%`} 
                            />
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">Preparing...</p>
            )}
        </div>
    );
};

export default UploadProgress;
