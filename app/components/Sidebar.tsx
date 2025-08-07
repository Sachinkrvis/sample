'use client';

import React, { useEffect, useState } from "react";
import {
  AiOutlineMessage,
  AiOutlinePlus,
  AiOutlineUser,
  AiOutlineSetting,
} from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";
import { FiMessageSquare } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { useUser } from "@auth0/nextjs-auth0";

const Sidebar: React.FC = () => {
  const { user, isLoading, error } = useUser();
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) {
      setChatHistory(JSON.parse(saved));
    }
  }, []);

  // Clear history
  const clearChatHistory = () => {
    localStorage.removeItem("chatHistory");
    setChatHistory([]);
  };

  return (
    <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
      <nav className="flex h-full flex-1 flex-col space-y-1 p-2">

        {/* New Chat */}
        <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-1 flex-shrink-0 border border-white/20">
          <AiOutlinePlus className="h-4 w-4" />
          New chat
        </a>

        {/* Chat History */}
        <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
          <div className="flex flex-col gap-2 pb-2 text-gray-100 text-sm">
            {chatHistory.length === 0 ? (
              <p className="text-gray-400 px-3">No previous conversations</p>
            ) : (
              chatHistory.map((title, idx) => (
                <a
                  key={idx}
                  className="flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all group"
                >
                  <FiMessageSquare className="h-4 w-4" />
                  <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                    {title}
                    <div className="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]" />
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

        {/* User Profile Section */}
        {user && (
          <div className="flex items-center gap-3 px-3 py-3 text-white bg-gray-800 rounded-md">
            <img
              src={user.picture ?? "/default-avatar.png"}
              alt="User Avatar"
              className="h-8 w-8 rounded-full"
            />
            <div className="text-sm overflow-hidden whitespace-nowrap text-ellipsis">
              <div className="font-semibold">{user.name}</div>
              <div className="text-xs text-gray-400">{user.email}</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <a onClick={clearChatHistory} className="flex py-3 px-3 items-center gap-3 hover:bg-gray-500/10 text-white text-sm cursor-pointer">
          <AiOutlineMessage className="h-4 w-4" />
          Clear conversations
        </a>

        <a className="flex py-3 px-3 items-center gap-3 hover:bg-gray-500/10 text-white text-sm cursor-pointer">
          <AiOutlineUser className="h-4 w-4" />
          My plan
        </a>

        <a className="flex py-3 px-3 items-center gap-3 hover:bg-gray-500/10 text-white text-sm cursor-pointer">
          <AiOutlineSetting className="h-4 w-4" />
          Settings
        </a>

        <a
          href="https://help.openai.com/en/collections/3742473-chatgpt"
          target="_blank"
          rel="noreferrer"
          className="flex py-3 px-3 items-center gap-3 hover:bg-gray-500/10 text-white text-sm cursor-pointer"
        >
          <BiLinkExternal className="h-4 w-4" />
          Get help
        </a>

        <a
          href="/auth/logout"
          className="flex py-3 px-3 items-center gap-3 hover:bg-gray-500/10 text-white text-sm cursor-pointer"
        >
          <MdLogout className="h-4 w-4" />
          Log out
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;

// 'use client';

// import React from "react";
// import {
//   AiOutlineMessage,
//   AiOutlinePlus,
//   AiOutlineUser,
//   AiOutlineSetting,
// } from "react-icons/ai";
// import { BiLinkExternal } from "react-icons/bi";
// import { FiMessageSquare } from "react-icons/fi";
// import { MdLogout } from "react-icons/md";
// import {useUser} from "@auth0/nextjs-auth0"

// const Sidebar: React.FC = () => {
//   const { user, isLoading, error } = useUser();

//   return (
//     <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
//       <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
//         <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-1 flex-shrink-0 border border-white/20">
//           <AiOutlinePlus className="h-4 w-4" />
//           New chat
//         </a>

//         <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
//           <div className="flex flex-col gap-2 pb-2 text-gray-100 text-sm">
//             <a className="flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all group">
//               <FiMessageSquare className="h-4 w-4" />
//               <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
//                 New conversation
//                 <div className="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]" />
//               </div>
//             </a>
//           </div>
//         </div>

//         {/* 👇 User Profile Section 👇 */}
//         {user && (
//           <div className="flex items-center gap-3 px-3 py-3 text-white bg-gray-800 rounded-md">
//             <img
//               src={user.picture ?? "/default-avatar.png"}
//               alt="User Avatar"
//               className="h-8 w-8 rounded-full"
//             />
//             <div className="text-sm overflow-hidden whitespace-nowrap text-ellipsis">
//               <div className="font-semibold">{user.name}</div>
//               <div className="text-xs text-gray-400">{user.email}</div>
//             </div>
//           </div>
//         )}

//         <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
//           <AiOutlineMessage className="h-4 w-4" />
//           Clear conversations
//         </a>

//         <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
//           <AiOutlineUser className="h-4 w-4" />
//           My plan
//         </a>
//         <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
//           <AiOutlineSetting className="h-4 w-4" />
//           Settings
//         </a>

//         <a
//           href="https://help.openai.com/en/collections/3742473-chatgpt"
//           target="_blank"
//           rel="noreferrer"
//           className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
//         >
//           <BiLinkExternal className="h-4 w-4" />
//           Get help
//         </a>

//         <a
//           href="/auth/logout"
//           className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
//         >
//           <MdLogout className="h-4 w-4" />
//           Log out
//         </a>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;
