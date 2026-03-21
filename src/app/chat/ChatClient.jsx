"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Search, ArrowLeft, Wifi, WifiOff, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { io } from "socket.io-client";

// Prefer an explicit socket server URL in production (NEXT_PUBLIC_SOCKET_URL).
// Otherwise use the current origin in the browser when available, then NEXT_PUBLIC_BASE_URL, then localhost.
const SOCKET_ORIGIN =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  (typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000");


export default function ChatClient() {
  // ===== STATE VARIABLES =====
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null); // Logged-in user
  const [chats, setChats] = useState([]); // All user chats
  const [selectedChat, setSelectedChat] = useState(null); // Currently opened chat ID
  const [messages, setMessages] = useState([]); // Messages of selected chat
  const [loadingMessages, setLoadingMessages] = useState(false); // Loading state
  const [newMessage, setNewMessage] = useState(""); // Current typed message
  const [connected, setConnected] = useState(false); // Socket connected
  const [connecting, setConnecting] = useState(false); // Socket connecting
  const messagesEndRef = useRef(null); // Scroll to bottom
  const socketRef = useRef(null); // Socket instance
  const searchParams = useSearchParams();

  // ===== GET chatId from URL query (for direct navigation to chat) =====
  useEffect(() => {
    const initialChatId = searchParams.get("chatId");
    if (initialChatId && initialChatId !== "undefined") {
      setSelectedChat(initialChatId);
    }
  }, [searchParams]);

  // ===== LOAD current user from localStorage =====
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.id) {
        setCurrentUser(storedUser);
      }
    } catch {
      setCurrentUser(null);
    }
  }, []);

  // ===== INITIALIZE SOCKET.IO connection =====
  useEffect(() => {
    if (!currentUser?.id) return;

    const initSocket = async () => {
      setConnecting(true);

      try {
        await fetch("/api/socket");
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Connect to Socket.IO server (use dynamic origin so it works in prod and locally)
        socketRef.current = io(SOCKET_ORIGIN, {
          path: "/api/socket",
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        // When connected
        socketRef.current.on("connect", () => {
          setConnected(true);
          setConnecting(false);
          // Join selected chat room immediately
          if (selectedChat) {
            socketRef.current.emit("join-chat", selectedChat);
          }
        });

        // When disconnected
        socketRef.current.on("disconnect", () => {
          setConnected(false);
        });

        // Connection error
        socketRef.current.on("connect_error", () => {
          setConnected(false);
          setConnecting(false);
        });

        // Receive a new message
        socketRef.current.on("new-message", (message) => {
          setMessages((prev) => {
            // Avoid duplicates
            if (!prev.some((m) => m._id === message._id)) {
              return [...prev, message];
            }
            return prev;
          });
          scrollToBottom();
        });

      } catch {
        setConnecting(false);
      }
    };

    initSocket();

    // Cleanup socket on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setConnected(false);
    };
  }, [currentUser, selectedChat]);

  // ===== FETCH chats for the logged-in user =====
  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchChats = async () => {
      try {
        const res = await fetch(`/api/chat/userChats?userId=${currentUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setChats(data || []);
        }
      } catch {
        setChats([]);
      }
    };

    fetchChats();
  }, [currentUser]);

  // ===== FETCH messages for selected chat =====
  useEffect(() => {
    if (!selectedChat || !socketRef.current || !connected) return;

    setLoadingMessages(true);
    socketRef.current.emit("join-chat", selectedChat);

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?chatId=${selectedChat}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data || []);
          scrollToBottom();
        }
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedChat, connected]);

  // ===== SCROLL to latest message =====
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // ===== SEND a message =====
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !socketRef.current || !connected) {
      return;
    }

    const messageData = {
      chatId: selectedChat,
      sender: currentUser.id,
      content: newMessage.trim(),
    };

    socketRef.current.emit("send-message", messageData);
    setNewMessage("");
    // scrollToBottom will be called when the message comes back from socket
  };

  // ===== SEND message on Enter key press =====
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ===== FIND selected chat full data =====
  const selectedChatData = chats.find((c) => c._id === selectedChat);

  const [chatMenuOpen, setChatMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="py-4 px-4 sm:px-6 bg-white shadow rounded-lg">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            GuidMeLK
          </Link>
          <div className="hidden sm:flex space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
              Login
            </Link>
            <Link href="/register" className="text-gray-600 hover:text-blue-600 transition-colors">
              Register
            </Link>
          </div>
          <button
            onClick={() => setChatMenuOpen(!chatMenuOpen)}
            className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {chatMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <div className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${chatMenuOpen ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col space-y-1 border-t border-gray-100 pt-3">
            <Link href="/login" onClick={() => setChatMenuOpen(false)} className="block py-2 px-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">Login</Link>
            <Link href="/register" onClick={() => setChatMenuOpen(false)} className="block py-2 px-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">Register</Link>
          </div>
        </div>
      </nav>

      {/* Connection Status */}
      {currentUser && (
        <div
          className={`text-center py-2 text-sm flex items-center justify-center gap-2 ${
            connected
              ? "bg-green-100 text-green-800"
              : connecting
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {connected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
          {connected
            ? "Connected - Real-time messaging active"
            : connecting
            ? "Connecting to chat server..."
            : "Disconnected - Attempting to reconnect..."}
        </div>
      )}

      {/* Back Button */}
      <div className="container mx-auto px-4 pt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="flex items-center gap-2 hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="container mx-auto px-4 py-6 h-[calc(100vh-140px)]">
        <div className="grid lg:grid-cols-4 gap-6 h-full">
          
          {/* ===== CHAT LIST ===== */}
          <div className={`${selectedChat ? "hidden lg:block" : "block"} lg:col-span-1 h-full`}>
            <Card className="h-full overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Messages</span>
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search conversations..." className="pl-10" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {chats.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    No conversations yet. Start chatting!
                  </div>
                ) : (
                  chats.map((chat) => {
                    const otherUser = chat.participants?.find(
                      (p) => p._id !== currentUser?.id
                    );
                    return (
                      <div
                        key={chat._id}
                        className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedChat === chat._id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedChat(chat._id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={otherUser?.profileImage} alt={otherUser?.firstName} />
                            <AvatarFallback>
                              {(otherUser?.firstName?.[0] || "") + (otherUser?.lastName?.[0] || "")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium text-sm truncate">
                                {otherUser?.firstName} {otherUser?.lastName}
                              </h3>
                              <span className="text-xs text-muted-foreground">
                                {chat.updatedAt
                                  ? new Date(chat.updatedAt).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : ""}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {chat.lastMessage || "Start your conversation..."}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* ===== CHAT WINDOW ===== */}
          <div className={`${selectedChat ? "block" : "hidden lg:flex"} lg:col-span-3 flex flex-col h-full`}>
            {selectedChatData ? (
              <Card className="h-full flex flex-col">
                {/* Mobile back button */}
                <div className="lg:hidden border-b flex items-center gap-2 p-4 bg-muted">
                  <Button variant="ghost" size="icon" onClick={() => setSelectedChat(null)}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <h3 className="font-semibold">
                    {selectedChatData.participants?.find((p) => p._id !== currentUser?.id)?.firstName}
                  </h3>
                </div>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages ? (
                    <div className="text-center text-sm text-muted-foreground py-8">
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((m) => (
                      <div
                        key={m._id || m.createdAt || Math.random()}
                        className={`flex ${m.sender === currentUser.id ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex gap-2 max-w-[70%] ${m.sender === currentUser.id ? "flex-row-reverse" : ""}`}>
                          {m.sender !== currentUser.id && (
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarImage
                                src={selectedChatData.participants?.find((p) => p._id === m.sender)?.profileImage}
                              />
                              <AvatarFallback>
                                {selectedChatData.participants?.find((p) => p._id === m.sender)?.firstName?.[0] || "U"}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`rounded-lg px-3 py-2 ${
                              m.sender === currentUser.id ? "bg-blue-600 text-white" : "bg-muted text-foreground"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Send Message Input */}
                <div className="border-t p-4 flex items-center gap-2">
                  <Input
                    placeholder={connected ? "Type a message..." : "Connecting..."}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={!connected}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim() || !connected}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p>Choose a chat from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
