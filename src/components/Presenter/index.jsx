import React, { useEffect, useState ,useRef } from "react";
import api from "../../services/api";
import fold from '../../assets/fold.png'
import { useWebSocket } from '../WebSocketContext';
import { messaging } from "./../firebase";
import { getToken } from "firebase/messaging";
import { Files } from "./Files";
import { PiLockSimpleBold, PiLockSimpleOpenBold } from "react-icons/pi";
import { FaLockOpen } from "react-icons/fa6";
import FileUpload from "./ProgressTrack";
import PasswordModal from "./PasswordModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UploadProgress from "../Uploader";
import { v4 as uuidv4 } from 'uuid';

const Presenter = ({messages,setMessages,showForm,setShowForm, setTotalStorage}) => {
  const [folderData, setFolderData] = useState(null);
  const [fileData,setFileData] = useState(null);
  const fileInputRef = useRef(null);
  const [uuid,setuuid] = useState(null)
  // const { messages } = useWebSocket();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [folderName, setFolderName] = useState(null);
  const maxSize = 1 * 1024 * 1024 * 1024; // 1 GB in bytes
  const [fileName,setFileName] = useState(null)
  const [registrationToken, setRegistrationToken] = useState("");
  const [ip,setIp] = useState(null)

  async function requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "BOOcaQUA8w3rOlYkpmK2NFZfL52Tu8NURu2A5zjd_jrVG7LOAsgbR_la9dRgtv85aP-MXkgODl5AlYI9ASIY_3U",
        });
        console.log("Token Generated:", token);
        setRegistrationToken(token);
      } else {
        console.warn("Notification permissions denied");
      }
    } catch (error) {
      console.error("Error getting token:", error);
    }
  }
  useEffect(() => {
    requestPermission();
  }, []);

 
  const getInfo = async () => {
    try {
      const x = await api.get("/api/folder/get", {});
      setFolderData(x.data.data);
      setTotalStorage(x.data.total);
      setIp(x.data.ip)
    } catch (error) {
      console.error("Error fetching folder info:", error);
      toast.error("Failed to fetch, Please try again.");
    }
  };
  
  const openFolder = async (name) => {
    try {
      let y = await api.get("/api/folder/get", { folderName: name, allow: true });
      localStorage.setItem("currentFolder", JSON.stringify({ name }));
      setFolderName(name);
      setFileData(y.data.data);
    } catch (error) {
      console.error("Error opening folder:", error);
      toast.error("Error opening folder. Please try again.");
    }
  };
  
  const fetchFolder = async (name, password = null) => {
    try {
      const response = await api.get("/api/folder/get", { folderName: name, password });
      localStorage.setItem("currentFolder", JSON.stringify({ name }));
      setFileData(response.data.data);
      setIsModalVisible(false); // Close the modal
    } catch (error) {
      console.error("Error fetching folder:", error);
      toast.error("Incorrect password or error opening folder.");
    }
  };
  
  const handlePasswordSubmit = (password) => {
    try {
      fetchFolder(folderName, password);
    } catch (error) {
      console.error("Error submitting password:", error);
      toast.error("Error verifying password. Please try again.");
    }
  };
  
  const openFolderAuth = async (name, isSecured) => {
    try {
      if (isSecured) {
        setFolderName(name); // Store folder name for password verification
        setIsModalVisible(true);
        return;
      }
      fetchFolder(name); // Fetch folder directly if not secured
    } catch (error) {
      console.error("Error in openFolderAuth:", error);
      toast.error("Error opening folder. Please try again.");
    }
  };
  
  const setNullFolder = () => {
    try {
      setFolderName(null);
      setFileData(null);
      localStorage.removeItem("currentFolder");
    } catch (error) {
      console.error("Error resetting folder data:", error);
      toast.error("Error resetting folder data. Please try again.");
    }
  };
  
  useEffect(() => {
    try {
      const storedFolder = localStorage.getItem("currentFolder");
      if (storedFolder) {
        const { name } = JSON.parse(storedFolder);
        setFolderName(name);
        openFolder(name);
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
      toast.error("Error loading stored folder data.");
    }
  }, [messages]);
  
  const handleFileChange = async (event) => {
    try {
      const newUuid = uuidv4();
      const file = event.target.files[0];
      setFileName(file.name)
      setuuid(newUuid)
      if (file && file.size > maxSize) toast.alert(`File Size can't be greate than 1GB `)
      if (file) {
       
        // Form data for the API call
        const formData = new FormData();
        formData.append("file", file); // File
        formData.append("folderName", folderName); // Add folder name or other data as needed
        formData.append('uuid',newUuid);
        formData.append("fcmToken",registrationToken);
        // Make the API call to upload the file
        const response = await api.post("/api/files/upload", formData);
        setFileName(null)
        setuuid(null)
        toast.success("File uploaded successfully!");
        openFolder(folderName)
        
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file. Please try again.");
    }
  };

  

  

  useEffect(() => {
    getInfo();
  }, [showForm]); // Runs only once

  return (<>
  <ToastContainer />
 <PasswordModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handlePasswordSubmit}
      />
    <div className=" md:ml-60 flex-grow  bg-gray-50 p-8 transition-all duration-200 ease-in-out">
    {/* {fileName!=null && (
  <FileUpload progress={messages?.percentage} fileName={messages?.fileName} />
)} */}
{fileName && <UploadProgress messages={messages} setMessages={setMessages} uuid={uuid} fileName={fileName} folderName={folderName}/>}

      {/* Header */}
      
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Hi, {ip || 'Getting your IP'}</h1>
          <div className="flex items-center text-gray-500 gap-2">
            <span className={folderName ? "border-b border-blue-500 transition-all duration-200 ease-in-out":"transition-all duration-200 ease-in-out"} onClick={setNullFolder}>Home</span>
            {folderName && <span>&gt; {folderName}</span>}
          </div>
          
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-gray-200 rounded-full p-2">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 2a7 7 0 110 14A7 7 0 019 2zm0 12a5 5 0 100-10 5 5 0 000 10zm7-5a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          </button>
          <button className="bg-gray-200 rounded-full p-2">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2.293 8.707a1 1 0 011.414 0L10 14.999l6.293-6.292a1 1 0 111.414 1.415l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 010-1.415z" />
            </svg>
          </button>
          <img
            className="w-10 h-10 rounded-full object-cover"
            src="https://via.placeholder.com/40"
            alt="User"
          />
        </div>
      </header>

      {/* Quick Access Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <h3 className="font-medium">G docs</h3>
            <p className="text-sm text-gray-500">2 min ago</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <h3 className="font-medium">Work Sheet</h3>
            <p className="text-sm text-gray-500">3 hours ago</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg shadow-md">
            <h3 className="font-medium">My form new</h3>
            <p className="text-sm text-gray-500">Yesterday 8:15 PM</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
            <h3 className="font-medium">Project Slide</h3>
            <p className="text-sm text-gray-500">Yesterday 4:20 PM</p>
          </div>
        </div>
      </section>

      {/* File Details Table */}
      <div className="flex justify-end items-center">
     
    {fileData && <div>
      
              <label className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all duration-200 ease-in-out" htmlFor="file">
              + Add
              </label>
             

    <input type="file" id="file" ref={fileInputRef} onChange={handleFileChange} className="hidden">
            
    </input>
    </div>}
    {!fileData && (<div className="flex justify-end md:hidden p-4 rounded-xl bg-black">
      <button className="flex items-center w-full">
            <span className="text-white font-medium" onClick={()=> setShowForm(!showForm)}>+ Create New</span>
          </button>
    </div>)}
    </div>
      <section>
        <h2 className="text-lg font-semibold mb-4">Folders</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Last Modified</th>
                <th className="p-4 text-left">Size</th>
                <th className="p-4 text-left">Owner</th>
                <th className="p-4 text-left">Members</th>
                <th className="p-4 text-left"></th>
              </tr>
            </thead>
            {fileData && <Files setNullFolder={setNullFolder} fileData = {fileData} setFileData={setFileData}/>}
            <tbody>
            {!fileData && !folderData &&(<>
              <tr>
                <td className="p-4 text-left"></td>
                <td className="p-4 text-left"></td>
                <td className="p-4 text-left text-gray-400">No Folder Exists</td>
                <td className="p-4 text-left"></td>
                <td className="p-4 text-left"></td>
                <td className="p-4 text-left"></td>
              </tr>
            </>)}
            {!fileData && folderData && Object.keys(folderData).length > 0 &&
              Object.entries(folderData).map(([key, folder], index) => (
                <tr key={index} className="border-b" onClick={() => folder?.secured ? openFolderAuth(key,folder.secured) : openFolder(key)}>
                  <td className="flex gap-4 p-4">
                    <img className="h-6 w-6" src={fold} />
                    {key || "G docs"}
                  </td>
                  <td className="p-4 text-gray-500">
                    {folder?.updatedAt ? folder.updatedAt : "2 min ago"}
                  </td>
                  <td className="p-4">{folder?.storage || "0"}</td>
                  <td className="p-4">{folder?.owner || "Me"}</td>
                  <td className="p-4 flex items-center space-x-2">
                    <img
                      className="w-6 h-6 rounded-full"
                      src={folder?.memberImage || "https://via.placeholder.com/24"}
                      alt="Member"
                    />
                    <span className="text-gray-500">
                      {folder?.extraMembers || "+5"}
                    </span>
                  </td>
                  <td className="text-xl p">{folder?.secured ? <PiLockSimpleBold/> : <FaLockOpen /> || "0"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
     
    </div>
    </>
  );
};

export default Presenter;
