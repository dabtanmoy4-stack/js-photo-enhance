import React, { useState } from "react";
import { Send, ArrowLeft, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "ai";
  text: string;
}

export default function AIChat() {

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Namaste Tanmoy 👋 I am JS AI Assistant. How can I help you today?"
    }
  ]);


  const sendMessage = () => {

    if (!message.trim()) return;


    setMessages([
      ...messages,
      {
        role: "user",
        text: message
      }
    ]);

    setMessage("");

  };


  return (

    <div
      className="
      min-h-screen
      flex
      flex-col
      bg-gradient-to-br
      from-orange-200
      via-white
      to-green-200
      text-gray-900
      "
    >


      {/* Header */}

      <div
        className="
        flex
        items-center
        gap-3
        p-4
        bg-white/70
        backdrop-blur-xl
        border-b
        border-orange-200
        "
      >

        <ArrowLeft
          size={24}
          className="text-blue-700"
        />

        <div className="flex items-center gap-2">

          <div
            className="
            w-10
            h-10
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


          <h1
            className="
            text-xl
            font-bold
            text-blue-800
            "
          >
            JS AI Assistant 🇮🇳
          </h1>


        </div>

      </div>



      {/* Chat Area */}

      <div
        className="
        flex-1
        overflow-y-auto
        p-5
        space-y-5
        "
      >

        {
          messages.map((msg,index)=>(


            <div
              key={index}
              className={
                msg.role==="user"
                ?
                "flex justify-end"
                :
                "flex justify-start"
              }
            >


              <div
                className={
                  msg.role==="user"
                  ?
                  `
                  max-w-[75%]
                  rounded-3xl
                  px-5
                  py-3
                  bg-gradient-to-r
                  from-orange-500
                  to-orange-400
                  text-white
                  shadow-lg
                  flex
                  gap-2
                  items-start
                  `
                  :
                  `
                  max-w-[75%]
                  rounded-3xl
                  px-5
                  py-3
                  bg-gradient-to-r
                  from-green-500
                  to-green-400
                  text-white
                  shadow-lg
                  flex
                  gap-2
                  items-start
                  `
                }

              >

                {
                  msg.role==="ai"
                  ?
                  <Bot size={20}/>
                  :
                  <User size={20}/>
                }


                <span>
                  {msg.text}
                </span>


              </div>


            </div>


          ))
        }


      </div>




      {/* Input Area */}


      <div
        className="
        p-4
        bg-white/70
        backdrop-blur-xl
        border-t
        border-green-200
        flex
        gap-3
        "
      >


        <input

          value={message}

          onChange={(e)=>setMessage(e.target.value)}

          placeholder="Ask anything..."

          className="
          flex-1
          rounded-2xl
          px-5
          py-3
          bg-white
          border
          border-blue-200
          outline-none
          focus:ring-2
          focus:ring-blue-500
          "

        />



        <button

          onClick={sendMessage}

          className="
          w-12
          h-12
          rounded-full
          bg-blue-700
          text-white
          flex
          items-center
          justify-center
          shadow-lg
          hover:scale-105
          transition
          "

        >

          <Send size={22}/>

        </button>


      </div>



    </div>

  );

}
