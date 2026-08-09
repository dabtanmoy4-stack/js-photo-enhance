import React, { useEffect, useRef, useState } from "react";

import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth, db } from "../firebase";

import {
  ArrowLeft,
  Bot,
  User,
  Send,
  MoreVertical,
  MessageSquarePlus,
  History,
  Settings,
  UserCircle,
  LogOut,
  UserPlus,
  Moon,
  Sun,
  X,
  ChevronRight,
  Check,
  ShieldCheck,
} from "lucide-react";

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

interface AIChatProps {
  onBack?: () => void;
}

interface Message {
  role: "user" | "ai";
  text: string;
}

interface UserAccount {
  uid: string;
  name: string;
  email: string;
  photo?: string;
}

interface RecentChat {
  id: string;
  title: string;
  preview: string;
}

export default function AIChat({ onBack }: AIChatProps) {
  /* =========================================================
     USER / AUTH
  ========================================================= */

  const [user, setUser] = useState<UserAccount | null>(null);

  const [isSigningIn, setIsSigningIn] = useState(false);


  const loadRecentChats = async (uid: string) => {
  try {
    const chatsRef = collection(
      db,
      "users",
      uid,
      "recentChats"
    );

    const chatsQuery = query(
      chatsRef,
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const snapshot = await getDocs(chatsQuery);

    const chats: RecentChat[] = snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        title: doc.data().title || "New Chat",
        preview: doc.data().preview || "",
      })
    );

    setRecentChats(chats);

  } catch (error) {
    console.error(
      "Failed to load recent chats:",
      error
    );

    setRecentChats([]);
  }
};


 /* =========================================================
   CHAT
========================================================= */

const [message, setMessage] = useState("");

const [isTyping, setIsTyping] = useState(false);

const [messages, setMessages] = useState<Message[]>([]);

const [activeChatId, setActiveChatId] =
  useState<string | null>(null);

const messagesEndRef =
  useRef<HTMLDivElement | null>(null);


/* =========================================================
   UI
========================================================= */

  const [menuOpen, setMenuOpen] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const [accountOpen, setAccountOpen] = useState(false);

  const [recentOpen, setRecentOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
/* =========================================================
   RECENT CHATS
========================================================= */

const [recentChats, setRecentChats] =
  useState<RecentChat[]>([]);

/* =========================================================
AUTO SCROLL
========================================================= */

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages, isTyping]);

/* =========================================================
   LOAD SAVED ACCOUNT
========================================================= */

useEffect(() => {
  const loadSavedAccount = async () => {
    try {
      const savedUser =
        localStorage.getItem("js-ai-user");

      if (!savedUser) return;

      const parsedUser =
        JSON.parse(savedUser);

      setUser(parsedUser);

      setMessages([
        {
          role: "ai",
          text: `Namaste ${parsedUser.name} 👋 I am JS AI Assistant. How can I help you today?`,
        },
      ]);

      // Load this account's recent chats
      if (parsedUser.uid) {
        await loadRecentChats(
          parsedUser.uid
        );
      }

    } catch (error) {
      console.error(
        "Failed to load saved account:",
        error
      );
    }
  };

  loadSavedAccount();
}, []);


/* =========================================================
SAVE USER TO FIRESTORE
========================================================= */

const saveUserToFirestore = async (
  googleUser: UserAccount,
  uid: string
) => {
  try {
    if (!googleUser.email) return;

   const userRef = doc(
  db,
  "users",
  uid
);

    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      // New user
      await setDoc(userRef, {
        name: googleUser.name,
        email: googleUser.email.toLowerCase(),
        photo: googleUser.photo || null,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        loginCount: 1,
      });

      console.log(
        "🎉 New user registered:",
        googleUser.email
      );
    } else {
      // Existing user
      const oldData = userSnapshot.data();

      await setDoc(
        userRef,
        {
          name: googleUser.name,
          photo: googleUser.photo || null,
          lastLogin: serverTimestamp(),
          loginCount: (oldData.loginCount || 0) + 1,
        },
        { merge: true }
      );

      console.log(
        "👤 Existing user logged in:",
        googleUser.email
      );
    }
  } catch (error) {
    console.error(
      "Failed to save user:",
      error
    );
  }
};


/* =========================================================
GOOGLE SIGN IN
========================================================= */
     
    
const googleLogin = async () => {
  setIsSigningIn(true);

  try {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(
      auth,
      provider
    );

    const firebaseUser = result.user;

   const googleUser: UserAccount = {
  uid: firebaseUser.uid,

  name:
    firebaseUser.displayName ||
    "Google User",

  email:
    firebaseUser.email ||
    "",

  photo:
    firebaseUser.photoURL ||
    undefined,
};

   setUser(googleUser);

await loadRecentChats(firebaseUser.uid);

// Save / update user in Firestore
await saveUserToFirestore(
  googleUser,
  firebaseUser.uid
);

    // Save local session
    localStorage.setItem(
      "js-ai-user",
      JSON.stringify(googleUser)
    );

    // Welcome message
    setMessages([
      {
        role: "ai",
        text: `Namaste ${googleUser.name} 👋 I am JS AI Assistant. How can I help you today?`,
      },
    ]);

    console.log(
      "Firebase Google login successful"
    );

    console.log(
      "Firebase UID:",
      firebaseUser.uid
    );
  } catch (error) {
    console.error(
      "Firebase Google sign in error:",
      error
    );
  } finally {
    setIsSigningIn(false);
  }
};

const handleGoogleSignIn = () => {
  googleLogin();
};

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("js-ai-user");

    setUser(null);
    setMenuOpen(false);
    setSettingsOpen(false);
    setAccountOpen(false);
    setMessages([]);
  };

  /* =========================================================
     NEW CHAT
  ========================================================= */

  const createNewChat = () => {
    setMessages([
      {
        role: "ai",
        text: `Namaste ${user?.name || "there"} 👋 What would you like to talk about?`,
      },
    ]);

    setMessage("");
    setIsTyping(false);
    setMenuOpen(false);
  };
/* =========================================================
   SEND MESSAGE
========================================================= */

const sendMessage = async () => {
  if (!message.trim() || isTyping) return;

  const userMessage = message.trim();

  setMessages((prev) => [
    ...prev,
    {
      role: "user",
      text: userMessage,
    },
  ]);

  setMessage("");
  setIsTyping(true);

  try {
    const response = await fetch("/api/ai-chat", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message: userMessage,
        history: messages,
        user: {
          name: user?.name,
          email: user?.email,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to get AI response"
      );
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: data.reply,
      },
    ]);

    /* =====================================================
       SAVE RECENT CHAT TO FIRESTORE
    ===================================================== */

    if (user?.uid) {
      try {
        const title =
          userMessage.length > 28
            ? userMessage.slice(0, 28) + "..."
            : userMessage;

        const preview =
          data.reply.length > 55
            ? data.reply.slice(0, 55) + "..."
            : data.reply;

        const chatsRef = collection(
          db,
          "users",
          user.uid,
          "recentChats"
        );

/* =====================================================
   SAVE / UPDATE CHAT IN FIRESTORE
===================================================== */

if (user?.uid) {
  try {
    const title =
      userMessage.length > 28
        ? userMessage.slice(0, 28) + "..."
        : userMessage;

    const preview =
      data.reply.length > 55
        ? data.reply.slice(0, 55) + "..."
        : data.reply;

    const chatsRef = collection(
      db,
      "users",
      user.uid,
      "recentChats"
    );

    let chatId = activeChatId;

    /* ================================================
       FIRST MESSAGE → CREATE NEW CHAT
    ================================================ */

    if (!chatId) {
      const newChatDoc = await addDoc(chatsRef, {
        title,
        preview,

        messages: [
          {
            role: "user",
            text: userMessage,
          },
          {
            role: "ai",
            text: data.reply,
          },
        ],

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      chatId = newChatDoc.id;

      setActiveChatId(chatId);

      setRecentChats((prev) => [
        {
          id: chatId!,
          title,
          preview,
        },
        ...prev.slice(0, 19),
      ]);
    }

    /* ================================================
       EXISTING CHAT → ADD MESSAGES
    ================================================ */

    else {
      const chatRef = doc(
        db,
        "users",
        user.uid,
        "recentChats",
        chatId
      );

      await updateDoc(chatRef, {
        messages: arrayUnion(
          {
            role: "user",
            text: userMessage,
          },
          {
            role: "ai",
            text: data.reply,
          }
        ),

        preview,
        updatedAt: serverTimestamp(),
      });

      setRecentChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                preview,
              }
            : chat
        )
      );
    }
  } catch (firestoreError) {
    console.error(
      "Failed to save chat:",
      firestoreError
    );
  }
}
  /* =========================================================
     SIGN IN SCREEN
  ========================================================= */

  if (!user) {
    return (
      <div className="relative flex h-full min-h-screen items-center justify-center overflow-hidden bg-white px-5">

        {/* Indian Flag Aurora */}

        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-orange-400/20 blur-3xl" />

          <div className="absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-green-500/20 blur-3xl" />

          <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        </div>

        {/* Back */}

        <button
          onClick={onBack}
          className="
            absolute
            left-5
            top-5
            z-20
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-white/80
            shadow-lg
            backdrop-blur-xl
            transition
            hover:bg-white
          "
        >
          <ArrowLeft
            size={22}
            className="text-blue-700"
          />
        </button>

        {/* Sign In Card */}

        <div
          className="
            relative
            z-10
            w-full
            max-w-md
            overflow-hidden
            rounded-[32px]
            border
            border-gray-200
            bg-white/90
            shadow-2xl
            backdrop-blur-xl
          "
        >

          {/* Flag stripe */}

          <div className="h-2 bg-gradient-to-r from-orange-500 via-white to-green-500" />

          <div className="px-7 py-10 text-center">

            {/* Logo */}

            <div
              className="
                mx-auto
                mb-6
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                border-4
                border-blue-600/20
                bg-gradient-to-br
                from-orange-400
                via-white
                to-green-400
                shadow-xl
              "
            >
            
            </div>

            <h1 className="text-2xl font-black text-black">
              JS AI Assistant
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Your personal AI companion 🇮🇳
            </p>

            <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-gray-500">
              Sign in with your Google account to start
              chatting with JS AI Assistant.
            </p>

            {/* Google button */}

            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="
                mt-8
                flex
                w-full
                items-center
                justify-center
                gap-3
                rounded-2xl
                border
                border-gray-300
                bg-white
                px-5
                py-4
                font-semibold
                text-black
                shadow-md
                transition
                hover:shadow-xl
                active:scale-[0.98]
                disabled:opacity-60
              "
            >

              {isSigningIn ? (
                <>
                  <div
                    className="
                      h-5
                      w-5
                      animate-spin
                      rounded-full
                      border-2
                      border-gray-300
                      border-t-blue-600
                    "
                  />

                  Signing in...
                </>
              ) : (
                <>
                  <div
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-gray-200
                      text-sm
                      font-bold
                    "
                  >
                    G
                  </div>

                  Continue with Google
                </>
              )}

            </button>

            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck
                size={15}
                className="text-green-600"
              />

              Your account stays protected
            </div>

          </div>

          {/* Flag stripe */}

          <div className="h-2 bg-gradient-to-r from-orange-500 via-white to-green-500" />

        </div>

      </div>
    );
  }

  /* =========================================================
     MAIN CHAT
  ========================================================= */

  return (
    <div
      className={`
        relative
        flex
        h-full
        min-h-screen
        flex-col
        overflow-hidden
        ${
          darkMode
            ? "bg-gray-950 text-white"
            : "bg-white text-black"
        }
      `}
    >

      {/* =====================================================
          INDIAN FLAG BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div
          className={`
            absolute
            -left-40
            -top-40
            h-[420px]
            w-[420px]
            rounded-full
            blur-3xl
            ${
              darkMode
                ? "bg-orange-600/10"
                : "bg-orange-400/20"
            }
          `}
        />

        <div
          className={`
            absolute
            -right-40
            top-1/3
            h-[420px]
            w-[420px]
            rounded-full
            blur-3xl
            ${
              darkMode
                ? "bg-green-600/10"
                : "bg-green-400/20"
            }
          `}
        />

        <div
          className={`
            absolute
            bottom-[-220px]
            left-1/3
            h-[420px]
            w-[420px]
            rounded-full
            blur-3xl
            ${
              darkMode
                ? "bg-blue-700/10"
                : "bg-blue-400/10"
            }
          `}
        />

      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className={`
          relative
          z-50
          flex
          shrink-0
          items-center
          justify-between
          border-b
          px-4
          py-3
          backdrop-blur-xl
          ${
            darkMode
              ? "border-gray-800 bg-gray-950/85"
              : "border-orange-100 bg-white/85"
          }
        `}
      >

        {/* Left */}

        <div className="flex items-center gap-3">

          <button
            onClick={onBack}
            className={`
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              transition
              ${
                darkMode
                  ? "hover:bg-gray-800"
                  : "hover:bg-blue-50"
              }
            `}
          >
            <ArrowLeft
              size={22}
              className="text-blue-700"
            />
          </button>

          {/* Avatar */}

          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              overflow-hidden
              rounded-full
              bg-gradient-to-br
              from-orange-500
              via-white
              to-green-500
              shadow-md
            "
          >
            {user.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Bot
                size={22}
                className="text-blue-700"
              />
            )}
          </div>

          <div>

            <h1
              className={`
                text-base
                font-black
                ${
                  darkMode
                    ? "text-white"
                    : "text-black"
                }
              `}
            >
              JS AI Assistant 🇮🇳
            </h1>

            <p
              className={`
                text-xs
                ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }
              `}
            >
              Online • Ready to help {user.name}
            </p>

          </div>

        </div>

        {/* Three dot */}

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            transition
            ${
              darkMode
                ? "hover:bg-gray-800"
                : "hover:bg-blue-50"
            }
          `}
        >
          <MoreVertical
            size={23}
            className={
              darkMode
                ? "text-white"
                : "text-black"
            }
          />
        </button>

        {/* =================================================
            THREE DOT MENU
        ================================================= */}

        {menuOpen && (
          <>

            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />

            <div
              className={`
                absolute
                right-4
                top-[65px]
                z-50
                w-64
                overflow-hidden
                rounded-2xl
                border
                shadow-2xl
                ${
                  darkMode
                    ? "border-gray-700 bg-gray-900"
                    : "border-gray-200 bg-white"
                }
              `}
            >

              {/* New Chat */}

              <button
                onClick={createNewChat}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-left
                  transition
                  hover:bg-orange-50
                "
              >
                <MessageSquarePlus
                  size={19}
                  className="text-orange-600"
                />

                <span
                  className={`
                    flex-1
                    text-sm
                    font-semibold
                    ${
                      darkMode
                        ? "text-white"
                        : "text-black"
                    }
                  `}
                >
                  New Chat
                </span>

                <ChevronRight size={16} />
              </button>

              {/* Recent */}

              <button
                onClick={() => {
                  setRecentOpen(true);
                  setMenuOpen(false);
                }}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-left
                  transition
                  hover:bg-green-50
                "
              >
                <History
                  size={19}
                  className="text-green-600"
                />

                <span
                  className={`
                    flex-1
                    text-sm
                    font-semibold
                    ${
                      darkMode
                        ? "text-white"
                        : "text-black"
                    }
                  `}
                >
                  Recent Chats
                </span>

                <ChevronRight size={16} />
              </button>

              {/* Account */}

              <button
                onClick={() => {
                  setAccountOpen(true);
                  setMenuOpen(false);
                }}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-left
                  transition
                  hover:bg-blue-50
                "
              >
                <UserCircle
                  size={19}
                  className="text-blue-700"
                />

                <span
                  className={`
                    flex-1
                    text-sm
                    font-semibold
                    ${
                      darkMode
                        ? "text-white"
                        : "text-black"
                    }
                  `}
                >
                  Account
                </span>

                <ChevronRight size={16} />
              </button>

              {/* Settings */}

              <button
                onClick={() => {
                  setSettingsOpen(true);
                  setMenuOpen(false);
                }}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-left
                  transition
                  hover:bg-blue-50
                "
              >
                <Settings
                  size={19}
                  className="text-blue-700"
                />

                <span
                  className={`
                    flex-1
                    text-sm
                    font-semibold
                    ${
                      darkMode
                        ? "text-white"
                        : "text-black"
                    }
                  `}
                >
                  Settings
                </span>

                <ChevronRight size={16} />
              </button>

            </div>
          </>
        )}

      </header>

      {/* =====================================================
          CHAT AREA
      ===================================================== */}

      <main
        className="
          relative
          z-10
          flex-1
          overflow-y-auto
          px-4
          pb-32
          pt-6
        "
      >

        <div className="mx-auto max-w-4xl space-y-5">

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
                className={`
                  flex
                  max-w-[82%]
                  items-start
                  gap-3
                  rounded-3xl
                  px-5
                  py-3
                  shadow-lg
                  ${
                    msg.role === "user"
                      ? `
                        rounded-br-lg
                        bg-gradient-to-r
                        from-orange-400
                        to-orange-500
                      `
                      : `
                        rounded-bl-lg
                        bg-gradient-to-r
                        from-green-400
                        to-green-500
                      `
                  }
                `}
              >

             
                <span
                  className="
                    whitespace-pre-wrap
                    break-words
                    leading-7
                    text-black
                  "
                >
                  {msg.text}
                </span>

              </div>

            </div>

          ))}

          {/* =================================================
              TYPING INDICATOR
          ================================================= */}

          {isTyping && (
            <div className="flex justify-start">

              <div
                className="
                  flex
                  items-center
                  gap-1
                  rounded-3xl
                  rounded-bl-lg
                  bg-gradient-to-r
                  from-green-400
                  to-green-500
                  px-5
                  py-4
                  shadow-lg
                "
              >

                <span
                  className="
                    h-2
                    w-2
                    animate-bounce
                    rounded-full
                    bg-black
                  "
                />

                <span
                  className="
                    h-2
                    w-2
                    animate-bounce
                    rounded-full
                    bg-black
                    [animation-delay:150ms]
                  "
                />

                <span
                  className="
                    h-2
                    w-2
                    animate-bounce
                    rounded-full
                    bg-black
                    [animation-delay:300ms]
                  "
                />

              </div>

            </div>
          )}

          <div ref={messagesEndRef} />

        </div>

      </main>

      {/* =====================================================
          FIXED INPUT
      ===================================================== */}

      <div
        className={`
          absolute
          bottom-0
          left-0
          right-0
          z-40
          border-t
          px-4
          py-3
          pb-[max(env(safe-area-inset-bottom),12px)]
          backdrop-blur-xl
          ${
            darkMode
              ? "border-gray-800 bg-gray-950/90"
              : "border-green-100 bg-white/90"
          }
        `}
      >

        <div className="mx-auto flex max-w-5xl items-end gap-3">

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey
              ) {
                e.preventDefault();
                sendMessage();
              }
            }}
            rows={1}
            placeholder={`Ask anything, ${user.name}...`}
            disabled={isTyping}
            className={`
              max-h-40
              flex-1
              resize-none
              overflow-y-auto
              rounded-3xl
              border
              px-5
              py-4
              outline-none
              shadow-md
              ${
                darkMode
                  ? `
                    border-gray-700
                    bg-gray-900
                    text-white
                    placeholder:text-gray-500
                    focus:ring-blue-500
                  `
                  : `
                    border-blue-200
                    bg-white
                    text-black
                    placeholder:text-gray-400
                    focus:ring-blue-500
                  `
              }
              focus:ring-2
            `}
          />

          <button
            onClick={sendMessage}
            disabled={!message.trim() || isTyping}
            className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-blue-700
              text-white
              shadow-xl
              transition
              hover:bg-blue-800
              hover:scale-105
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <Send size={22} />
          </button>

        </div>

      </div>

      {/* =====================================================
          SETTINGS PANEL
      ===================================================== */}

      {settingsOpen && (
        <div className="absolute inset-0 z-[100]">

          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSettingsOpen(false)}
          />

          <div
            className={`
              absolute
              bottom-0
              left-0
              right-0
              mx-auto
              max-w-lg
              rounded-t-[30px]
              p-6
              shadow-2xl
              ${
                darkMode
                  ? "bg-gray-900 text-white"
                  : "bg-white text-black"
              }
            `}
          >

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-xl font-black">
                Settings
              </h2>

              <button
                onClick={() => setSettingsOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* Theme */}

            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="
                flex
                w-full
                items-center
                gap-4
                rounded-2xl
                border
                border-gray-200
                p-4
                text-left
              "
            >

              {darkMode ? (
                <Moon className="text-blue-500" />
              ) : (
                <Sun className="text-orange-500" />
              )}

              <div className="flex-1">

                <p className="font-bold">
                  Dark Theme
                </p>

                <p className="text-xs text-gray-500">
                  {darkMode
                    ? "Dark mode is active"
                    : "Switch to dark mode"}
                </p>

              </div>

              <div
                className={`
                  h-6
                  w-11
                  rounded-full
                  p-1
                  transition
                  ${
                    darkMode
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }
                `}
              >
                <div
                  className={`
                    h-4
                    w-4
                    rounded-full
                    bg-white
                    transition
                    ${
                      darkMode
                        ? "translate-x-5"
                        : "translate-x-0"
                    }
                  `}
                />
              </div>

            </button>

            {/* Add account */}

            <button
              onClick={handleGoogleSignIn}
              className="
                mt-3
                flex
                w-full
                items-center
                gap-4
                rounded-2xl
                border
                border-gray-200
                p-4
                text-left
              "
            >

              <UserPlus className="text-green-600" />

              <div className="flex-1">

                <p className="font-bold">
                  Add Account
                </p>

                <p className="text-xs text-gray-500">
                  Sign in with another Google account
                </p>

              </div>

              <ChevronRight size={18} />

            </button>

            {/* Logout */}

            <button
              onClick={handleLogout}
              className="
                mt-3
                flex
                w-full
                items-center
                gap-4
                rounded-2xl
                border
                border-red-100
                p-4
                text-left
                text-red-600
              "
            >

              <LogOut size={20} />

              <div className="flex-1">

                <p className="font-bold">
                  Log Out
                </p>

                <p className="text-xs text-gray-500">
                  Sign out of this account
                </p>

              </div>

              <ChevronRight size={18} />

            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          ACCOUNT PANEL
      ===================================================== */}

      {accountOpen && (
        <div className="absolute inset-0 z-[100]">

          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setAccountOpen(false)}
          />

          <div
            className={`
              absolute
              bottom-0
              left-0
              right-0
              mx-auto
              max-w-lg
              rounded-t-[30px]
              p-6
              shadow-2xl
              ${
                darkMode
                  ? "bg-gray-900 text-white"
                  : "bg-white text-black"
              }
            `}
          >

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-xl font-black">
                Account
              </h2>

              <button
                onClick={() => setAccountOpen(false)}
                className="rounded-full p-2"
              >
                <X size={20} />
              </button>

            </div>

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-16
                  w-16
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  bg-gradient-to-br
                  from-orange-400
                  via-white
                  to-green-400
                "
              >

                {user.photo ? (
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User
                    size={28}
                    className="text-blue-700"
                  />
                )}

              </div>

              <div>

                <p className="text-lg font-black">
                  {user.name}
                </p>

                <p className="text-sm text-gray-500">
                  {user.email}
                </p>

              </div>

            </div>

            <div className="mt-6 rounded-2xl bg-gray-50 p-4">

              <div className="flex items-center gap-2">

                <Check
                  size={17}
                  className="text-green-600"
                />

                <span className="text-sm font-semibold">
                  Google account connected
                </span>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          RECENT CHATS
      ===================================================== */}

      {recentOpen && (
        <div className="absolute inset-0 z-[100]">

          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setRecentOpen(false)}
          />

          <div
            className={`
              absolute
              bottom-0
              left-0
              right-0
              mx-auto
              max-h-[75vh]
              max-w-lg
              overflow-y-auto
              rounded-t-[30px]
              p-6
              shadow-2xl
              ${
                darkMode
                  ? "bg-gray-900 text-white"
                  : "bg-white text-black"
              }
            `}
          >

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-xl font-black">
                Recent Chats
              </h2>

              <button
                onClick={() => setRecentOpen(false)}
                className="rounded-full p-2"
              >
                <X size={20} />
              </button>

            </div>

            {recentChats.length === 0 ? (
              <div className="py-10 text-center text-gray-500">
                No recent chats yet.
              </div>
            ) : (
              <div className="space-y-2">

                {recentChats.map((chat) => (

                  <button
                    key={chat.id}
                    onClick={() => setRecentOpen(false)}
                    className="
                      flex
                      w-full
                      items-start
                      gap-3
                      rounded-2xl
                      border
                      border-gray-200
                      p-4
                      text-left
                      transition
                      hover:bg-gray-50
                    "
                  >

                    <History
                      size={19}
                      className="mt-1 shrink-0 text-blue-600"
                    />

                    <div className="min-w-0">

                      <p className="truncate font-bold">
                        {chat.title}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        {chat.preview}
                      </p>

                    </div>

                  </button>

                ))}

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}