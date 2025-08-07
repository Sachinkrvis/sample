// components/Chat.tsx
import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { BsChevronDown, BsPlusLg } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import useAnalytics from "../hooks/useAnalytics";
import useAutoResizeTextArea from "../hooks/useAutoResizeTextArea";
import Message from "./Message";
import { DEFAULT_OPENAI_MODEL } from "../shared/Constants";

const Chat: React.FC<{ toggleComponentVisibility?: () => void }> = ({ toggleComponentVisibility }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEmptyChat, setShowEmptyChat] = useState(true);
  const [conversation, setConversation] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const { trackEvent } = useAnalytics();
  const textAreaRef = useAutoResizeTextArea();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);

  const selectedModel = DEFAULT_OPENAI_MODEL;

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "24px";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [message, textAreaRef]);

  useEffect(() => {
    if (bottomOfChatRef.current) {
      bottomOfChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  const sendMessage = (e?: any) => {
    e?.preventDefault();
    if (message.trim().length < 1) {
      setErrorMessage("Please enter a message.");
      return;
    } else {
      setErrorMessage("");
    }

    trackEvent("send.message", { message: message });
    setIsLoading(true);

    // Add to conversation locally (no backend)
    setConversation((prev) => [
      ...prev,
      { content: message, role: "user" },
      { content: "This is a fake AI reply (UI-only). Replace with real API.", role: "system" },
    ]);

    setMessage("");
    setShowEmptyChat(false);
    setIsLoading(false);
  };

  const handleKeypress = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage(e);
      e.preventDefault();
    }
  };

  return (
    <div className="flex max-w-full flex-1 flex-col">
      {/* top header (mobile) */}
      <div className="sticky top-0 z-10 flex items-center border-b border-white/20 bg-gray-800 pl-1 pt-1 text-gray-200 sm:pl-3 md:hidden">
        <button type="button" onClick={toggleComponentVisibility} className="p-2">
          <RxHamburgerMenu className="h-6 w-6 text-white" />
        </button>
        <h1 className="flex-1 text-center text-base font-normal">New chat</h1>
        <button type="button" className="px-3">
          <BsPlusLg className="h-6 w-6" />
        </button>
      </div>

      <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <div className="flex-1 overflow-hidden">
          <div className="h-full dark:bg-gray-800">
            <div className="h-full overflow-y-auto">
              {!showEmptyChat && conversation.length > 0 ? (
                <div className="flex flex-col items-center text-sm bg-gray-800">
                  <div className="flex w-full items-center justify-center gap-1 border-b border-black/10 bg-gray-50 p-3 text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                    Model: {selectedModel.name}
                  </div>

                  {conversation.map((message, index) => (
                    <Message key={index} message={message} />
                  ))}

                  <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
                  <div ref={bottomOfChatRef} />
                </div>
              ) : (
                <div className="py-10 relative w-full flex flex-col h-full">
                  <div className="flex items-center justify-center gap-2">
                    <div className="relative w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                      <button
                        className="relative flex w-full cursor-default flex-col rounded-md border border-black/10 bg-white py-2 pl-3 pr-10 text-left text-sm"
                        type="button"
                      >
                        <label className="block text-xs text-gray-700 text-center">Model</label>
                        <span className="inline-flex w-full truncate">
                          <span className="flex h-6 items-center gap-1 truncate text-black">{selectedModel.name}</span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <BsChevronDown className="h-4 w-4 text-gray-400" />
                        </span>
                      </button>
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-semibold text-center text-gray-200 flex gap-2 items-center justify-center h-screen">
                    Chat UI (UI-only)
                  </h1>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full border-t dark:border-white/20 bg-white dark:bg-gray-800 pt-2">
          <form className="mx-2 flex flex-row gap-3 md:mx-4 lg:mx-auto lg:max-w-2xl xl:max-w-3xl" onSubmit={sendMessage}>
            <div className="relative flex flex-col h-full flex-1 items-stretch md:flex-col">
              {errorMessage && <div className="mb-2"><span className="text-red-500 text-sm">{errorMessage}</span></div>}
              <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:bg-gray-700 rounded-md">
                <textarea
                  ref={textAreaRef}
                  value={message}
                  style={{ height: "24px", maxHeight: "200px", overflowY: "hidden" }}
                  placeholder="Send a message..."
                  className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0"
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeypress}
                />
                <button disabled={isLoading || message.trim().length === 0} type="submit" className="absolute p-1 rounded-md bottom-1.5 right-1">
                  <FiSend className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </form>

          <div className="px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6">
            <span>Chat UI (no backend) — replace the fake reply with an actual API call later.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
