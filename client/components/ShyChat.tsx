import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, X, Maximize2, Minimize2, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

interface Message {
  role: "user" | "bot";
  text: string;
}

// Helper to create a new session ID
const createNewSessionId = () => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).slice(2, 8);
  return `shy-${timestamp}-${randomString}`;
};

const ALL_LOCATIONS = [
  "On-Campus",
  "Sunway",
  "Subang Jaya",
  "Shah Alam",
  "Puchong",
  "Petaling Jaya (PJ)",
  "Kuala Lumpur (KL)",
];

const QUICK_QUESTIONS = [
  "What can you do?",
  "I had unprotected sex",
  "I need help with STI testing",
  "How can I prevent pregnancy?",
  "What are the symptoms of common STIs?"
];

export default function ShyChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [gender, setGender] = useState<string | null>(
    localStorage.getItem("shy_gender") || null
  );
  const [locationOptions, setLocationOptions] = useState<string[] | null>(null);
  const [chatEnded, setChatEnded] = useState(false);
  const [handoffStatus, setHandoffStatus] = useState<"idle" | "pending" | "accepted" | "declined">("idle");
  const [peerAdvocateId, setPeerAdvocateId] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSessionId = searchParams.get("sessionId");

  const sessionIdRef = useRef(urlSessionId || createNewSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const genderQuestionShownRef = useRef(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize messages on mount
  useEffect(() => {
    if (urlSessionId) {
      // If sessionId is provided in URL, fetch existing messages
      sessionIdRef.current = urlSessionId;
      setIsOpen(true); // Open chat automatically

      const messagesUrl = user?.id ? `/api/chat/${urlSessionId}/messages?userId=${user.id}` : `/api/chat/${urlSessionId}/messages`;
      fetch(messagesUrl)
        .then(res => res.json())
        .then(data => {
          if (data.ok && data.messages.length > 0) {
            // Transform backend messages to frontend format
            const history: Message[] = data.messages.map((msg: any) => ({
              role: msg.role === "agent" ? "bot" : "user",
              text: msg.content
            }));
            setMessages(history);
          } else {
            showWelcomeMessage();
          }
        })
        .catch(err => {
          console.error("Failed to fetch chat history:", err);
          showWelcomeMessage();
        });
    } else {
      showWelcomeMessage();
    }

    if (gender === null) {
      genderQuestionShownRef.current = true;
    }
  }, [urlSessionId, user?.id]);

  // Poll for handoff status
  useEffect(() => {
    if (handoffStatus === "pending") {
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/chat/handoff/status/${sessionIdRef.current}`);
          const data = await res.json();

          if (data.ok && data.status === "active_peer") {
            setHandoffStatus("accepted");
            setPeerAdvocateId(data.peerAdvocateId);
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

            setMessages(m => [...m, {
              role: "bot",
              text: "You have been connected to a Peer Advocate. Redirecting you to the dashboard..."
            }]);

            setTimeout(() => {
              setIsOpen(false);
              navigate(`/dashboard?sessionId=${sessionIdRef.current}&tab=peer`);
            }, 2000);
          }
        } catch (error) {
          console.error("Error polling handoff status:", error);
        }
      }, 3000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [handoffStatus, navigate]);

  const showWelcomeMessage = () => {
    const welcomeMessage: Message = {
      role: "bot",
      text: "Hey there! 👋 I'm SHYBot, your confidential health companion. I'm here to help answer any questions you have openly, safely, and without judgment. To keep things safe and relevant, may I know your name and your gender identity (male, female, or prefer not to say)? You can share only what you're comfortable with.",
    };
    setMessages([welcomeMessage]);
  };

  // Show greeting immediately when chat opens if messages are empty
  useEffect(() => {
    if (isOpen && !genderQuestionShownRef.current && messages.length === 0) {
      const welcomeMessage: Message = {
        role: "bot",
        text: "Hey there! 👋 I'm SHYBot, your confidential health companion. I'm here to help answer any questions you have openly, safely, and without judgment. To keep things safe and relevant, may I know your name and your gender identity (male, female, or prefer not to say)? You can share only what you're comfortable with.",
      };
      setMessages([welcomeMessage]);
      genderQuestionShownRef.current = true;
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle gender selection from buttons
  const handleGenderSelect = (selectedGender: "male" | "female") => {
    setGender(selectedGender);
    localStorage.setItem("shy_gender", selectedGender);

    // Add user message showing their selection
    const userMessage: Message = {
      role: "user",
      text: selectedGender === "male" ? "Male" : "Female",
    };
    setMessages((m) => [...m, userMessage]);

    // Add confirmation message
    const confirmationMessage: Message = {
      role: "bot",
      text: "Thank you! I'll keep that in mind as we chat. How can I help you now?",
    };
    setMessages((m) => [...m, confirmationMessage]);
  };

  // Helper function to detect gender from user message
  function detectGender(text: string): "male" | "female" | null {
    const cleaned = text.toLowerCase().trim();

    // Check female first to avoid the "male inside female" problem
    if (
      cleaned === "female" ||
      cleaned === "girl" ||
      cleaned === "woman" ||
      cleaned.includes("i am female") ||
      cleaned.includes("i'm female") ||
      cleaned.includes("i am a girl") ||
      cleaned.includes("i'm a girl") ||
      cleaned.includes("i am a woman") ||
      cleaned.includes("i'm a woman") ||
      cleaned.includes("female")
    ) {
      return "female";
    }

    // Check male second
    if (
      cleaned === "male" ||
      cleaned === "boy" ||
      cleaned === "man" ||
      cleaned.includes("i am male") ||
      cleaned.includes("i'm male") ||
      cleaned.includes("i am a boy") ||
      cleaned.includes("i'm a boy") ||
      cleaned.includes("i am a man") ||
      cleaned.includes("i'm a man") ||
      cleaned.includes("male")
    ) {
      return "male";
    }

    return null;
  }

  const handleSendMessage = async () => {
    const text = inputMessage.trim();
    if (!text || chatEnded) return;

    setMessages((m) => [...m, { role: "user", text }]);
    setInputMessage("");

    // If gender is not set, try to detect it from the message
    if (!gender) {
      const detected = detectGender(text);

      if (detected) {
        setGender(detected);
        localStorage.setItem("shy_gender", detected);

        const confirmationMessage: Message = {
          role: "bot",
          text: "Thank you! I'll keep that in mind as we chat. How can I help you now?",
        };
        setMessages((m) => [...m, confirmationMessage]);

        return; // Do NOT send to backend
      }

      // If still not detected, just ask again politely
      const reminderMessage: Message = {
        role: "bot",
        text: "Just to answer safely — are you **male** or **female**?",
      };
      setMessages((m) => [...m, reminderMessage]);
      return;
    }

    setIsTyping(true);
    console.log("sending to /api/chat:", text);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          message: text,
          action: "sendMessage",
          userMeta: {
            locale: navigator.language,
            gender: gender,
            userId: user?.id,
          },
        }),
      });

      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't generate a reply.";

      // Check if bot is asking for location
      const lower = reply.toLowerCase();
      const isLocationPrompt =
        lower.includes("choose your area") ||
        lower.includes("which area are you staying") ||
        lower.includes("where are you staying");

      if (isLocationPrompt) {
        setLocationOptions(ALL_LOCATIONS);
      } else {
        setLocationOptions(null);
      }

      setMessages((m) => [
        ...m,
        { role: "bot", text: reply },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Network error. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLocationClick = async (option: string) => {
    setMessages((m) => [...m, { role: "user", text: option }]);
    setLocationOptions(null);

    const normalized =
      option.toLowerCase().includes("campus")
        ? "campus"
        : option.toLowerCase().includes("sunway")
          ? "sunway"
          : option.toLowerCase().includes("subang")
            ? "subang jaya"
            : option.toLowerCase().includes("shah alam")
              ? "shah alam"
              : option.toLowerCase().includes("puchong")
                ? "puchong"
                : option.toLowerCase().includes("petaling jaya")
                  ? "pj"
                  : "kl";

    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          message: `Location selected: ${option}`,
          action: "chooseLocation",
          location: normalized,
          userMeta: {
            locale: navigator.language,
            gender: gender,
            userId: user?.id,
          },
        }),
      });

      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't generate a reply.";

      const lower = reply.toLowerCase();
      const isLocationPrompt =
        lower.includes("choose your area") ||
        lower.includes("which area are you staying") ||
        lower.includes("where are you staying");

      if (isLocationPrompt) {
        setLocationOptions(ALL_LOCATIONS);
      } else {
        setLocationOptions(null);
      }

      setMessages((m) => [
        ...m,
        { role: "bot", text: reply },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Network error. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEndChat = () => {
    if (chatEnded) return;

    const farewellMessage: Message = {
      role: "bot",
      text: "Thank you for reaching out to SHY Support 💚\n\n" +
        "Remember: this chat does not replace a doctor or emergency service. " +
        "If you feel very unwell, unsafe, or in immediate danger, please contact a trusted adult, " +
        "campus security, or the nearest clinic/emergency department.\n\n" +
        "You can start a **new chat** anytime if you have more questions.",
    };
    setMessages((m) => [...m, farewellMessage]);
    setChatEnded(true);
  };

  const handleStartNewChat = () => {
    setMessages([]);
    setChatEnded(false);
    setLocationOptions(null);
    setInputMessage("");
    setGender(null);
    localStorage.removeItem("shy_gender");
    genderQuestionShownRef.current = false;

    const newId = createNewSessionId();
    sessionIdRef.current = newId;

    if (urlSessionId) {
      setSearchParams({});
    }

    const welcomeMessage: Message = {
      role: "bot",
      text: "Hey there! 👋 I'm SHYBot, your confidential health companion. I'm here to help answer any questions you have openly, safely, and without judgment. To keep things safe and relevant, may I know your name and your gender identity (male, female, or prefer not to say)? You can share only what you're comfortable with.",
    };
    setMessages([welcomeMessage]);
  };

  const handleQuickQuestionClick = (text: string) => {
    setInputMessage("");
    setMessages((m) => [...m, { role: "user", text }]);

    if (!gender) {
      const detected = detectGender(text);

      if (detected) {
        setGender(detected);
        localStorage.setItem("shy_gender", detected);

        const confirmationMessage: Message = {
          role: "bot",
          text: "Thank you! I'll keep that in mind as we chat. How can I help you now?",
        };
        setMessages((m) => [...m, confirmationMessage]);
        return;
      }

      const reminderMessage: Message = {
        role: "bot",
        text: "Just to answer safely — are you **male** or **female**?",
      };
      setMessages((m) => [...m, reminderMessage]);
      return;
    }

    setIsTyping(true);

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: sessionIdRef.current,
        message: text,
        action: "sendMessage",
        userMeta: {
          locale: navigator.language,
          gender: gender,
          userId: user?.id,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const reply = data.reply || "Sorry, I couldn't generate a reply.";

        const lower = reply.toLowerCase();
        const isLocationPrompt =
          lower.includes("choose your area") ||
          lower.includes("which area are you staying") ||
          lower.includes("where are you staying");

        if (isLocationPrompt) {
          setLocationOptions(ALL_LOCATIONS);
        } else {
          setLocationOptions(null);
        }

        setMessages((m) => [
          ...m,
          { role: "bot", text: reply },
        ]);
      })
      .catch((err) => {
        setMessages((m) => [
          ...m,
          { role: "bot", text: "Network error. Please try again." },
        ]);
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  const handleRequestHandoff = async () => {
    if (handoffStatus === "pending" || handoffStatus === "accepted") return;

    try {
      const res = await fetch("/api/chat/handoff/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionIdRef.current }),
      });

      const data = await res.json();
      if (data.ok) {
        setHandoffStatus("pending");
        setMessages(m => [...m, {
          role: "bot",
          text: "I'm looking for an available Peer Advocate to chat with you. Please wait a moment..."
        }]);
      } else {
        setMessages(m => [...m, {
          role: "bot",
          text: "Sorry, I couldn't request a handoff at this time. Please try again later."
        }]);
      }
    } catch (error) {
      console.error("Error requesting handoff:", error);
      setMessages(m => [...m, {
        role: "bot",
        text: "Network error. Please try again."
      }]);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed ${isMinimized ? 'bottom-4 right-4 sm:right-6 h-auto' : 'bottom-20 right-4 sm:right-6'} ${isExpanded ? 'w-[calc(100vw-2rem)] sm:w-[800px] max-w-[800px] h-[calc(100vh-8rem)]' : 'w-[calc(100vw-2rem)] sm:w-[600px] max-w-[600px] h-[500px]'} bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-teal-200 animate-in slide-in-from-bottom-5 duration-300`}>
          {/* Header */}
          <div className={`bg-gradient-to-r from-teal-500 to-cyan-500 p-4 ${isMinimized ? 'rounded-2xl' : 'rounded-t-2xl'} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full p-1.5 flex items-center justify-center shadow-md">
                <img
                  src="/tuki_logo.png"
                  alt="SHY Bot"
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <MessageCircle className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">
                  {handoffStatus === "accepted" ? "Peer Advocate" : "SHY Bot"}
                </h3>
                <p className="text-white/80 text-xs">
                  {handoffStatus === "accepted" ? "Human Support" : "Sexual Health for Youth"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isMinimized && (
                <>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                    aria-label={isExpanded ? "Collapse chat" : "Expand chat"}
                  >
                    {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                  </button>
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                    aria-label="Minimize chat"
                  >
                    <ChevronDown size={20} />
                  </button>
                </>
              )}
              {isMinimized && (
                <button
                  onClick={() => setIsMinimized(false)}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                  aria-label="Restore chat"
                >
                  <ChevronUp size={20} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          {!isMinimized && (
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-2">
              {!user && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-xs text-yellow-800 flex items-start gap-2">
                  <div className="mt-0.5">⚠️</div>
                  <div>
                    <strong>Note:</strong> You are chatting anonymously.
                    <a href="/login" className="underline ml-1 font-medium hover:text-yellow-900">Log in</a> to save your chat history.
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div key={index}>
                  <div
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user"
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-br-sm"
                        : "bg-white border border-teal-100 text-gray-800 rounded-bl-sm shadow-sm"
                        }`}
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      <div className="text-sm leading-tight">
                        {message.role === "bot" ? (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-0 last:mb-0">{children}</p>,
                              ul: ({ children }) => <ul className="mb-0 last:mb-0">{children}</ul>,
                              ol: ({ children }) => <ol className="mb-0 last:mb-0">{children}</ol>,
                              li: ({ children }) => <li className="mb-0 last:mb-0">{children}</li>,
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        ) : (
                          message.text
                        )}
                      </div>
                    </div>
                  </div>
                  {message.role === "bot" &&
                    index === 0 &&
                    !gender &&
                    message.text.includes("SHYBot") && (
                      <div className="flex justify-start mt-2 mb-2 gap-2">
                        <button
                          onClick={() => handleGenderSelect("male")}
                          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all hover:scale-105"
                        >
                          Male
                        </button>
                        <button
                          onClick={() => handleGenderSelect("female")}
                          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all hover:scale-105"
                        >
                          Female
                        </button>
                      </div>
                    )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-teal-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-500">typing</span>
                      <div className="flex gap-1 ml-1">
                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Location Options */}
          {!isMinimized && locationOptions && !chatEnded && (
            <div className="px-4 pt-2 pb-2 bg-white border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {locationOptions.map((option) => (
                  <button
                    key={option}
                    className="px-3 py-1 rounded-full border text-sm hover:bg-teal-50"
                    onClick={() => handleLocationClick(option)}
                    disabled={isTyping}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Question Buttons */}
          {!isMinimized && messages.length <= 3 && gender && !chatEnded && (
            <div className="px-4 pt-2 pb-2 bg-white border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className="px-3 py-1 rounded-full border border-teal-200 text-xs md:text-sm hover:bg-teal-50 transition-colors text-gray-700"
                    onClick={() => handleQuickQuestionClick(q)}
                    disabled={isTyping}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          {!isMinimized && (
            <div className="p-4 bg-white rounded-b-2xl border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={chatEnded ? "Chat has ended" : "Type your message..."}
                  disabled={isTyping || chatEnded}
                  className="flex-1 px-4 py-3 rounded-full border border-teal-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 bg-gray-50 text-sm placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping || chatEnded}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
              <div className="mt-2 flex justify-between items-center gap-2">
                {chatEnded ? (
                  <>
                    <button
                      type="button"
                      className="text-xs md:text-sm px-3 py-1 rounded-full border border-teal-500 text-teal-600 hover:bg-teal-50 transition"
                      onClick={handleStartNewChat}
                    >
                      Start new chat
                    </button>
                    <button
                      type="button"
                      className="text-xs md:text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="text-xs md:text-sm px-3 py-1 rounded-full border border-purple-500 text-purple-600 hover:bg-purple-50 transition flex items-center gap-1"
                      onClick={handleRequestHandoff}
                      disabled={handoffStatus === "pending" || handoffStatus === "accepted"}
                    >
                      {handoffStatus === "pending" ? "Waiting for Human..." : handoffStatus === "accepted" ? "Chatting with Human" : "Talk to Human"}
                    </button>
                    <button
                      type="button"
                      className="ml-auto text-xs md:text-sm px-3 py-1 rounded-full border border-teal-500 text-teal-600 hover:bg-teal-50 transition"
                      onClick={handleEndChat}
                    >
                      End chat
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Chat Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 z-50 flex items-center justify-center group hover:scale-110 ${isOpen ? "scale-0" : "scale-100"
          }`}
        aria-label="Open chat"
      >
        <div className="relative">
          <img
            src="/tuki_logo.png"
            alt="Chat with SHY Bot"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const icon = document.createElement('div');
              icon.innerHTML = '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>';
              e.currentTarget.parentElement?.appendChild(icon.firstElementChild!);
            }}
          />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </div>
      </button>
    </>
  );
}
