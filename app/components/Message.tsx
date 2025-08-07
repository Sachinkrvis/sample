// components/Message.tsx
import { SiOpenai } from "react-icons/si";
import { HiUser } from "react-icons/hi";
import { TbCursorText } from "react-icons/tb";

type MessageType = {
  role: "user" | "system";
  content: string | null;
};

const Message: React.FC<{ message: MessageType }> = ({ message }) => {
  const { role, content } = message;
  const isUser = role === "user";

  return (
    <div className={`group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 ${isUser ? "dark:bg-gray-800" : "bg-gray-50 dark:bg-[#444654]"}`}>
      <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl flex lg:px-0 m-auto w-full">
        <div className="flex flex-row gap-4 p-4 md:py-6 m-auto w-full">
          <div className="w-8 flex flex-col relative items-end">
            <div className="relative h-7 w-7 p-1 rounded-sm text-white flex items-center justify-center bg-black/75">
              {isUser ? <HiUser className="h-4 w-4 text-white" /> : <SiOpenai className="h-4 w-4 text-white" />}
            </div>
            <div className="text-xs absolute left-0 top-2 -ml-4 -translate-x-full invisible group-hover:visible">
              <span className="text-gray-300 dark:text-gray-400">1 / 1</span>
            </div>
          </div>

          <div className="relative flex flex-1 flex-col gap-1">
            <div className="min-h-20 flex flex-col items-start gap-4 whitespace-pre-wrap break-words">
              <div className="markdown prose w-full break-words dark:prose-invert">
                {content === null && !isUser ? <TbCursorText className="h-6 w-6 animate-pulse" /> : <p>{content}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
