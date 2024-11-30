import React, { useState } from "react";
import { Navigator } from "../Navigation";
import Presenter from "../Presenter";

export const Main = () => {
  const [showForm, setShowForm] = useState(false);
  const [totalStorage,setTotalStorage] = useState(0)
 
  return (
    <>
      <div className="relative flex md:flex-row h-screen w-full flex-col">
        <Navigator showForm={showForm} setShowForm={setShowForm} totalStorage={totalStorage} />
        <Presenter showForm={showForm} setTotalStorage={setTotalStorage}/>
      </div>
    </>
  );
};
