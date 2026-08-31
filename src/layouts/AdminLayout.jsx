import { Outlet } from "react-router-dom"
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { useState } from "react";

export const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="flex h-dvh gap-2 overflow-hidden p-2">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      
      <main className="flex flex-1 flex-col min-h-0 overflow-y-auto custom-scrollbar">
        <Navbar setIsOpen={setIsOpen} />

        <div className="mx-auto w-full max-w-screen-2xl px-4 pb-6 md:px-6 mt-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
