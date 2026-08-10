import React, { useEffect, useRef, useState } from "react";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
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
  Trash2,
} from "lucide-react";

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  query,
  orderBy,
  limit,
  serverTimestamp,
  doc,
  deleteDoc,
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
  messages?: Message[];
}

export default function AIChat({
  onBack,
}: AIChatProps) {
  /* =====================================================
     USER / AUTH
  ===================================================== */

  const [user, setUser] =
    useState<UserAccount | null>(null);

  const [isSigningIn, setIsSigningIn] =
    useState(false);

  /* =====================================================
     CHAT
  ===================================================== */

  const [message, setMessage] = useState("");

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [isTyping, setIsTyping] =
    useState(false);

  const [activeChatId, setActiveChatId] =
    useState<string | null>(null);

  /* =====================================================
     RECENT CHATS
  ===================================================== */

  const [recentChats, setRecentChats] =
    useState<RecentChat[]>([]);

  /* =====================================================
     UI
  ===================================================== */

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [recentOpen, setRecentOpen] =
    useState(false);

  const [settingsOpen, setSettingsOpen] =
    useState(false);

  const [accountOpen, setAccountOpen] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(false);

  /* =====================================================
     REFS
  ===================================================== */

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  /* =====================================================
     AUTO SCROLL
  ===================================================== */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  /* =====================================================
     LOAD RECENT CHATS
  ===================================================== */

  const loadRecentChats = async (
    uid: string
  ) => {
    try {
      const chatsRef = collection(
        db,
        "users",
        uid,
        "recentChats"
      );

      const chatsQuery = query(
        chatsRef,
        orderBy("updatedAt", "desc"),
        limit(20)
      );

      const snapshot =
        await getDocs(chatsQuery);

      const chats: RecentChat[] =
        snapshot.docs.map((chatDoc) => {
          const data = chatDoc.data();

          return {
            id: chatDoc.id,
            title:
              data.title || "New Chat",
            preview:
              data.preview || "",
            messages:
              data.messages || [],
          };
        });

      setRecentChats(chats);
    } catch (error) {
      console.error(
        "Failed to load recent chats:",
        error
      );

      /*
       * Fallback in case old documents do not
       * have updatedAt yet.
       */

      try {
        const chatsRef = collection(
          db,
          "users",
          uid,
          "recentChats"
        );

        const snapshot =
          await getDocs(chatsRef);

        const chats: RecentChat[] =
          snapshot.docs.map((chatDoc) => {
            const data = chatDoc.data();

            return {
              id: chatDoc.id,
              title:
                data.title || "New Chat",
              preview:
                data.preview || "",
              messages:
                data.messages || [],
            };
          });

        setRecentChats(
          chats.slice(0, 20)
        );
      } catch (fallbackError) {
        console.error(
          "Fallback recent chat loading failed:",
          fallbackError
        );

        setRecentChats([]);
      }
    }
  };

  /* =====================================================
     FIREBASE AUTH RESTORE
  ===================================================== */

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          if (!firebaseUser) {
            setUser(null);
            setRecentChats([]);
            setMessages([]);
            return;
          }

          const restoredUser: UserAccount = {
            uid: firebaseUser.uid,

            name:
              firebaseUser.displayName ||
              "Google User",

            email:
              firebaseUser.email || "",

            photo:
              firebaseUser.photoURL ||
              undefined,
          };

          setUser(restoredUser);

          localStorage.setItem(
            "js-ai-user",
            JSON.stringify(restoredUser)
          );

          await loadRecentChats(
            firebaseUser.uid
          );

          setMessages([
            {
              role: "ai",
              text: `Namaste ${restoredUser.name} 👋 I am JS AI Assistant. How can I help you today?`,
            },
          ]);
        }
      );

    return () => unsubscribe();
  }, []);

  /* =====================================================
     SAVE USER TO FIRESTORE
  ===================================================== */

  const saveUserToFirestore = async (
    googleUser: UserAccount
  ) => {
    try {
      if (!googleUser.email) {
        return;
      }

      const userRef = doc(
        db,
        "users",
        googleUser.uid
      );

      const userSnapshot =
        await getDoc(userRef);

      if (!userSnapshot.exists()) {
        await setDoc(userRef, {
          uid: googleUser.uid,

          name: googleUser.name,

          email:
            googleUser.email.toLowerCase(),

          photo:
            googleUser.photo || null,

          createdAt:
            serverTimestamp(),

          lastLogin:
            serverTimestamp(),

          loginCount: 1,
        });

        console.log(
          "New user registered:",
          googleUser.email
        );
      } else {
        const oldData =
          userSnapshot.data();

        await setDoc(
          userRef,
          {
            name: googleUser.name,

            email:
              googleUser.email.toLowerCase(),

            photo:
              googleUser.photo || null,

            lastLogin:
              serverTimestamp(),

            loginCount:
              (oldData.loginCount || 0) + 1,
          },
          {
            merge: true,
          }
        );

        console.log(
          "Existing user logged in:",
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

  /* =====================================================
     GOOGLE LOGIN
  ===================================================== */

  const googleLogin = async () => {
    if (isSigningIn) {
      return;
    }

    setIsSigningIn(true);

    try {
      const provider =
        new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result =
        await signInWithPopup(
          auth,
          provider
        );

      const firebaseUser =
        result.user;

      const googleUser: UserAccount = {
        uid: firebaseUser.uid,

        name:
          firebaseUser.displayName ||
          "Google User",

        email:
          firebaseUser.email || "",

        photo:
          firebaseUser.photoURL ||
          undefined,
      };

      setUser(googleUser);

      localStorage.setItem(
        "js-ai-user",
        JSON.stringify(googleUser)
      );

      await saveUserToFirestore(
        googleUser
      );

      await loadRecentChats(
        firebaseUser.uid
      );

      setMessages([
        {
          role: "ai",
          text: `Namaste ${googleUser.name} 👋 I am JS AI Assistant. How can I help you today?`,
        },
      ]);

      console.log(
        "Firebase Google login successful"
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

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = async () => {
    try {
      await signOut(auth);

      localStorage.removeItem(
        "js-ai-user"
      );

      setUser(null);

      setMessages([]);

      setRecentChats([]);

      setActiveChatId(null);

      setMenuOpen(false);

      setSettingsOpen(false);

      setAccountOpen(false);

      setRecentOpen(false);
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  };

  /* =====================================================
     NEW CHAT
  ===================================================== */

  const createNewChat = () => {
    setActiveChatId(null);

    setMessages([
      {
        role: "ai",
        text: `Namaste ${
          user?.name || "there"
        } 👋 What would you like to talk about?`,
      },
    ]);

    setMessage("");

    setIsTyping(false);

    setMenuOpen(false);

    setRecentOpen(false);
  };

  /* =====================================================
     OPEN RECENT CHAT
  ===================================================== */

  const openRecentChat = async (
    chatId: string
  ) => {
    if (!user?.uid) {
      return;
    }

    try {
      const chatRef = doc(
        db,
        "users",
        user.uid,
        "recentChats",
        chatId
      );

      const snapshot =
        await getDoc(chatRef);

      if (!snapshot.exists()) {
        console.error(
          "Chat not found"
        );
        return;
      }

      const data =
        snapshot.data();

      setActiveChatId(chatId);

      setMessages(
        Array.isArray(data.messages)
          ? data.messages
          : []
      );

      setRecentOpen(false);

      setMenuOpen(false);
    } catch (error) {
      console.error(
        "Failed to open recent chat:",
        error
      );
    }
  };

  /* =====================================================
     DELETE RECENT CHAT
  ===================================================== */

  const deleteRecentChat = async (
    chatId: string
  ) => {
    if (!user?.uid) {
      return;
    }

    try {
      const chatRef = doc(
        db,
        "users",
        user.uid,
        "recentChats",
        chatId
      );

      await deleteDoc(chatRef);

      setRecentChats((prev) =>
        prev.filter(
          (chat) => chat.id !== chatId
        )
      );

      if (activeChatId === chatId) {
        setActiveChatId(null);

        setMessages([
          {
            role: "ai",
            text: `Namaste ${
              user.name
            } 👋 What would you like to talk about?`,
          },
        ]);
      }
    } catch (error) {
      console.error(
        "Failed to delete recent chat:",
        error
      );
    }
  };
    /* =====================================================
     SEND MESSAGE
  ===================================================== */

  const sendMessage = async () => {
    if (!message.trim() || isTyping) {
      return;
    }

    if (!user?.uid) {
      return;
    }

    const userMessage = message.trim();

    const userMessageObject: Message = {
      role: "user",
      text: userMessage,
    };

    setMessages((prev) => [
      ...prev,
      userMessageObject,
    ]);

    setMessage("");
    setIsTyping(true);

    try {
      /* =================================================
         CALL AI API
      ================================================= */

      const response = await fetch(
        "/api/ai-chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: userMessage,

            history: messages,

            user: {
              uid: user.uid,
              name: user.name,
              email: user.email,
            },
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to get AI response"
        );
      }

      const aiReply =
        data.reply ||
        "Sorry, I could not generate a response.";

      /* =================================================
         ADD AI RESPONSE TO UI
      ================================================= */

      const aiMessageObject: Message = {
        role: "ai",
        text: aiReply,
      };

      setMessages((prev) => [
        ...prev,
        aiMessageObject,
      ]);

      /* =================================================
         FIRESTORE CHAT SAVE
      ================================================= */

      try {
        const title =
          userMessage.length > 28
            ? userMessage.slice(0, 28) +
              "..."
            : userMessage;

        const preview =
          aiReply.length > 55
            ? aiReply.slice(0, 55) +
              "..."
            : aiReply;

        const chatsRef = collection(
          db,
          "users",
          user.uid,
          "recentChats"
        );

        let chatId =
          activeChatId;

        /* =============================================
           CREATE NEW CHAT
        ============================================= */

        if (!chatId) {
          const newChatDoc =
            await addDoc(
              chatsRef,
              {
                title,

                preview,

                messages: [
                  userMessageObject,
                  aiMessageObject,
                ],

                createdAt:
                  serverTimestamp(),

                updatedAt:
                  serverTimestamp(),
              }
            );

          chatId =
            newChatDoc.id;

          setActiveChatId(chatId);

          setRecentChats((prev) => [
            {
              id: chatId!,
              title,
              preview,
              messages: [
                userMessageObject,
                aiMessageObject,
              ],
            },

            ...prev.filter(
              (chat) =>
                chat.id !== chatId
            ).slice(0, 19),
          ]);
        }

        /* =============================================
           UPDATE EXISTING CHAT
        ============================================= */

        else {
          const chatRef = doc(
            db,
            "users",
            user.uid,
            "recentChats",
            chatId
          );

          await updateDoc(
            chatRef,
            {
              messages: arrayUnion(
                userMessageObject,
                aiMessageObject
              ),

              preview,

              updatedAt:
                serverTimestamp(),
            }
          );

          setRecentChats((prev) =>
            prev.map((chat) =>
              chat.id === chatId
                ? {
                    ...chat,
                    preview,
                    messages: [
                      ...(chat.messages ||
                        []),
                      userMessageObject,
                      aiMessageObject,
                    ],
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
    } catch (error) {
      console.error(
        "Chat error:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  /* =====================================================
     SIGN IN SCREEN
  ===================================================== */

  if (!user) {
    return (
      <div
        className="
          relative
          flex
          min-h-full
          w-full
          items-center
          justify-center
          overflow-hidden
          bg-white
          px-4
        "
      >
        {/* =============================================
            INDIAN FLAG AURORA
        ============================================= */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            overflow-hidden
          "
        >
          <div
            className="
              absolute
              -left-32
              -top-40
              h-96
              w-96
              rounded-full
              bg-orange-400/20
              blur-3xl
              animate-pulse
            "
          />

          <div
            className="
              absolute
              -right-40
              top-1/2
              h-96
              w-96
              rounded-full
              bg-green-500/20
              blur-3xl
              animate-pulse
            "
          />

          <div
            className="
              absolute
              bottom-[-140px]
              left-1/3
              h-96
              w-96
              rounded-full
              bg-blue-500/10
              blur-3xl
              animate-pulse
            "
          />
        </div>

        {/* =============================================
            BACK BUTTON
        ============================================= */}

        <button
          type="button"
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
            duration-200
            hover:bg-white
            hover:scale-105
            active:scale-95
          "
        >
          <ArrowLeft
            size={22}
            className="text-blue-700"
          />
        </button>

        {/* =============================================
            SIGN IN CARD
        ============================================= */}

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

          <div
            className="
              h-2
              bg-gradient-to-r
              from-orange-500
              via-white
              to-green-500
            "
          />

          <div
            className="
              px-7
              py-10
              text-center
            "
          >
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
                animate-pulse
              "
            >
              <Bot
                size={34}
                className="text-blue-700"
              />
            </div>

            <h1
              className="
                text-2xl
                font-black
                text-black
              "
            >
              JS AI Assistant
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-gray-600
              "
            >
              Your personal AI companion 🇮🇳
            </p>

            <p
              className="
                mx-auto
                mt-5
                max-w-sm
                text-sm
                leading-6
                text-gray-500
              "
            >
              Sign in with your Google
              account to start chatting
              with JS AI Assistant.
            </p>

            {/* =========================================
                GOOGLE BUTTON
            ========================================= */}

            <button
              type="button"
              onClick={
                handleGoogleSignIn
              }
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
                duration-200
                hover:shadow-xl
                hover:-translate-y-0.5
                active:scale-[0.98]
                disabled:cursor-not-allowed
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

            {/* Security */}

            <div
              className="
                mt-7
                flex
                items-center
                justify-center
                gap-2
                text-xs
                text-gray-500
              "
            >
              <ShieldCheck
                size={15}
                className="text-green-600"
              />

              Your account stays protected
            </div>
          </div>

          {/* Flag stripe */}

          <div
            className="
              h-2
              bg-gradient-to-r
              from-orange-500
              via-white
              to-green-500
            "
          />
        </div>
      </div>
    );
  }
    /* =====================================================
     MAIN CHAT UI
  ===================================================== */

  return (
    <div
      className={`
        relative
        flex
        h-full
        min-h-0
        w-full
        flex-col
        overflow-hidden
        ${
          darkMode
            ? "bg-gray-950 text-white"
            : "bg-white text-black"
        }
      `}
    >
      {/* =================================================
          INDIAN FLAG AURORA BACKGROUND
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className={`
            absolute
            -left-40
            -top-40
            h-[420px]
            w-[420px]
            rounded-full
            blur-3xl
            animate-pulse
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
            animate-pulse
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
            animate-pulse
            ${
              darkMode
                ? "bg-blue-700/10"
                : "bg-blue-400/10"
            }
          `}
        />
      </div>

      {/* =================================================
          HEADER
      ================================================= */}

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
        {/* LEFT SIDE */}

        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              transition
              duration-200
              hover:scale-105
              active:scale-95
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
              shrink-0
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
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            ) : (
              <Bot
                size={22}
                className="text-blue-700"
              />
            )}
          </div>

          <div className="min-w-0">
            <h1
              className={`
                truncate
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
                truncate
                text-xs
                ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }
              `}
            >
              Online • Ready to help{" "}
              {user.name}
            </p>
          </div>
        </div>

        {/* THREE DOT */}

        <button
          type="button"
          onClick={() =>
            setMenuOpen(
              (prev) => !prev
            )
          }
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            transition
            duration-200
            hover:scale-105
            active:scale-95
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
              className="
                fixed
                inset-0
                z-40
              "
              onClick={() =>
                setMenuOpen(false)
              }
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
                type="button"
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

                <ChevronRight
                  size={16}
                  className={
                    darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }
                />
              </button>

              {/* Recent Chats */}

              <button
                type="button"
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

                <ChevronRight
                  size={16}
                />
              </button>

              {/* Account */}

              <button
                type="button"
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

                <ChevronRight
                  size={16}
                />
              </button>

              {/* Settings */}

              <button
                type="button"
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

                <ChevronRight
                  size={16}
                />
              </button>
            </div>
          </>
        )}
      </header>

      {/* =================================================
    CHAT AREA
================================================= */}

<main
  className="
    relative
    z-10
    min-h-0
    flex-1
  "
>
  {/* Scrollable chat container */}

  <div
    className="
      absolute
      inset-0
      overflow-y-auto
      px-4
      pb-32
      pt-6
    "
  >
    <div
      className="
        mx-auto
        flex
        min-h-full
        w-full
        max-w-4xl
        flex-col
        justify-end
        gap-5
      "
    >

      {/* =================================================
          MESSAGES
      ================================================= */}

      {messages.map(
        (msg, index) => (
          <div
            key={`${index}-${msg.role}`}
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
                transition
                duration-200

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
        )
      )}

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

      {/* =================================================
          AUTO SCROLL TARGET
      ================================================= */}

      <div ref={messagesEndRef} />

    </div>
  </div>
</main>
      {/* =================================================
          FIXED INPUT
      ================================================= */}

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
        <div
          className="
            mx-auto
            flex
            max-w-5xl
            items-end
            gap-3
          "
        >
          {/* Input wrapper */}

          <div
            className="
              relative
              flex-1
              overflow-hidden
              rounded-[23px]
              p-[1.5px]
            "
          >
            {/* Moving light */}

            <div
              className="
                absolute
                inset-[-100%]
                animate-[spin_3s_linear_infinite]
                bg-[conic-gradient(from_0deg,#8B0000,#FFD700,#8B0000,#FFD700,#8B0000)]
              "
            />

            <div
              className={`
                relative
                rounded-[21px]
                ${
                  darkMode
                    ? "bg-gray-900"
                    : "bg-white"
                }
              `}
            >
              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
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
                  block
                  max-h-40
                  w-full
                  resize-none
                  overflow-y-auto
                  rounded-[21px]
                  border-0
                  bg-transparent
                  px-5
                  py-4
                  outline-none
                  shadow-md
                  ${
                    darkMode
                      ? `
                        text-white
                        placeholder:text-gray-500
                      `
                      : `
                        text-black
                        placeholder:text-gray-400
                      `
                  }
                `}
              />
            </div>
          </div>

          {/* Send */}

          <button
            type="button"
            onClick={sendMessage}
            disabled={
              !message.trim() ||
              isTyping
            }
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
              duration-200
              hover:scale-105
              hover:bg-blue-800
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <Send size={22} />
          </button>
        </div>
      </div>

      {/* =================================================
          SETTINGS PANEL
      ================================================= */}

      {settingsOpen && (
        <div
          className="
            absolute
            inset-0
            z-[100]
          "
        >
          <div
            className="
              absolute
              inset-0
              bg-black/30
              backdrop-blur-sm
            "
            onClick={() =>
              setSettingsOpen(false)
            }
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
            <div
              className="
                mb-5
                flex
                items-center
                justify-between
              "
            >
              <h2
                className="
                  text-xl
                  font-black
                "
              >
                Settings
              </h2>

              <button
                type="button"
                onClick={() =>
                  setSettingsOpen(false)
                }
                className="
                  rounded-full
                  p-2
                  transition
                  hover:bg-gray-100
                "
              >
                <X size={20} />
              </button>
            </div>

            {/* Theme */}

            <button
              type="button"
              onClick={() =>
                setDarkMode(
                  (prev) => !prev
                )
              }
              className={`
                flex
                w-full
                items-center
                gap-4
                rounded-2xl
                border
                p-4
                text-left
                ${
                  darkMode
                    ? "border-gray-700"
                    : "border-gray-200"
                }
              `}
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

            {/* Add Account */}

            <button
              type="button"
              onClick={
                handleGoogleSignIn
              }
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
                transition
                hover:bg-green-50
              "
            >
              <UserPlus
                className="text-green-600"
              />

              <div className="flex-1">
                <p className="font-bold">
                  Add Account
                </p>

                <p className="text-xs text-gray-500">
                  Sign in with another Google
                  account
                </p>
              </div>

              <ChevronRight size={18} />
            </button>

            {/* Logout */}

            <button
              type="button"
              onClick={
                handleLogout
              }
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
                transition
                hover:bg-red-50
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

      {/* =================================================
          ACCOUNT PANEL
      ================================================= */}

      {accountOpen && (
        <div
          className="
            absolute
            inset-0
            z-[100]
          "
        >
          <div
            className="
              absolute
              inset-0
              bg-black/30
              backdrop-blur-sm
            "
            onClick={() =>
              setAccountOpen(false)
            }
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
            <div
              className="
                mb-6
                flex
                items-center
                justify-between
              "
            >
              <h2
                className="
                  text-xl
                  font-black
                "
              >
                Account
              </h2>

              <button
                type="button"
                onClick={() =>
                  setAccountOpen(false)
                }
                className="
                  rounded-full
                  p-2
                  transition
                  hover:bg-gray-100
                "
              >
                <X size={20} />
              </button>
            </div>

            <div
              className="
                flex
                items-center
                gap-4
              "
            >
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
                  shadow-md
                "
              >
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />
                ) : (
                  <User
                    size={28}
                    className="text-blue-700"
                  />
                )}
              </div>

              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-lg
                    font-black
                  "
                >
                  {user.name}
                </p>

                <p
                  className="
                    truncate
                    text-sm
                    text-gray-500
                  "
                >
                  {user.email}
                </p>
              </div>
            </div>

            <div
              className={`
                mt-6
                rounded-2xl
                p-4
                ${
                  darkMode
                    ? "bg-gray-800"
                    : "bg-gray-50"
                }
              `}
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <Check
                  size={17}
                  className="text-green-600"
                />

                <span
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  Google account connected
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          RECENT CHATS PANEL
      ================================================= */}

      {recentOpen && (
        <div
          className="
            absolute
            inset-0
            z-[100]
          "
        >
          <div
            className="
              absolute
              inset-0
              bg-black/30
              backdrop-blur-sm
            "
            onClick={() =>
              setRecentOpen(false)
            }
          />

          <div
            className={`
              absolute
              right-0
              top-0
              bottom-0
              w-full
              max-w-md
              overflow-y-auto
              p-6
              shadow-2xl
              ${
                darkMode
                  ? "bg-gray-900 text-white"
                  : "bg-white text-black"
              }
            `}
          >
            <div
              className="
                mb-5
                flex
                items-center
                justify-between
              "
            >
              <div>
                <h2
                  className="
                    text-xl
                    font-black
                  "
                >
                  Recent Chats
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-500
                  "
                >
                  Your latest conversations
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setRecentOpen(false)
                }
                className="
                  rounded-full
                  p-2
                  transition
                  hover:bg-gray-100
                "
              >
                <X size={20} />
              </button>
            </div>

            {/* Empty */}

            {recentChats.length === 0 ? (
              <div
                className="
                  py-16
                  text-center
                  text-gray-500
                "
              >
                <History
                  size={36}
                  className="
                    mx-auto
                    mb-3
                    opacity-40
                  "
                />

                <p className="font-semibold">
                  No recent chats yet.
                </p>

                <p className="mt-1 text-xs">
                  Start a conversation to
                  see it here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentChats.map(
                  (chat) => (
                    <div
                      key={chat.id}
                      className={`
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        p-3
                        transition
                        ${
                          darkMode
                            ? "border-gray-800 hover:bg-gray-800"
                            : "border-gray-100 hover:bg-gray-50"
                        }
                      `}
                    >
                      {/* History icon */}

                      <History
                        size={19}
                        className="
                          mt-1
                          shrink-0
                          text-blue-600
                        "
                      />

                      {/* Chat */}

                      <button
                        type="button"
                        onClick={() =>
                          openRecentChat(
                            chat.id
                          )
                        }
                        className="
                          min-w-0
                          flex-1
                          text-left
                        "
                      >
                        <p
                          className="
                            truncate
                            font-bold
                          "
                        >
                          {chat.title}
                        </p>

                        <p
                          className="
                            mt-1
                            truncate
                            text-xs
                            text-gray-500
                          "
                        >
                          {chat.preview}
                        </p>
                      </button>

                      {/* Delete */}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          deleteRecentChat(
                            chat.id
                          );
                        }}
                        className="
                          shrink-0
                          rounded-full
                          p-2
                          text-gray-400
                          transition
                          hover:bg-red-50
                          hover:text-red-600
                        "
                        title="Delete chat"
                        aria-label="Delete chat"
                      >
                        <Trash2
                          size={18}
                        />
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}