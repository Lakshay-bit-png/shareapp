import React, { useEffect, useState } from 'react';
import cloud from '../../assets/cloud.jpg';
import CreateFolderForm from '../Presenter/AddForm';
import api from "../../services/api";
import { useNavigate, useLocation } from 'react-router-dom';
import nav from '../../assets/nav-ico.png'
import { CiTrash } from "react-icons/ci";
import { BsFillGrid1X2Fill } from "react-icons/bs";

export const Navigator = ({ showForm, setShowForm, showCreate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [totalStorage, setTotalStorage] = useState(0);

  const getInfo = async () => {
    try {
      const x = await api.get("/api/folder/get", {});
      setTotalStorage(x.data.total);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <>
      {showForm && <CreateFolderForm showForm={showForm} setShowForm={setShowForm} />}
      <div className="fixed hidden items-center w-full h-full bg-white md:h-screen md:w-64 md:justify-between md:visible md:flex md:flex-col border-r md:border-b border-gray-200 transition-all duration-200 ease-in-out">
        
        {/* Logo */}
        <div className="p-4 flex items-center justify-center md:justify-start">
          <span className="font-bold text-xl text-gray-800 flex items-center">
            <img src={cloud} alt="Cloud" className="h-12 w-12 mr-2" />
            File Cloud<span className="text-red-500">.</span>
          </span>
        </div>

        {/* Create New Button */}

          <div className={`p-4 w-48 flex-row ${showCreate ? 'bg-black': 'bg-gray-400 cursor-not-allowed'} items-center rounded-xl`}>
            <button className="flex items-center w-full justify-center">
              <span className={`text-white font-medium ${showCreate ? '' : 'cursor-not-allowed'} `} disabled={!showCreate} onClick={() => setShowForm(!showForm)}>+ Create New</span>
            </button>
          </div>


        {/* Navigation Links */}
        <ul className="flex flex-row md:flex-col md:gap-6 md:justify-center w-full h-auto items-center">
        <li className={`cursor-pointer flex items-center justify-center gap-1 text-md  w-full text-center p-4 ${isActiveRoute('/') ? 'bg-blue-900 text-white' : 'hover:bg-gray-100 md:hover:bg-transparent'}`} onClick={() => navigate('/')}>
           <BsFillGrid1X2Fill/>My Cloud
          </li>
          {/* <li className={`cursor-pointer p-4  w-full text-center ${isActiveRoute('/share') ? 'bg-blue-900  text-white' : 'hover:bg-gray-100 md:hover:bg-transparent'}`}>
            <span className="">Share with me</span>
          </li>
          <li className={`cursor-pointer p-4  w-full text-center ${isActiveRoute('/recent') ? 'bg-blue-900  text-white' : 'hover:bg-gray-100 md:hover:bg-transparent'}`}>
            <span className="">Recent</span>
          </li> */}
          <li className={`cursor-pointer flex items-center justify-center gap-1 text-md  w-full text-center p-4 ${isActiveRoute('/trash') ? 'bg-blue-900 text-white' : 'hover:bg-gray-100 md:hover:bg-transparent'}`} onClick={() => navigate('/trash')}>
           <CiTrash className='text-2xl'/>Trash
          </li>
        </ul>
        <img src={nav} className='h-40 w-40'/>
        {/* Storage Details */}
        <div className="p-4 md:mt-0 w-[90%]">
          <h3 className="text-sm font-medium text-gray-800">Storage Details</h3>
          <div className="w-full bg-gray-200 h-2 rounded mt-2 overflow-hidden">
            <div className="bg-gray-800 h-2 rounded" style={{ width: `${totalStorage ? totalStorage : 0}%` }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{totalStorage || 0} GB of 15 GB used</p>
        </div>
        
        {/* Fo oter */}
        <div className="p-4 flex justify-center items-center">
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
            Refer a Friend
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="bg-gray-900 z-40 fixed bottom-0 w-full border-t md:hidden flex flex-row justify-around py-3 opacity-100">
  <div onClick={() => navigate('/')} className={`p-2 flex items-center rounded-md ${isActiveRoute('/') ? 'text-white bg-gray-500' : 'text-gray-500 hover:bg-gray-100'}`}>
    <span>My Cloud</span>
  </div>
  {/* <div onClick={() => navigate('/share')} className={`p-2 flex items-center rounded-md ${isActiveRoute('/share') ? 'text-white bg-gray-500' : 'text-gray-500 hover:bg-gray-100'}`}>
    <span>Share</span>
  </div>
  <div onClick={() => navigate('/recent')} className={`p-2 flex items-center rounded-md ${isActiveRoute('/recent') ? 'text-white bg-gray-500' : 'text-gray-500 hover:bg-gray-100'}`}>
    <span>Recent</span>
  </div> */}
  <div onClick={() => navigate('/trash')} className={`p-2 flex items-center rounded-md ${isActiveRoute('/trash') ? 'text-white bg-gray-500' : 'text-gray-500 hover:bg-gray-100'}`}>
    <span>Trash</span>
  </div>
</div>

    </>
  );
};
