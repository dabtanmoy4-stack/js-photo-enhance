import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import { auth } from "../firebase";

import {
  Mic,
  MicOff,
  ArrowLeft,
  Sparkles,
  Loader2,
  Volume2,
  LogIn,
} from "lucide-react";

/* ========================================================= */
/* ======================= PROPS ============================ */
/* ========================================================= */

interface JSVoiceAssistantProps {
  onBack?: () => void;
}

/* ========================================================= */
/* ================= ASSISTANT STATES ======================= */
/* ========================================================= */

type AssistantState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking";

/* ========================================================= */
/* ================= SPEECH RECOGNITION ===================== */
/* ========================================================= */

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;

  start: () => void;
  stop: () => void;
  abort: () => void;

  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

/* ========================================================= */
/* ======================= COMPONENT ======================== */
/* ========================================================= */

export const JSVoiceAssistant: React.FC<
  JSVoiceAssistantProps
> = ({ onBack }) => {
  /* ======================================================= */
  /* ======================= AUTH =========================== */
  /* ======================================================= */

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  /* ======================================================= */
  /* ================= ASSISTANT STATE ====================== */
  /* ======================================================= */

  const [assistantState, setAssistantState] =
    useState<AssistantState>("idle");

  /* ======================================================= */
  /* ================= SPEECH STATE ========================= */
  /* ======================================================= */

  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] =
    useState("");

  const [aiResponse, setAiResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [speechSupported, setSpeechSupported] =
    useState(true);

  const [speechSynthesisSupported, setSpeechSynthesisSupported] =
    useState(true);

  /* ======================================================= */
  /* ======================= REFS =========================== */
  /* ======================================================= */

  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(null);

  const assistantStateRef =
    useRef<AssistantState>("idle");

  const transcriptRef =
    useRef("");

  const requestInProgressRef =
    useRef(false);

  const speechSessionRef =
    useRef(0);

  /* ======================================================= */
  /* =============== KEEP STATE IN SYNC ===================== */
  /* ======================================================= */

  useEffect(() => {
    assistantStateRef.current = assistantState;
  }, [assistantState]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  /* ======================================================= */
  /* ================= GOOGLE AUTH ========================== */
  /* ======================================================= */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setCheckingAuth(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ======================================================= */
  /* ================= STOP SPEECH ========================== */
  /* ======================================================= */

  const stopSpeaking = useCallback(() => {
    speechSessionRef.current += 1;

    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    if (
      assistantStateRef.current === "speaking"
    ) {
      setAssistantState("idle");
    }
  }, []);

  /* ======================================================= */
  /* ================= TEXT TO SPEECH ======================= */
  /* ======================================================= */

  const speakResponse = useCallback(
    (text: string) => {
      if (
        typeof window === "undefined" ||
        !("speechSynthesis" in window)
      ) {
        setSpeechSynthesisSupported(false);
        setAssistantState("idle");
        return;
      }

      const cleanText = text.trim();

      if (!cleanText) {
        setAssistantState("idle");
        return;
      }

      const sessionId =
        ++speechSessionRef.current;

      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(cleanText);

      /*
       * Prefer Indian English for English responses.
       * Browser will automatically fallback if unavailable.
       */
      utterance.lang = "en-IN";
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voices =
        window.speechSynthesis.getVoices();

      const preferredVoice =
        voices.find((voice) =>
          /en-IN/i.test(voice.lang)
        ) ||
        voices.find((voice) =>
          /en-US/i.test(voice.lang)
        ) ||
        voices.find((voice) =>
          /en-GB/i.test(voice.lang)
        );

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        if (
          sessionId !== speechSessionRef.current
        ) {
          return;
        }

        setAssistantState("speaking");
      };

      utterance.onend = () => {
        if (
          sessionId !== speechSessionRef.current
        ) {
          return;
        }

        setAssistantState("idle");
      };

      utterance.onerror = (event) => {
        console.error(
          "Speech synthesis error:",
          event
        );

        if (
          sessionId !== speechSessionRef.current
        ) {
          return;
        }

        setAssistantState("idle");
      };

      setAssistantState("speaking");

      window.speechSynthesis.speak(
        utterance
      );
    },
    []
  );

  /* ======================================================= */
  /* ================== SEND TO AI ========================== */
  /* ======================================================= */

  const sendMessageToAI = useCallback(
    async (message: string) => {
      const cleanMessage = message.trim();

      if (!cleanMessage) {
        setAssistantState("idle");
        return;
      }

      if (requestInProgressRef.current) {
        return;
      }

      requestInProgressRef.current = true;

      setIsProcessing(true);
      setAssistantState("thinking");
      setAiResponse("");

      try {
        const response = await fetch(
          "/api/chat",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              message: cleanMessage,
              history: [],
            }),
          }
        );

        let data: any = null;

        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (!response.ok) {
          throw new Error(
            data?.error ||
              `AI request failed with status ${response.status}`
          );
        }

        const reply =
          typeof data?.reply === "string"
            ? data.reply.trim()
            : "";

        if (!reply) {
          throw new Error(
            "AI returned an empty response."
          );
        }

        console.log(
          "🤖 JS AI Response:",
          reply
        );

        setAiResponse(reply);

        /*
         * Speak the AI response.
         */
        speakResponse(reply);
      } catch (error) {
        console.error(
          "❌ Voice AI Error:",
          error
        );

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to get AI response.";

        setAiResponse(
          "Sorry, I couldn't process that request."
        );

        setAssistantState("idle");

        console.error(
          "AI error message:",
          errorMessage
        );
      } finally {
        setIsProcessing(false);
        requestInProgressRef.current =
          false;
      }
    },
    [speakResponse]
  );

  /* ======================================================= */
  /* ================= SPEECH SETUP ========================= */
  /* ======================================================= */

  useEffect(() => {
    if (!user) {
      return;
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);

    if (
      typeof window !== "undefined" &&
      !("speechSynthesis" in window)
    ) {
      setSpeechSynthesisSupported(false);
    }

    const recognition =
      new SpeechRecognitionAPI();

    recognition.continuous = false;
    recognition.interimResults = true;

    /*
     * Indian English.
     *
     * Chrome can recognize Bengali/Hindi
     * reasonably well when browser language
     * settings support them.
     */
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      console.log(
        "🎙️ Speech recognition started"
      );

      setAssistantState("listening");
    };

    recognition.onresult = (
      event: SpeechRecognitionEvent
    ) => {
      let finalText = "";
      let temporaryText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const result = event.results[i];

        const text =
          result[0]?.transcript || "";

        if (result.isFinal) {
          finalText += text;
        } else {
          temporaryText += text;
        }
      }

      if (finalText.trim()) {
        const newFinalText =
          finalText.trim();

        transcriptRef.current =
          newFinalText;

        setTranscript(
          newFinalText
        );
      }

      setInterimTranscript(
        temporaryText.trim()
      );
    };

    recognition.onerror = (
      event: SpeechRecognitionErrorEvent
    ) => {
      console.error(
        "🎙️ Speech recognition error:",
        event.error,
        event.message || ""
      );

      setInterimTranscript("");

      /*
       * "no-speech" is not treated as a fatal error.
       */
      if (
        event.error === "no-speech"
      ) {
        setAssistantState("idle");
        return;
      }

      if (
        event.error === "aborted"
      ) {
        return;
      }

      setAssistantState("idle");
    };

    recognition.onend = () => {
      console.log(
        "🎙️ Speech recognition ended"
      );

      const currentTranscript =
        transcriptRef.current.trim();

      /*
       * If there is a transcript,
       * send it to the AI.
       */
      if (
        currentTranscript &&
        !requestInProgressRef.current
      ) {
        sendMessageToAI(
          currentTranscript
        );

        return;
      }

      /*
       * No transcript means simply return
       * to idle state.
       */
      if (
        assistantStateRef.current ===
        "listening"
      ) {
        setAssistantState("idle");
      }
    };

    recognitionRef.current =
      recognition;

    return () => {
      try {
        recognition.abort();
      } catch {
        // Ignore cleanup errors
      }

      recognitionRef.current = null;
    };
  }, [user, sendMessageToAI]);

  /* ======================================================= */
  /* ================= CLEANUP ON UNMOUNT ================== */
  /* ======================================================= */

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.abort();
      } catch {
        // Ignore
      }

      if (
        typeof window !== "undefined" &&
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /* ======================================================= */
  /* ================= GOOGLE LOGIN ========================= */
  /* ======================================================= */

  const handleGoogleLogin = async () => {
    try {
      setSigningIn(true);

      const provider =
        new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      await signInWithPopup(
        auth,
        provider
      );
    } catch (error) {
      console.error(
        "Google Sign-In Error:",
        error
      );
    } finally {
      setSigningIn(false);
    }
  };

  /* ======================================================= */
  /* ================= MICROPHONE =========================== */
  /* ======================================================= */

  const handleMic = () => {
    if (!speechSupported) {
      alert(
        "Speech recognition is not supported in this browser. Please use Google Chrome."
      );

      return;
    }

    const recognition =
      recognitionRef.current;

    if (!recognition) {
      console.error(
        "Speech recognition is not initialized."
      );

      return;
    }

    /* ==================================================== */
    /* STOP SPEAKING */
    /* ==================================================== */

    if (
      assistantState === "speaking"
    ) {
      stopSpeaking();
      return;
    }

    /* ==================================================== */
    /* THINKING / PROCESSING */
    /* ==================================================== */

    if (
      assistantState === "thinking" ||
      isProcessing
    ) {
      return;
    }

    /* ==================================================== */
    /* STOP LISTENING MANUALLY */
    /* ==================================================== */

    if (
      assistantState === "listening"
    ) {
      try {
        recognition.stop();
      } catch {
        // Ignore
      }

      return;
    }

    /* ==================================================== */
    /* START LISTENING */
    /* ==================================================== */

    setTranscript("");
    transcriptRef.current = "";

    setInterimTranscript("");
    setAiResponse("");

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "Unable to start microphone:",
        error
      );
    }
  };

  /* ======================================================= */
  /* ================= AUTH CHECK =========================== */
  /* ======================================================= */

  if (checkingAuth) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-black">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Loader2 className="h-7 w-7 text-violet-400" />
        </motion.div>
      </div>
    );
  }

  /* ======================================================= */
  /* ================= GOOGLE SIGN IN SCREEN =============== */
  /* ======================================================= */

  if (!user) {
    return (
      <div
        className="
          relative
          flex
          min-h-[calc(100vh-80px)]
          items-center
          justify-center
          overflow-hidden
          bg-black
          px-5
        "
      >
        <motion.div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[420px]
            w-[420px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-violet-600/20
            blur-[120px]
          "
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            relative
            z-10
            w-full
            max-w-md
            rounded-3xl
            border
            border-violet-500/30
            bg-zinc-950/80
            p-8
            text-center
            shadow-[0_0_80px_rgba(139,92,246,0.15)]
            backdrop-blur-xl
          "
        >
          <div className="mb-7 flex justify-center">
            <Robot
              state="idle"
              size="large"
            />
          </div>

          <div className="mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
              JS AI
            </span>
          </div>

          <h1 className="text-3xl font-black text-white">
            Voice Assistant
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Talk naturally with your AI
            assistant using your voice.
          </p>

          <motion.button
            onClick={handleGoogleLogin}
            disabled={signingIn}
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="
              mt-8
              flex
              w-full
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-white
              px-5
              py-3.5
              text-sm
              font-bold
              text-black
              shadow-xl
              transition
              hover:bg-zinc-100
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {signingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Continue with Google
              </>
            )}
          </motion.button>

          <p className="mt-4 text-[11px] text-zinc-600">
            Sign in to start using JS AI
            Voice Assistant
          </p>
        </motion.div>
      </div>
    );
  }

  /* ======================================================= */
  /* ================= VOICE ASSISTANT SCREEN ============== */
  /* ======================================================= */

  return (
    <div
      className="
        relative
        flex
        min-h-[calc(100vh-80px)]
        flex-col
        overflow-hidden
        bg-black
      "
    >
      {/* ================================================= */}
      {/* BACKGROUND */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <motion.div
          className="
            absolute
            left-1/2
            top-[35%]
            h-[500px]
            w-[500px]
            -translate-x-1/2
            rounded-full
            bg-violet-600/15
            blur-[140px]
          "
          animate={{
            scale:
              assistantState ===
              "speaking"
                ? [1, 1.25, 1]
                : assistantState ===
                  "listening"
                ? [1, 1.15, 1]
                : [1, 1.08, 1],

            opacity:
              assistantState ===
              "speaking"
                ? [0.3, 0.6, 0.3]
                : [0.25, 0.4, 0.25],
          }}
          transition={{
            duration:
              assistantState ===
              "speaking"
                ? 1.2
                : 4,
            repeat: Infinity,
          }}
        />
      </div>

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-20
          flex
          items-center
          justify-between
          border-b
          border-white/5
          px-4
          py-4
          backdrop-blur-xl
        "
      >
        <button
          onClick={onBack}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-white/5
            text-zinc-300
            transition
            hover:bg-white/10
          "
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />

            <span className="text-sm font-bold text-white">
              JS AI
            </span>
          </div>

          <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Voice Assistant
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
        </div>
      </div>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10
          flex
          flex-1
          flex-col
          items-center
          justify-center
          px-5
          pb-8
          pt-6
        "
      >
        {/* Greeting */}

        <AnimatePresence mode="wait">
          <motion.div
            key={assistantState}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            className="mb-6 text-center"
          >
            <h2 className="text-lg font-bold text-white">
              {assistantState ===
                "idle" &&
                `Hi ${
                  user.displayName?.split(
                    " "
                  )[0] || "there"
                } 👋`}

              {assistantState ===
                "listening" &&
                "I'm listening..."}

              {assistantState ===
                "thinking" &&
                "Let me think..."}

              {assistantState ===
                "speaking" &&
                "JS AI is speaking..."}
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              {assistantState ===
                "idle" &&
                "Tap the microphone and start talking"}

              {assistantState ===
                "listening" &&
                "Speak naturally"}

              {assistantState ===
                "thinking" &&
                "Processing your request"}

              {assistantState ===
                "speaking" &&
                "Listen to your AI assistant"}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* ================================================= */}
        {/* ROBOT */}
        {/* ================================================= */}

        <Robot
          state={assistantState}
          size="large"
        />

        {/* ================================================= */}
        {/* TRANSCRIPT */}
        {/* ================================================= */}

        <AnimatePresence>
          {(transcript ||
            interimTranscript) && (
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="
                mt-6
                w-full
                max-w-lg
                rounded-2xl
                border
                border-violet-500/20
                bg-zinc-950/70
                px-5
                py-4
                text-center
                backdrop-blur-xl
              "
            >
              <p className="text-sm leading-relaxed text-zinc-300">
                {transcript}

                {interimTranscript && (
                  <span className="text-violet-400">
                    {" "}
                    {interimTranscript}
                  </span>
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================================================= */}
        {/* AI RESPONSE */}
        {/* ================================================= */}

        <AnimatePresence>
          {aiResponse &&
            assistantState !==
              "speaking" && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                className="
                  mt-4
                  w-full
                  max-w-lg
                  rounded-2xl
                  border
                  border-fuchsia-500/20
                  bg-zinc-950/70
                  px-5
                  py-4
                  text-center
                  backdrop-blur-xl
                "
              >
                <p className="text-sm leading-relaxed text-zinc-300">
                  {aiResponse}
                </p>
              </motion.div>
            )}
        </AnimatePresence>

        {/* ================================================= */}
        {/* WAVEFORM */}
        {/* ================================================= */}

        <div className="mt-8 h-10">
          {assistantState ===
            "listening" ||
          assistantState ===
            "speaking" ? (
            <div className="flex h-full items-center gap-1.5">
              {[
                1, 2, 3, 4, 5, 6,
                7, 8, 9,
              ].map((bar) => (
                <motion.div
                  key={bar}
                  className="w-1 rounded-full bg-violet-400"
                  animate={{
                    height: [
                      8,
                      28,
                      12,
                      32,
                      8,
                    ],
                  }}
                  transition={{
                    duration:
                      0.45 +
                      bar * 0.04,
                    repeat: Infinity,
                    repeatType:
                      "mirror",
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="h-10" />
          )}
        </div>

        {/* ================================================= */}
        {/* MIC BUTTON */}
        {/* ================================================= */}

        <div className="relative mt-6">
          {assistantState ===
            "listening" && (
            <>
              <motion.div
                className="
                  absolute
                  inset-[-20px]
                  rounded-full
                  border
                  border-violet-500/30
                "
                animate={{
                  scale: [
                    1, 1.25, 1,
                  ],
                  opacity: [
                    0.8, 0, 0.8,
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />

              <motion.div
                className="
                  absolute
                  inset-[-10px]
                  rounded-full
                  border
                  border-fuchsia-500/30
                "
                animate={{
                  scale: [
                    1, 1.15, 1,
                  ],
                  opacity: [
                    0.6, 0, 0.6,
                  ],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                }}
              />
            </>
          )}

          <motion.button
            onClick={handleMic}
            disabled={
              assistantState ===
              "thinking"
            }
            whileTap={{
              scale: 0.9,
            }}
            animate={{
              scale:
                assistantState ===
                "listening"
                  ? [1, 1.08, 1]
                  : 1,
            }}
            transition={{
              duration: 1,
              repeat:
                assistantState ===
                "listening"
                  ? Infinity
                  : 0,
            }}
            className={`
              relative
              z-10
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              border
              shadow-[0_0_40px_rgba(139,92,246,0.35)]
              transition-all
              duration-300

              ${
                assistantState ===
                "listening"
                  ? "border-violet-300 bg-violet-500"
                  : assistantState ===
                    "speaking"
                  ? "border-fuchsia-400 bg-fuchsia-500"
                  : assistantState ===
                    "thinking"
                  ? "border-violet-400/50 bg-violet-600/70"
                  : "border-violet-500/40 bg-gradient-to-br from-violet-600 to-fuchsia-600"
              }
            `}
          >
            {assistantState ===
            "thinking" ? (
              <Loader2 className="h-7 w-7 animate-spin text-white" />
            ) : assistantState ===
              "speaking" ? (
              <Volume2 className="h-8 w-8 text-white" />
            ) : assistantState ===
              "listening" ? (
              <MicOff className="h-8 w-8 text-white" />
            ) : (
              <Mic className="h-8 w-8 text-white" />
            )}
          </motion.button>
        </div>

        {/* ================================================= */}
        {/* STATUS */}
        {/* ================================================= */}

        <AnimatePresence mode="wait">
          <motion.div
            key={assistantState}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="mt-5"
          >
            <span className="text-xs font-medium text-zinc-500">
              {assistantState ===
                "idle" &&
                "Tap to speak"}

              {assistantState ===
                "listening" &&
                "Listening..."}

              {assistantState ===
                "thinking" &&
                "Thinking..."}

              {assistantState ===
                "speaking" &&
                "Speaking..."}
            </span>
          </motion.div>
        </AnimatePresence>

        {!speechSupported && (
          <p className="mt-3 text-center text-xs text-red-400">
            Speech recognition is not
            supported in this browser.
            Please use Google Chrome.
          </p>
        )}

        {!speechSynthesisSupported && (
          <p className="mt-3 text-center text-xs text-red-400">
            Text-to-speech is not
            supported in this browser.
          </p>
        )}
      </div>

      {/* ================================================= */}
      {/* USER INFO */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-20
          flex
          items-center
          justify-center
          gap-2
          border-t
          border-white/5
          px-4
          py-3
          text-[11px]
          text-zinc-600
        "
      >
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt=""
            className="h-5 w-5 rounded-full"
          />
        )}

        <span>
          {user.displayName ||
            user.email}
        </span>
      </div>
    </div>
  );
};

/* ========================================================= */
/* ======================= ROBOT ============================ */
/* ========================================================= */

interface RobotProps {
  state: AssistantState;
  size?: "small" | "large";
}

const Robot: React.FC<RobotProps> = ({
  state,
  size = "large",
}) => {
  const large = size === "large";

  return (
    <motion.div
      className={`
        relative
        flex
        items-center
        justify-center

        ${
          large
            ? "h-64 w-64"
            : "h-32 w-32"
        }
      `}
      animate={{
        y:
          state === "idle"
            ? [0, -5, 0]
            : state === "speaking"
            ? [0, -8, 0]
            : 0,
      }}
      transition={{
        duration:
          state === "speaking"
            ? 0.7
            : 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* ROBOT GLOW */}

      <motion.div
        className="
          absolute
          inset-4
          rounded-full
          bg-violet-600/20
          blur-3xl
        "
        animate={{
          scale:
            state === "speaking"
              ? [1, 1.3, 1]
              : state === "listening"
              ? [1, 1.15, 1]
              : 1,

          opacity:
            state === "speaking"
              ? [0.4, 0.8, 0.4]
              : [0.3, 0.5, 0.3],
        }}
        transition={{
          duration:
            state === "speaking"
              ? 0.8
              : 2,
          repeat: Infinity,
        }}
      />

      {/* ROBOT BODY */}

      <motion.div
        className="
          relative
          flex
          h-40
          w-40
          items-center
          justify-center
          rounded-[38%]
          border
          border-violet-400/40
          bg-gradient-to-br
          from-zinc-800
          via-zinc-950
          to-black
          shadow-[0_0_50px_rgba(139,92,246,0.3)]
        "
        animate={{
          boxShadow:
            state === "speaking"
              ? [
                  "0 0 35px rgba(139,92,246,0.25)",
                  "0 0 70px rgba(217,70,239,0.5)",
                  "0 0 35px rgba(139,92,246,0.25)",
                ]
              : "0 0 35px rgba(139,92,246,0.25)",
        }}
        transition={{
          duration: 0.8,
          repeat:
            state === "speaking"
              ? Infinity
              : 0,
        }}
      >
        {/* ANTENNA */}

        <div
          className="
            absolute
            -top-8
            left-1/2
            h-8
            w-0.5
            -translate-x-1/2
            bg-violet-500/50
          "
        />

        <motion.div
          className="
            absolute
            -top-10
            left-1/2
            h-3
            w-3
            -translate-x-1/2
            rounded-full
            bg-violet-400
            shadow-[0_0_15px_rgba(167,139,250,0.9)]
          "
          animate={{
            opacity:
              state === "listening"
                ? [0.4, 1, 0.4]
                : state === "speaking"
                ? [0.5, 1, 0.5]
                : 0.7,
          }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
          }}
        />

        {/* EYES */}

        <div className="absolute top-10 flex gap-8">
          <RobotEye state={state} />
          <RobotEye state={state} />
        </div>

        {/* MOUTH */}

        <motion.div
          className="
            absolute
            bottom-14
            left-1/2
            -translate-x-1/2
            overflow-hidden
            rounded-full
            border
            border-violet-400/40
            bg-black
          "
          animate={{
            width:
              state === "speaking"
                ? [
                    38,
                    46,
                    34,
                    50,
                    38,
                  ]
                : 38,

            height:
              state === "speaking"
                ? [
                    10,
                    18,
                    12,
                    20,
                    10,
                  ]
                : 10,
          }}
          transition={{
            duration: 0.55,
            repeat:
              state === "speaking"
                ? Infinity
                : 0,
          }}
        >
          {state === "speaking" && (
            <motion.div
              className="
                absolute
                bottom-0.5
                left-1/2
                h-1.5
                w-5
                -translate-x-1/2
                rounded-full
                bg-fuchsia-400
              "
              animate={{
                scaleX: [
                  0.5,
                  1,
                  0.6,
                  1,
                ],
              }}
              transition={{
                duration: 0.4,
                repeat: Infinity,
              }}
            />
          )}
        </motion.div>

        {/* CHEST BRANDING */}

        <motion.div
          className="
            absolute
            bottom-[-18px]
            left-1/2
            flex
            -translate-x-1/2
            items-center
            justify-center
            rounded-lg
            border
            border-violet-400/40
            bg-black/90
            px-3
            py-1.5
            shadow-[0_0_20px_rgba(139,92,246,0.25)]
            backdrop-blur-md
          "
          animate={{
            borderColor:
              state === "speaking"
                ? [
                    "rgba(167,139,250,0.4)",
                    "rgba(232,121,249,0.9)",
                    "rgba(167,139,250,0.4)",
                  ]
                : "rgba(167,139,250,0.4)",

            boxShadow:
              state === "speaking"
                ? [
                    "0 0 15px rgba(139,92,246,0.25)",
                    "0 0 30px rgba(217,70,239,0.55)",
                    "0 0 15px rgba(139,92,246,0.25)",
                  ]
                : "0 0 15px rgba(139,92,246,0.25)",
          }}
          transition={{
            duration: 0.8,
            repeat:
              state === "speaking"
                ? Infinity
                : 0,
          }}
        >
          <span
            className="
              whitespace-nowrap
              text-[8px]
              font-black
              tracking-[0.16em]
              text-violet-300
            "
          >
            JS AI ASSISTANT
          </span>
        </motion.div>

        {/* FACE HIGHLIGHT */}

        <div
          className="
            absolute
            left-5
            top-5
            h-8
            w-8
            rounded-full
            bg-white/5
            blur-md
          "
        />
      </motion.div>

      {/* NECK */}

      <div
        className="
          absolute
          bottom-5
          h-5
          w-12
          rounded-b-xl
          bg-zinc-900
        "
      />
    </motion.div>
  );
};

/* ========================================================= */
/* ====================== ROBOT EYE ======================== */
/* ========================================================= */

const RobotEye: React.FC<{
  state: AssistantState;
}> = ({ state }) => {
  return (
    <motion.div
      className="
        relative
        h-7
        w-7
        rounded-full
        bg-violet-400
        shadow-[0_0_18px_rgba(167,139,250,0.9)]
      "
      animate={{
        scale:
          state === "speaking"
            ? [1, 0.8, 1]
            : state === "listening"
            ? [1, 1.12, 1]
            : 1,

        opacity:
          state === "thinking"
            ? [0.4, 1, 0.4]
            : 1,
      }}
      transition={{
        duration:
          state === "speaking"
            ? 0.5
            : 1,
        repeat: Infinity,
      }}
    >
      <div
        className="
          absolute
          left-1.5
          top-1.5
          h-2
          w-2
          rounded-full
          bg-white/80
        "
      />
    </motion.div>
  );
};

export default JSVoiceAssistant;