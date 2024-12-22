import React, { useEffect, useState } from 'react';
import cloud from '../../assets/cloud.jpg';
import CreateFolderForm from '../Presenter/AddForm';
import api from "../../services/api";
import { useNavigate, useLocation } from 'react-router-dom';
import nav from '../../assets/nav-ico.png';
import { CiTrash } from "react-icons/ci";
import { BsFillGrid1X2Fill } from "react-icons/bs";
import { HiMenuAlt3, HiX } from "react-icons/hi";

export const Navigator = ({ showForm, setShowForm, showCreate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [totalStorage, setTotalStorage] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getSize = (sizeInBytes)=> {
    return (sizeInBytes / (1024 * 1024 *1024)).toFixed(2); 
  }

  const getInfo = async () => {
    try {
      const x = await api.get("/api/folder/get", {});
      setTotalStorage(getSize(x?.data?.total));
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
      
      {/* Desktop Navigation */}
      <div className="fixed hidden items-center w-full h-full bg-white md:h-screen md:w-64 md:justify-between md:visible md:flex md:flex-col border-r md:border-b border-gray-200 transition-all duration-200 ease-in-out">
        {/* Logo */}
        <div className="p-4 flex items-center justify-center md:justify-start">
          <span className="font-bold text-xl text-gray-800 flex items-center">
            <img src={cloud} alt="Cloud" className="h-12 w-12 mr-2" />
            File Cloud<span className="text-red-500">.</span>
          </span>
        </div>

        {/* Create New Button */}
        <div className={`p-4 w-48 flex-row ${showCreate ? 'bg-black' : 'bg-gray-400 cursor-not-allowed'} items-center rounded-xl`}>
          <button className="flex items-center w-full justify-center">
            <span className={`text-white font-medium ${showCreate ? '' : 'cursor-not-allowed'}`} disabled={!showCreate} onClick={() => setShowForm(!showForm)}>+ Create New</span>
          </button>
        </div>

        {/* Navigation Links */}
        <ul className="flex flex-row md:flex-col md:gap-6 md:justify-center w-full h-auto items-center">
          <li className={`cursor-pointer flex items-center justify-center gap-1 text-md w-full text-center p-4 ${isActiveRoute('/') ? 'bg-blue-900 text-white' : 'hover:bg-gray-100 md:hover:bg-transparent'}`} onClick={() => navigate('/')}>
            <BsFillGrid1X2Fill /> My Cloud
          </li>
          <li className={`cursor-pointer flex items-center justify-center gap-1 text-md w-full text-center p-4 ${isActiveRoute('/trash') ? 'bg-blue-900 text-white' : 'hover:bg-gray-100 md:hover:bg-transparent'}`} onClick={() => navigate('/trash')}>
            <CiTrash className='text-2xl' /> Trash
          </li>
        </ul>
        <img src={nav} className='h-40 w-40' />
        
        {/* Storage Details */}
        <div className="p-4 md:mt-0 w-[90%]">
          <h3 className="text-sm font-medium text-gray-800">Storage Details</h3>
          <div className="w-full bg-gray-200 h-2 rounded mt-2 overflow-hidden">
            <div className="bg-gray-800 h-2 rounded" style={{ width: `${totalStorage ? totalStorage : 0}%` }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{totalStorage || 0} GB of 15 GB used</p>
        </div>
        
        {/* Footer */}
        <div className="p-4 flex justify-center items-center">
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
            Refer a Friend
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden fixed w-full">
        {/* Hamburger Icon */}
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
          <span className="font-bold text-xl">File Cloud<span className="text-red-500">.</span></span>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <HiX size={30} /> : <HiMenuAlt3 size={30} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="bg-gray-900 text-white p-4 space-y-4">
            <li
              className={`cursor-pointer p-2 ${
                isActiveRoute("/") ? "bg-blue-900 text-white" : "hover:bg-gray-700"
              }`}
              onClick={() => {
                navigate("/");
                setIsMobileMenuOpen(false);
              }}
            >
              My Cloud
            </li>
            <li
              className={`cursor-pointer p-2 ${
                isActiveRoute("/trash") ? "bg-blue-900 text-white" : "hover:bg-gray-700"
              }`}
              onClick={() => {
                navigate("/trash");
                setIsMobileMenuOpen(false);
              }}
            >
              Trash
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
