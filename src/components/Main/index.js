import React, { useState } from "react";
import { Navigator } from "../Navigation";
import Presenter from "../Presenter";

export const Main = () => {
  const [showForm, setShowForm] = useState(false);
  const [totalStorage,setTotalStorage] = useState(0);
  const [messages,setMessages ] = useState(null)
 
  return (
    <>
      <div className="relative flex md:flex-row h-screen w-full flex-col">
        <Navigator showForm={showForm} setShowForm={setShowForm} totalStorage={totalStorage} />
        <Presenter messages={messages} setMessages={setMessages} showForm={showForm} setShowForm={setShowForm} setTotalStorage={setTotalStorage}/>
      </div>
    </>
  );
};
