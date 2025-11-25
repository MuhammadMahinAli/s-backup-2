import { useState, useEffect, useRef } from "react";
import { MessageSquare, User, Bot, Users, Clock, CheckCircle, XCircle, ArrowRight, Send } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../../lib/AuthContext";

// Type definitions
type ChatSession = {
    _id: string;
    sessionId: string;
    type: "agent" | "peer";
    status: "open" | "closed" | "handoff_pending" | "active_peer";
    lastMessageAt?: string;
    peerAdvocateId?: string;
    peerAdvocateName?: string;
    createdAt: string;
    updatedAt: string;
};

type ChatMessage = {
    _id: string;
    sessionId: string;
    userId?: string;
    peerAdvocateId?: string;
    role: "user" | "agent" | "peer";
    source: "agent" | "peer";
    content: string;
    createdAt: string;
    readAt?: string;
};

export default function UserChats() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user?.id;
    const [searchParams] = useSearchParams();
    const urlSessionId = searchParams.get("sessionId");
    const urlTab = searchParams.get("tab");

    // Sessions state
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [errorSessions, setErrorSessions] = useState<string | null>(null);

    // UI state
    const [activeTab, setActiveTab] = useState<"agent" | "peer">("agent");
    const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);

    // Messages state
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [errorMessages, setErrorMessages] = useState<string | null>(null);
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [endingChat, setEndingChat] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch sessions on mount or when userId changes
    useEffect(() => {
        if (!userId) return;
        const fetchSessions = async () => {
            setLoadingSessions(true);
            setErrorSessions(null);
            try {
                const res = await fetch(`/api/chat/sessions?userId=${userId}`);
                const data = await res.json();
                if (data.ok) {
                    setSessions(data.sessions || []);
                    if (urlTab === "peer" || urlTab === "agent") {
                        setActiveTab(urlTab);
                    }
                } else {
                    setErrorSessions(data.error || "Failed to fetch sessions");
                }
            } catch (e) {
                console.error("Error fetching sessions", e);
                setErrorSessions("Network error");
            } finally {
                setLoadingSessions(false);
            }
        };
        fetchSessions();
    }, [userId, urlTab]);

    // Auto‑select session from URL if provided
    useEffect(() => {
        if (urlSessionId && sessions.length) {
            const sess = sessions.find((s) => s.sessionId === urlSessionId);
            if (sess) {
                handleViewChat(sess);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessions, urlSessionId]);

    const fetchMessages = async (session: ChatSession, isInitial = false) => {
        if (isInitial) {
            setLoadingMessages(true);
        }
        setErrorMessages(null);
        try {
            const res = await fetch(`/api/chat/${session.sessionId}/messages?userId=${userId}`);
            const data = await res.json();
            if (data.ok) {
                setMessages(data.messages || []);
            } else {
                setErrorMessages(data.error || "Failed to fetch messages");
            }
        } catch (e) {
            console.error("Error fetching messages", e);
            setErrorMessages("Network error");
        } finally {
            if (isInitial) {
                setLoadingMessages(false);
                setIsInitialLoad(false);
            }
        }
    };

    const handleViewChat = (session: ChatSession) => {
        setSelectedSession(session);
        setIsInitialLoad(true);
        fetchMessages(session, true);
    };

    // Poll for new messages when a session is active
    useEffect(() => {
        if (!selectedSession) return;
        const interval = setInterval(() => {
            fetchMessages(selectedSession, false);
        }, 3000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSession]);

    // Auto‑scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        const text = inputMessage.trim();
        if (!text || !selectedSession) return;
        setIsTyping(true);
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId: selectedSession.sessionId,
                    message: text,
                    action: "sendMessage",
                    userMeta: { locale: navigator.language, userId: user?.id },
                }),
            });
            const data = await res.json();
            if (data.ok) {
                // Optimistic UI update
                setMessages((m) => [...m, { _id: Date.now().toString(), sessionId: selectedSession.sessionId, role: "user", source: "agent", content: text, createdAt: new Date().toISOString() }]);
                setInputMessage("");
            } else {
                console.error("Send message error", data.error);
            }
        } catch (e) {
            console.error("Send message exception", e);
        } finally {
            setIsTyping(false);
        }
    };

    const formatTimestamp = (ts?: string) => {
        if (!ts) return "";
        const date = new Date(ts);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(diff / 3600000);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(diff / 86400000);
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    // Filter sessions by active tab
    const filteredSessions = sessions.filter((s) => s.type === activeTab);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">My Chats</h2>
                <p className="text-gray-600">View and manage your conversations with SHY agents and peer advocates</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab("agent")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "agent" ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md" : "bg-white text-gray-700 border border-gray-200 hover:border-teal-300"}`}
                >
                    <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5" />
                        <span>Agent Chats</span>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab("peer")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "peer" ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md" : "bg-white text-gray-700 border border-gray-200 hover:border-teal-300"}`}
                >
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span>Peer Advocate Chats</span>
                    </div>
                </button>
            </div>

            {/* Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sessions list */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-[600px] flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {activeTab === "agent" ? "Agent Conversations" : "Peer Advocate Conversations"}
                    </h3>
                    {loadingSessions && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-gray-600">Loading sessions...</p>
                            </div>
                        </div>
                    )}
                    {errorSessions && !loadingSessions && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <p className="text-red-600 mb-4">{errorSessions}</p>
                                <button onClick={() => { }} className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition">
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}
                    {!loadingSessions && !errorSessions && filteredSessions.length === 0 && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center px-4">
                                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600 mb-2">No chats yet in this category</p>
                                <p className="text-sm text-gray-500">When you talk to the SHY agent or a peer advocate, your conversations will appear here.</p>
                            </div>
                        </div>
                    )}
                    {!loadingSessions && !errorSessions && filteredSessions.length > 0 && (
                        <div className="flex-1 overflow-y-auto space-y-3">
                            {filteredSessions.map((session) => (
                                <div
                                    key={session._id}
                                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${selectedSession?.sessionId === session.sessionId ? "border-teal-500 bg-teal-50" : "border-gray-200 bg-white hover:border-teal-300"}`}
                                    onClick={() => handleViewChat(session)}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {session.type === "agent" ? (
                                                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full flex items-center justify-center">
                                                    <Bot className="w-4 h-4 text-white" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                                    <Users className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">
                                                    {session.type === "agent" ? "SHY Agent" : session.peerAdvocateName || "Peer Advocate"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {session.type === "agent" ? "AI Assistant" : "Human Support"}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${session.status === "active_peer" || session.status === "open"
                                                ? "bg-green-100 text-green-700"
                                                : session.status === "closed"
                                                    ? "bg-gray-100 text-gray-600"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {session.status === "active_peer" || session.status === "open"
                                                ? "Open"
                                                : session.status === "closed"
                                                    ? "Closed"
                                                    : "Pending"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                        <Clock className="w-3 h-3" />
                                        <span>{formatTimestamp(session.lastMessageAt || session.createdAt)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Chat view */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-[600px] flex flex-col">
                    {!selectedSession ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600">Select a chat to view messages</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="border-b border-gray-200 pb-4 mb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            {selectedSession.type === "agent" ? "SHY Agent Conversation" : `Chat with ${selectedSession.peerAdvocateName || "Peer Advocate"}`}
                                        </h3>
                                        <p className="text-sm text-gray-500">Started {formatTimestamp(selectedSession.createdAt)}</p>
                                    </div>
                                    {/* End Chat Button for Peer Advocate Chats */}
                                    {selectedSession.type === "peer" && selectedSession.status === "active_peer" && (
                                        <button
                                            onClick={async () => {
                                                if (confirm("Are you sure you want to end this chat?")) {
                                                    setEndingChat(true);
                                                    try {
                                                        const res = await fetch("/api/chat/handoff/end", {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ sessionId: selectedSession.sessionId, userId: user?.id })
                                                        });
                                                        const data = await res.json();
                                                        if (data.ok) {
                                                            // Update the session status locally
                                                            setSelectedSession({ ...selectedSession, status: "closed" });
                                                            setSessions(sessions.map(s =>
                                                                s.sessionId === selectedSession.sessionId
                                                                    ? { ...s, status: "closed" }
                                                                    : s
                                                            ));
                                                        } else {
                                                            alert("Failed to end chat: " + data.error);
                                                        }
                                                    } catch (err) {
                                                        console.error("Error ending chat:", err);
                                                        alert("Network error");
                                                    } finally {
                                                        setEndingChat(false);
                                                    }
                                                }
                                            }}
                                            disabled={endingChat}
                                            className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-2"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            {endingChat ? "Ending..." : "End Chat"}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Messages */}
                            {loadingMessages ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-gray-600">Loading messages...</p>
                                    </div>
                                </div>
                            ) : errorMessages ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                        <p className="text-red-600">{errorMessages}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                                    {messages.map((msg) => {
                                        const isUser = msg.role === "user";
                                        const isAgent = msg.role === "agent" && msg.source === "agent";
                                        const isPeer = msg.role === "peer" && msg.source === "peer";
                                        return (
                                            <div key={msg._id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                                                <div className={`max-w-[80%] ${isUser ? "order-2" : "order-1"}`}>
                                                    <div className={`flex items-center gap-2 mb-1 ${isUser ? "justify-end" : "justify-start"}`}>
                                                        {!isUser && (
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isAgent ? "bg-teal-500" : "bg-purple-500"}`}>
                                                                {isAgent ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                                                            </div>
                                                        )}
                                                        <span className="text-xs font-medium text-gray-600">{isUser ? "You" : isAgent ? "SHY" : "Peer"}</span>
                                                    </div>
                                                    <div className={`rounded-2xl px-4 py-3 ${isUser ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-br-sm" : isAgent ? "bg-white border border-teal-100 text-gray-800 rounded-bl-sm shadow-sm" : "bg-purple-50 border border-purple-200 text-gray-800 rounded-bl-sm"}`}>
                                                        <div className="text-sm leading-relaxed">
                                                            {isAgent ? (
                                                                <ReactMarkdown components={{
                                                                    p: ({ children }) => <p className="mb-0 last:mb-0">{children}</p>,
                                                                    ul: ({ children }) => <ul className="mb-0 last:mb-0 list-disc pl-4">{children}</ul>,
                                                                    ol: ({ children }) => <ol className="mb-0 last:mb-0 list-decimal pl-4">{children}</ol>,
                                                                    li: ({ children }) => <li className="mb-0 last:mb-0">{children}</li>,
                                                                }}>
                                                                    {msg.content}
                                                                </ReactMarkdown>
                                                            ) : (
                                                                msg.content
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${isUser ? "justify-end" : "justify-start"}`}>
                                                        <Clock className="w-3 h-3" />
                                                        <span>{formatTimestamp(msg.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}

                            {/* Input area */}
                            <div className="p-4 bg-white rounded-b-2xl border-t border-gray-100">
                                {selectedSession.status === "closed" ? (
                                    <div className="text-center py-3 text-gray-500 text-sm bg-gray-50 rounded-lg">
                                        This chat has been closed. No further messages can be sent.
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            onKeyPress={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                            placeholder="Type your message..."
                                            disabled={isTyping}
                                            className="flex-1 px-4 py-3 rounded-full border border-teal-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 bg-gray-50 text-sm placeholder:text-gray-400 disabled:opacity-50"
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={!inputMessage.trim() || isTyping}
                                            className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50"
                                            aria-label="Send message"
                                        >
                                            <Send size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
