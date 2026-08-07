import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  ArrowLeft,
  Bot,
  User,
} from "lucide-react";


interface AIChatProps {
  onBack?: () => void;
}


interface Message {
  role: "user" | "ai";
  text: string;
}

export default function AIChat({ onBack }: AIChatProps) {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text:
        "Namaste Tanmoy 👋 I am JS AI Assistant. How can I help you today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: message,
      },
    ]);

    setMessage("");
  };
return (
  <div
    className="
      relative
      h-dvh
      overflow-hidden
      flex
      flex-col
      bg-gradient-to-br
      from-orange-200
      via-white
      to-green-200
      text-gray-900
    "
  >

    {/* ================= ANIMATED AURORA ================= */}

    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      <div className="aurora aurora-orange"></div>

      <div className="aurora aurora-green"></div>

      <div className="aurora aurora-blue"></div>

    </div>

    {/* ================= CONTENT ================= */}

    <div className="relative z-10 flex flex-col h-full">

      {/* ================= HEADER ================= */}

      <div
        className="
        shrink-0
        flex
        items-center
        gap-3
        px-5
        py-4
        bg-white/70
        backdrop-blur-xl
        border-b
        border-orange-200
        shadow-sm
        "
      >

        <button
  onClick={onBack}
  className="
  w-10
  h-10
  rounded-full
  hover:bg-blue-100
  transition
  flex
  items-center
  justify-center
  "
>
          <ArrowLeft
            size={22}
            className="text-blue-700"
          />
        </button>

        <div className="flex items-center gap-3">

          <div
            className="
            w-11
            h-11
            rounded-full
            bg-gradient-to-br
            from-orange-500
            via-white
            to-green-500
            flex
            items-center
            justify-center
            shadow-lg
            "
          >
            <Bot
              size={22}
              className="text-blue-700"
            />
          </div>

          <div>

            <h1
              className="
              text-lg
              font-bold
              text-blue-800
              "
            >
              JS AI Assistant 🇮🇳
            </h1>

            <p
              className="
              text-xs
              text-gray-600
              "
            >
              Powered by JS AI Hub
            </p>

          </div>

        </div>

      </div>

      {/* ================= CHAT AREA ================= */}

      <div
        className="
        flex-1
        overflow-y-auto
        px-4
        py-6
        pb-40
        space-y-5
        "
      >

        {messages.map((msg, index) => (

          <div
            key={index}
            className={
              msg.role === "user"
                ? "flex justify-end"
                : "flex justify-start"
            }
          >

            <div
              className={
                msg.role === "user"
                  ? `
                    max-w-[80%]
                    rounded-3xl
                    rounded-br-lg
                    px-5
                    py-3
                    bg-gradient-to-r
                    from-orange-500
                    to-orange-400
                    text-white
                    shadow-xl
                    flex
                    gap-3
                    items-start
                  `
                  : `
                    max-w-[80%]
                    rounded-3xl
                    rounded-bl-lg
                    px-5
                    py-3
                    bg-gradient-to-r
                    from-green-500
                    to-green-400
                    text-white
                    shadow-xl
                    flex
                    gap-3
                    items-start
                  `
              }
            >

              {msg.role === "ai" ? (
                <Bot
                  size={20}
                  className="mt-1 shrink-0"
                />
              ) : (
                <User
                  size={20}
                  className="mt-1 shrink-0"
                />
              )}

              <span
                className="
                whitespace-pre-wrap
                break-words
                leading-7
                "
              >
                {msg.text}
              </span>

            </div>

          </div>

        ))}

        <div ref={messagesEndRef} />

      </div>
            {/* ================= FIXED INPUT AREA ================= */}

      <div
       className="
sticky
bottom-0
z-50
shrink-0
bg-white/80
backdrop-blur-xl
border-t
border-green-200
px-4
py-4
pb-[max(env(safe-area-inset-bottom),16px)]
"
      >

        <div
          className="
          max-w-5xl
          mx-auto
          flex
          items-end
          gap-3
          "
        >

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            rows={1}
            placeholder="Ask anything..."
            className="
            flex-1
            resize-none
            rounded-3xl
            px-5
            py-4
            bg-white
            border
            border-blue-200
            outline-none
            focus:ring-2
            focus:ring-blue-500
            shadow-md
            text-gray-800
            placeholder:text-gray-400
            max-h-40
            overflow-y-auto
            "
          />

          <button
            onClick={sendMessage}
            className="
            w-14
            h-14
            rounded-full
            bg-blue-700
            hover:bg-blue-800
            text-white
            flex
            items-center
            justify-center
            shadow-xl
            transition-all
            duration-200
            hover:scale-105
            active:scale-95
            "
          >
            <Send size={22} />
          </button>

        </div>

      </div>

      </div>

</div>
  );
}