import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import trash from '../../../assets/trash-ico.png'
export const Trash = () => {
    const [trashed, setTrashed] = useState([]);

    const getMyTrashRepo = async () => {
        try {
            const result = await api.get('/api/folder/trash/getFolders');
            setTrashed(result.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getMyTrashRepo();
    }, []);



    return (
        <div className="md:ml-60 flex-grow bg-gray-50 p-8 transition-all duration-200 ease-in-out">
           <div className="flex items-center gap-2">
          
            <img src={trash} className="w-16 h-16" />
               <h3 className="text-2xl font-bold mb-6">Trash</h3></div>
        </div>
    );
};
