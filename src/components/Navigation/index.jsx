import React, { useState } from 'react';
import cloud from '../../assets/cloud.jpg'
import CreateFolderForm from '../Presenter/AddForm';

export const Navigator = ({showForm,setShowForm,totalStorage}) => {

  return (
    <div className="fixed hidden items-center w-full h-full bg-white md:h-screen md:w-64 md:justify-between md:visible md:flex  md:flex-col border-r md:border-b border-gray-200 transition-all duration-200 ease-in-out">
        {showForm && <CreateFolderForm showForm={showForm} setShowForm={setShowForm}/>}
      {/* Logo */}
      <div className="p-4 flex items-center justify-center md:justify-start">
        <span className="font-bold text-xl text-gray-800 flex items-center">
          <img src={cloud} alt="Cloud" className="h-12 w-12 mr-2" />
          File Cloud<span className="text-red-500">.</span>
        </span>
      </div>


        <div className="p-4 flex-row bg-black items-center rounded-xl">
          <button className="flex items-center w-full">
            <span className="text-white font-medium" onClick={()=> setShowForm(!showForm)}>+ Create New</span>
          </button>
        </div>


      {/* Navigation Links */}
      <ul className="flex flex-row md:flex-col md:gap-6 md:justify-center bg-slate-200 w-full h-auto  ">
        <li className="p-4 hover:bg-gray-100 md:hover:bg-transparent">
          <a href="#" className="flex items-center">
            <span className="text-gray-800 font-medium">My Cloud</span>
          </a>
        </li>
        <li className="p-4 hover:bg-gray-100 md:hover:bg-transparent">
          <a href="#" className="flex items-center">
            <span className="text-gray-500">Share with me</span>
          </a>
        </li>
        <li className="p-4 hover:bg-gray-100 md:hover:bg-transparent">
          <a href="#" className="flex items-center">
            <span className="text-gray-500">Recent</span>
          </a>
        </li>
        <li className="p-4 hover:bg-gray-100 md:hover:bg-transparent">
          <a href="#" className="flex items-center">
            <span className="text-gray-500">Trash</span>
          </a>
        </li>
      </ul>

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
  );
};
