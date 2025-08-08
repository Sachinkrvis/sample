"use client";

import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { BsPlusLg } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import useAnalytics from "../hooks/useAnalytics";
import useAutoResizeTextArea from "../hooks/useAutoResizeTextArea";
import Message from "./Message";
import { DEFAULT_OPENAI_MODEL, OPENAI_MODELS } from "../shared/Constants";
import { supabase } from "../lib/supabaseClient";

const Chat: React.FC<{ toggleComponentVisibility?: () => void }> = ({ toggleComponentVisibility }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEmptyChat, setShowEmptyChat] = useState(true);
  const [conversation, setConversation] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const { trackEvent } = useAnalytics();
  const textAreaRef = useAutoResizeTextArea();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_OPENAI_MODEL);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_IMAGE_SIZE_MB = 5;
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setErrorMessage("Image too large. Max 5MB allowed.");
      return;
    }

    setErrorMessage("");
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Full = reader.result?.toString(); // includes the prefix
      if (base64Full) {
        setBase64Image(base64Full);
        setImageMimeType(file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const getGeminiResponse = async (
    userMessage: string,
    base64Image: string | null,
    imageMimeType: string | null
  ) => {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage,
        base64Image: base64Image ? base64Image.split(",")[1] : null,
        imageMimeType: imageMimeType || "image/png",
      }),
    });

    const data = await res.json();
    return data.reply || "Sorry, I couldn't generate a response.";
  };

  const sendMessage = async (e?: any) => {
    e?.preventDefault();
    if (message.trim().length < 1) {
      setErrorMessage("Please enter a message.");
      return;
    } else {
      setErrorMessage("");
    }

    trackEvent("send.message", { message });
    setIsLoading(true);

    const userMsg = { content: message, role: "user" as const };
    const thinkingMsg = { content: null, role: "system" as const };

    setConversation((prev) => [...prev, userMsg, thinkingMsg]);
    setMessage("");
    setBase64Image(null);
    setShowEmptyChat(false);

    try {
      const aiReply = await getGeminiResponse(message, base64Image, imageMimeType);
      console.log("message:", message);
      console.log("AI Reply:", aiReply);

      // Save prompt-response to Supabase
      const { error } = await supabase.from("chat_history").insert([
        {
          prompt: message,
          response: aiReply,
        },
      ]).select();
      if (error) {
        console.error("Error saving to Supabase:", error.message);
      }

      setConversation((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { content: aiReply, role: "system" };
        return updated;
      });
    } catch (err) {
      console.error("AI reply error:", err);
      setConversation((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          content: "Failed to get response from Gemini API.",
          role: "system",
        };
        return updated;
      });
    }

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
      {/* Top Header */}
      <div className="sticky top-0 z-10 flex items-center border-b border-white/20 bg-gray-800 pl-1 pt-1 text-gray-200 sm:pl-3 md:hidden">
        <button type="button" onClick={toggleComponentVisibility} className="p-2">
          <RxHamburgerMenu className="h-6 w-6 text-white" />
        </button>
        <h1 className="flex-1 text-center text-base font-normal">New chat</h1>
        <button type="button" className="px-3">
          <BsPlusLg className="h-6 w-6" />
        </button>
      </div>

      {/* Model Selector */}
      <div className="flex w-full items-center justify-center gap-2 border-b border-black/10 bg-gray-50 p-3 text-gray-500 dark:bg-gray-700 dark:text-gray-300">
        <label htmlFor="modelSelect" className="text-sm font-medium">Model:</label>
        <select
          id="modelSelect"
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm rounded-md px-2 py-1 text-black dark:text-white"
          value={selectedModel.id}
          onChange={(e) => {
            const newModel = OPENAI_MODELS.find(model => model.id === e.target.value);
            if (newModel) setSelectedModel(newModel);
          }}
        >
          {OPENAI_MODELS.map((model) => (
            <option key={model.id} value={model.id} disabled={!model.available}>
              {model.name} {model.available ? "" : "(Unavailable)"}
            </option>
          ))}
        </select>
      </div>

      <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <div className="flex-1 overflow-hidden">
          <div className="h-full dark:bg-gray-800">
            <div className="h-full overflow-y-auto">
              {!showEmptyChat && conversation.length > 0 ? (
                <div className="flex flex-col items-center text-sm bg-gray-800">
                  {conversation.map((message, index) => (
                    <Message key={index} message={message} />
                  ))}
                  <div className="w-full h-32 md:h-48 flex-shrink-0" />
                  <div ref={bottomOfChatRef} />
                </div>
              ) : (
                <div className="py-10 relative w-full flex flex-col h-full">
                  <h1 className="text-2xl sm:text-4xl font-semibold text-center text-gray-200 flex gap-2 items-center justify-center h-screen">
                    ChatGPT-Clone
                  </h1>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Input Form */}
<div className="absolute bottom-0 left-0 w-full border-t dark:border-white/20 bg-white dark:bg-gray-800 pt-2">
  <form
    className="mx-2 flex flex-row gap-3 md:mx-4 lg:mx-auto lg:max-w-2xl xl:max-w-3xl items-end"
    onSubmit={sendMessage}
  >
    {/* ➕ Button for image upload */}
    <div className="flex items-end mb-2">
      <label
        htmlFor="imageUpload"
        className="cursor-pointer p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        title="Upload image"
      >
        <BsPlusLg className="text-xl text-gray-600 dark:text-gray-300" />
      </label>
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>

    {/* Text Input */}
    <div className="relative flex flex-col h-full flex-1 items-stretch">
      {errorMessage && (
        <div className="mb-2">
          <span className="text-red-500 text-sm">{errorMessage}</span>
        </div>
      )}
      <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:bg-gray-700 rounded-md">
        <textarea
          ref={textAreaRef}
          value={message}
          style={{ height: "24px", maxHeight: "200px", overflowY: "hidden" }}
          placeholder="Send a message..."
          className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-10 focus:ring-0 text-gray-800 dark:text-white"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeypress}
        />

        {/* Send Button */}
        <button
          disabled={isLoading || message.trim().length === 0}
          type="submit"
          title="Send message"
          className={`absolute p-2 rounded-md bottom-2 right-2 transition ${isLoading || message.trim().length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
        >
          <FiSend className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  </form>

  {/* Image Preview Section */}
  {base64Image && (
    <div className="mx-4 mt-2 mb-3 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-600 dark:text-gray-300">Selected image:</span>
        <button
          onClick={() => setBase64Image(null)}
          className="text-xs text-red-500 hover:underline"
        >
          Remove
        </button>
      </div>
      {!base64Image ? (
  <p className="text-sm text-gray-500">Loading image preview...</p>
) : (
  <img
    src={base64Image}
    alt="Selected"
    className="w-24 h-24 object-contain border rounded-md"
  />
)}

    </div>
  )}

  <div className="px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6">
    <span>ChatGPT Clone can generate inaccurate information</span>
  </div>
</div>

      </div>
    </div>
  );
};

export default Chat;
