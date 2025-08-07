'use client'

import { useState } from 'react';
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import MobileSiderbar from "./components/MobileSidebar";

export default function Page() {
  const [isComponentVisible, setIsComponentVisible] = useState(false);

  const toggleComponentVisibility = () => {
    setIsComponentVisible(prev => !prev);
  };

  return (
    <main className="overflow-hidden w-full h-screen relative flex">
      {isComponentVisible && (
        <MobileSiderbar toggleComponentVisibility={toggleComponentVisibility} />
      )}
      
      <div className="dark hidden flex-shrink-0 bg-gray-900 md:flex md:w-[260px] md:flex-col">
        <div className="flex h-full min-h-0 flex-col">
          <Sidebar />
        </div>
      </div>

      <Chat toggleComponentVisibility={toggleComponentVisibility} />
    </main>
  );
}


// // app/page.tsx — client component
// "use client";

// import React, { useState } from "react";
// import ChatUI from "./components/ChatUI";
// import LogInScreen from "./logInScreen/logInScreen";


// export default function Page() {
//   const [loginOpen, setLoginOpen] = useState(true);
  

//   return (
//     <>
//       <ChatUI />

//       <LogInScreen
//         isOpen={loginOpen}
//         onClose={() => setLoginOpen(false)}
//         onLogin={() => {
//           // replace with your real login flow
//           window.location.href = "/auth/login";
//         }}
//         onSignUp={() => {
//           // replace with your signup flow
//           alert("Start signup flow");
//         }}
//         onStayLoggedOut={() => {
//           setLoginOpen(false);
//         }}
//       />
//     </>
//   );
// }
