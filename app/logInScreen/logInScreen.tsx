// components/logInScreen.tsx
import React, { useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  onLogin?: () => void;
  onSignUp?: () => void;
  onStayLoggedOut?: () => void;
};

export default function LogInScreen({
  isOpen,
  onClose = () => {},
  onLogin = () => {},
  onSignUp = () => {},
  onStayLoggedOut = () => {},
}: Props) {
  // close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative z-10 w-[min(96%,480px)] rounded-2xl bg-white p-6 shadow-xl">
        {/* close button */}
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md px-2 py-1 text-sm hover:bg-gray-100"
        >
          ✕
        </button>

        <div className="flex flex-col gap-4">
          {/* header */}
          <div className="flex items-start gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Welcome back</h2>
              <p className="mt-2 text-sm text-gray-600">
                Log in or sign up to get smarter responses, upload files and
                images, and more.
              </p>
            </div>
          </div>

          {/* actions */}
          <div className="mt-3 flex flex-col gap-3">
            <button
              onClick={onLogin}
              className="w-full rounded-lg bg-sky-600 px-4 py-3 text-center text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              Log in
            </button>

            <button
              onClick={onSignUp}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium hover:bg-gray-50 focus:outline-none"
            >
              Sign up — it's free
            </button>

            <button
              onClick={onStayLoggedOut}
              className="mt-1 text-center text-sm text-gray-500 hover:underline"
            >
              Stay logged out
            </button>
          </div>

          {/* small note (optional) */}
          <div className="pt-2 text-xs text-gray-400">
            By continuing you agree to the terms and privacy policy.
          </div>
        </div>
      </div>
    </div>
  );
}
