import { useState, useRef, useEffect } from "react";
import { X, Send, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm here to help you with any questions about sexual health. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const sessionIdRef = useRef<string>(Date.now().toString());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    const text = messageText.trim();
    if (!text || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    console.log("sending to /api/chat:", text);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          message: text, // 👈 plain string
          userMeta: { locale: navigator.language },
        }),
      });

      const data = await res.json();
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "Sorry, I couldn't generate a reply.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Network error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const message = inputMessage;
    setInputMessage("");
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[450px] max-w-[450px] h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-[#4BB5B9]/20 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4BB5B9] to-[#14B3B9] p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full p-1 flex items-center justify-center shadow-md">
                <img
                  src="/tuki_logo.png"
                  alt="SHY Chatbot"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">SHY Support</h3>
                <p className="text-white/80 text-xs">Here to help</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <Minimize2 size={20} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#F1FBFA] space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-[#4BB5B9] to-[#14B3B9] text-white rounded-br-sm"
                      : "bg-white border border-[#4BB5B9]/20 text-[#0A3F53] rounded-bl-sm shadow-sm"
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  <div className="text-sm leading-relaxed">
                    {message.sender === "bot" ? (
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    ) : (
                      message.text
                    )}
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user" ? "text-white/70" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#4BB5B9]/20 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#4BB5B9] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-[#4BB5B9] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-[#4BB5B9] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 bg-white border-t border-gray-100">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => sendMessage("I need help with STI testing")}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs bg-[#4BB5B9]/10 text-[#017F8D] rounded-full hover:bg-[#4BB5B9]/20 transition-colors whitespace-nowrap border border-[#4BB5B9]/30 disabled:opacity-50"
              >
                STI Testing
              </button>
              <button
                onClick={() => sendMessage("Tell me about contraception")}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs bg-[#4BB5B9]/10 text-[#017F8D] rounded-full hover:bg-[#4BB5B9]/20 transition-colors whitespace-nowrap border border-[#4BB5B9]/30 disabled:opacity-50"
              >
                Contraception
              </button>
              <button
                onClick={() => sendMessage("Find a clinic near me")}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs bg-[#4BB5B9]/10 text-[#017F8D] rounded-full hover:bg-[#4BB5B9]/20 transition-colors whitespace-nowrap border border-[#4BB5B9]/30 disabled:opacity-50"
              >
                Find Clinic
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white rounded-b-2xl border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 rounded-full border border-[#4BB5B9]/30 focus:outline-none focus:border-[#4BB5B9] focus:ring-2 focus:ring-[#4BB5B9]/20 bg-[#F1FBFA] text-sm placeholder:text-gray-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-[#4BB5B9] to-[#14B3B9] text-white p-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#4BB5B9] to-[#14B3B9] rounded-full shadow-2xl hover:shadow-[#4BB5B9]/50 transition-all duration-300 z-50 flex items-center justify-center group hover:scale-110 ${
          isOpen ? "scale-0" : "scale-100"
        }`}
        aria-label="Open chat"
      >
        <div className="relative">
          <img
            src="/tuki_logo.png"
            alt="Chat with us"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
          />
          {/* Pulse animation */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </div>
      </button>
    </>
  );
}

