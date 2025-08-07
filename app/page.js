'use client';

import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";
import LogInScreen from "./logInScreen/logInScreen";

export default function Page() {
  const { user, isLoading } = useUser();
  const [isComponentVisible, setIsComponentVisible] = useState(false);

  const toggleComponentVisibility = () => {
    setIsComponentVisible(prev => !prev);
  };

  if (isLoading) {
    // Show loading while Auth0 is initializing
    return (
      <main className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </main>
    );
  }

  if (!user) {
    // If not logged in, show LogInScreen
    return (
      <LogInScreen
        isOpen={true}
        onLogin={() => (window.location.href = "/auth/login")}
        onSignUp={() => (window.location.href = "/auth/login?screen_hint=signup")}
        onStayLoggedOut={() => {}}
      />
    );
  }

  // If logged in, render the app UI
  return (
    <main className="overflow-hidden w-full h-screen relative flex">
      {isComponentVisible && (
        <MobileSidebar toggleComponentVisibility={toggleComponentVisibility} />
      )}
      <div className="dark hidden flex-shrink-0 bg-gray-900 md:flex md:w-[260px] md:flex-col">
        <Sidebar />
      </div>
      <Chat toggleComponentVisibility={toggleComponentVisibility} />
    </main>
  );
}
