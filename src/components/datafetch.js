import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { MdOutlineFileCopy } from "react-icons/md";

const SocketDataFetcher = ({ip,folderName}) => {
  // State to store the fetched data
  const [progress, setProgress] = useState([]);

  // Establish socket connection on component mount
useEffect(() => {
    if (ip && folderName) {
        const socket = io(process.env.REACT_APP_API_BASE_URL);  // Adjust with your server's URL

        // Handle socket connection success
        socket.on('connect', () => {
            console.log('Connected to the server!');
        });

        // Handle the data event from the server
        socket.emit('join', ip);
        console.log(ip);

        socket.on('result', (data) => {
            console.log('Progress data received:', data.result);
            setProgress(data.result); // Update progress state
        });

        // Fetch data every 500ms using setInterval
        const interval = setInterval(() => {
            socket.emit('fetchStatus', { ip: ip, folderName: folderName });
        }, 5);

        // Cleanup on component unmount
        return () => {
            clearInterval(interval); // Clear the interval when component is unmounted
            socket.disconnect();      // Disconnect socket connection
        };
    }
}, [ip, folderName]);

  return (
   <div className="fixed flex flex-col gap-2 bottom-4 right-4 shadow-xl w-80 bg-gray-50 rounded-lg p-4">
         <div className="mb-4 border-b-slate-600">
           <h2 className="text-gray-700 font-large font-bold text-sm">Uploading Files</h2>
         </div>
         <div className="w-full bg-slate-600 h-[0.5px]"></div>
         
         {/* Iterate through messages */}
         {progress?.map((message, index) => (
           <>
          {message.percentage>0 && message.percentage<100 && <div key={index} className="flex items-center justify-between mt-2">
             {/* File Details */}
             <div className="flex items-center gap-2">
               <MdOutlineFileCopy />
               <span className="text-sm text-gray-700 truncate">
                 {message.fileName?.slice(0, 15)}
               </span>
             </div>
       
             {/* Circular Progress */}
             <div className="relative h-12 w-12 rounded-full shadow-md bg-white flex items-center justify-center">
               <CircularProgressbar
                 value={message?.percentage<100 && message?.percentage>0 ? message.percentage : 0}
                 className="h-12 w-12"
                 strokeWidth={8}
                 text={`${message?.percentage<100 && message?.percentage>0 ? message.percentage : 0}%`}
               />
             </div>
           </div>}
           </>
         ))}
       </div>
       
  );
};

export default SocketDataFetcher;
