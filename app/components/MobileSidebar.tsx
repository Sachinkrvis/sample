// components/MobileSidebar.tsx
import React from "react";
import { IoMdClose } from "react-icons/io";
import Sidebar from "./Sidebar";

const MobileSidebar: React.FC<{ toggleComponentVisibility: () => void }> = ({ toggleComponentVisibility }) => {
  return (
    <div id="mobile-sidebar-portal">
      <div className="fixed inset-0 z-40 flex">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-900">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex h-10 w-10 items-center justify-center"
              onClick={toggleComponentVisibility}
            >
              <span className="sr-only">Close sidebar</span>
              <IoMdClose className="h-6 w-6 text-white" />
            </button>
          </div>
          <Sidebar />
        </div>
        <div className="w-14 flex-shrink-0" />
      </div>
    </div>
  );
};

export default MobileSidebar;
