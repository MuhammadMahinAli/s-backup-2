import { useState, useEffect, useRef } from "react";
import { MessageSquare, User, CheckCircle, Clock, ArrowRight, Send, X } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";

type ChatSession = {
    _id: string;
    sessionId: string;
    type: "agent" | "peer";
    status: "open" | "closed" | "handoff_pending" | "active_peer";
    handoffRequestedAt?: string;
    createdAt: string;
    lastMessageAt?: string;
};

type Message = {
    role: "user" | "agent" | "peer";
    source: "user" | "agent" | "peer";
    text: string;
    createdAt: string;
};

export default function PeerChatDashboard() {
    const { user } = useAuth();
    const [pendingSessions, setPendingSessions] = useState<ChatSession[]>([]);
    const [activeSessions, setActiveSessions] = useState<ChatSession[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [endingChat, setEndingChat] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user?.id) {
            fetchData();
            const interval = setInterval(fetchData, 3000);
            return () => clearInterval(interval);
        }
    }, [user?.id]);

    useEffect(() => {
        if (selectedSessionId) {
            setMessages([]); // Clear previous messages
            fetchMessages(selectedSessionId);
            const interval = setInterval(() => fetchMessages(selectedSessionId), 2000);
            return () => clearInterval(interval);
        }
    }, [selectedSessionId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchData = async () => {
        await Promise.all([fetchPendingRequests(), fetchActiveSessions()]);
        setLoading(false);
    };

    const fetchPendingRequests = async () => {
        try {
            const res = await fetch(`/api/chat/handoff/pending?peerAdvocateId=${user?.id}`);
            const data = await res.json();
            if (data.ok) setPendingSessions(data.sessions || []);
        } catch (err) {
            console.error("Error fetching pending:", err);
        }
    };

    const fetchActiveSessions = async () => {
        try {
            const res = await fetch(`/api/chat/handoff/active?peerAdvocateId=${user?.id}`);
            const data = await res.json();
            if (data.ok) setActiveSessions(data.sessions || []);
        } catch (err) {
            console.error("Error fetching active:", err);
        }
    };

    const fetchMessages = async (sessionId: string) => {
        try {
            const res = await fetch(`/api/chat/handoff/sessions/${sessionId}/messages?peerAdvocateId=${user?.id}`);
            const data = await res.json();
            if (data.ok) {
                setMessages(data.messages.map((m: any) => ({
                    role: m.role || "user",
                    source: m.source || "agent",
                    text: m.content,
                    createdAt: m.createdAt
                })));
            }
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    const handleAccept = async (sessionId: string) => {
        try {
            const res = await fetch("/api/chat/handoff/accept", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    peerAdvocateId: user?.id,
                    peerAdvocateName: user?.name
                })
            });
            const data = await res.json();
            if (data.ok) {
                setPendingSessions(prev => prev.filter(s => s.sessionId !== sessionId));
                fetchActiveSessions();
                setMessages([]); // Clear before switching to new chat
                setSelectedSessionId(sessionId);
            } else {
                alert("Failed to accept: " + data.error);
            }
        } catch (err) {
            alert("Network error");
        }
    };

    const handleDecline = async (sessionId: string) => {
        try {
            await fetch("/api/chat/handoff/decline", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, peerAdvocateId: user?.id })
            });
            setPendingSessions(prev => prev.filter(s => s.sessionId !== sessionId));
        } catch (err) {
            alert("Network error");
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !selectedSessionId) return;

        const text = inputMessage;
        setInputMessage("");

        // Optimistic UI update
        setMessages((prev) => [...prev, { role: "peer", source: "peer", text, createdAt: new Date().toISOString() }]);

        try {
            await fetch("/api/chat/handoff/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId: selectedSessionId,
                    message: text,
                    peerAdvocateId: user?.id
                })
            });

            // Refresh from server
            fetchMessages(selectedSessionId);
        } catch (err) {
            console.error("Error sending message:", err);
            setInputMessage(text);
        }
    };

    const handleEndChat = async () => {
        if (!selectedSessionId || !confirm("Are you sure you want to end this chat? This cannot be undone.")) return;

        setEndingChat(true);
        try {
            const res = await fetch("/api/chat/handoff/end", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId: selectedSessionId,
                    peerAdvocateId: user?.id
                })
            });
            const data = await res.json();
            if (data.ok) {
                // Clear selected session and refresh active sessions
                setSelectedSessionId(null);
                setMessages([]);
                fetchActiveSessions();
            } else {
                alert("Failed to end chat: " + data.error);
            }
        } catch (err) {
            console.error("Error ending chat:", err);
            alert("Network error");
        } finally {
            setEndingChat(false);
        }
    };

    const formatTime = (dateString?: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex h-[calc(100vh-120px)] gap-6">
            {/* Left Sidebar: Requests & Active Chats */}
            <div className="w-1/3 flex flex-col gap-6 overflow-y-auto pr-2">
                {/* Pending Requests */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-orange-500" />
                        Pending Requests
                        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded-full">
                            {pendingSessions.length}
                        </span>
                    </h2>
                    <div className="space-y-3">
                        {pendingSessions.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-4">No pending requests</p>
                        ) : (
                            pendingSessions.map(session => (
                                <div key={session._id} className="border border-gray-200 rounded-lg p-3 bg-orange-50/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm font-medium text-gray-900">Student Request</span>
                                        <span className="text-xs text-gray-500">{formatTime(session.handoffRequestedAt)}</span>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => handleAccept(session.sessionId)}
                                            className="flex-1 bg-teal-500 text-white text-xs py-1.5 rounded hover:bg-teal-600 transition"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleDecline(session.sessionId)}
                                            className="px-3 bg-white border border-gray-300 text-gray-700 text-xs py-1.5 rounded hover:bg-gray-50 transition"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Active Chats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-1">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <MessageSquare className="w-5 h-5 text-teal-500" />
                        Active Chats
                        <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-0.5 rounded-full">
                            {activeSessions.length}
                        </span>
                    </h2>
                    <div className="space-y-2">
                        {activeSessions.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-4">No active chats</p>
                        ) : (
                            activeSessions.map(session => (
                                <div
                                    key={session._id}
                                    onClick={() => setSelectedSessionId(session.sessionId)}
                                    className={`p-3 rounded-lg cursor-pointer border transition-all ${selectedSessionId === session.sessionId
                                        ? "bg-teal-50 border-teal-200 shadow-sm"
                                        : "bg-white border-gray-100 hover:border-teal-200 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Student</p>
                                                <p className="text-xs text-gray-500">
                                                    {session.lastMessageAt ? formatTime(session.lastMessageAt) : "Just now"}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedSessionId === session.sessionId && (
                                            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Right Side: Chat Interface */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                {selectedSessionId ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Student Chat</h3>
                                    <p className="text-xs text-gray-500">Session ID: {selectedSessionId.slice(-6)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleEndChat}
                                    disabled={endingChat}
                                    className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    {endingChat ? "Ending..." : "End Chat"}
                                </button>
                                <button
                                    onClick={() => setSelectedSessionId(null)}
                                    className="text-gray-400 hover:text-gray-600 p-2"
                                    title="Close chat view"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {messages.map((msg, idx) => {
                                const isPeerMessage = msg.source === "peer";
                                return (
                                    <div
                                        key={idx}
                                        className={`flex ${isPeerMessage ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${isPeerMessage
                                                ? "bg-teal-500 text-white rounded-br-sm"
                                                : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                                                }`}
                                        >
                                            <p className="text-sm">{msg.text}</p>
                                            <p className={`text-[10px] mt-1 ${isPeerMessage ? "text-teal-100" : "text-gray-400"}`}>
                                                {formatTime(msg.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-100 bg-white">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputMessage.trim()}
                                    className="bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600 transition disabled:opacity-50"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                        <p>Select a chat to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}
