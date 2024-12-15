import React, { useState } from "react";
import { Navigator } from "../Navigation";
import Presenter from "../Presenter";

export const Main = () => {
  const [showForm, setShowForm] = useState(false);
  const [messages,setMessages ] = useState(null)
  
 
  return (
    <>
      <div className="relative flex md:flex-row h-screen w-full flex-col">
        <Navigator showForm={showForm} setShowForm={setShowForm} showCreate={true}  />
        <Presenter messages={messages} setMessages={setMessages} showForm={showForm} setShowForm={setShowForm} />
      </div>
    </>
  );
};
