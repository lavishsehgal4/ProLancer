import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import socketService from '../../../services/socket/socketService';
import { getChatMessages } from '../../../services/api/chatApi';
import { getToken, getUser } from '../../../utils/auth/token';
import './ChatModal.css';

const ChatModal = ({ isOpen, onClose, jobId, clientName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Get current user from localStorage using utility function
  const currentUser = getUser() || {};

  console.log("🎭 [ChatModal] Component rendered with props:", { isOpen, jobId, clientName });
  console.log("👤 [ChatModal] Current user:", currentUser);

  useEffect(() => {
    console.log("🔄 [ChatModal] useEffect triggered - isOpen:", isOpen, "jobId:", jobId);
    if (isOpen && jobId) {
      initializeChat();
    }

    return () => {
      console.log("🧹 [ChatModal] Cleanup - disconnecting socket");
      socketService.offNewMessage();
      socketService.disconnect();
    };
  }, [isOpen, jobId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    console.log("🚀 [ChatModal] Initializing chat...");
    setLoading(true);
    
    try {
      // Load existing messages
      console.log("📥 [ChatModal] Fetching existing messages for jobId:", jobId);
      const response = await getChatMessages(jobId);
      console.log("📥 [ChatModal] Messages response:", response);
      
      if (response.success) {
        console.log("✅ [ChatModal] Messages loaded successfully:", response.messages?.length || 0, "messages");
        setMessages(response.messages || []);
      } else {
        console.error("❌ [ChatModal] Failed to load messages:", response);
      }

      // Connect to socket
      const token = getToken();
      const user = getUser();
      console.log("🔑 [ChatModal] Retrieved token using getToken():", !!token);
      console.log("🔑 [ChatModal] Token value (first 20 chars):", token ? token.substring(0, 20) + '...' : 'null');
      console.log("👤 [ChatModal] Retrieved user using getUser():", user);
      
      if (token && user && user.userId) {
        console.log("🔌 [ChatModal] Connecting to socket with jobId:", jobId, "userId:", user.userId);
        const socket = socketService.connect(jobId, token);
        
        // Monitor connection status
        const checkConnection = () => {
          const isConnected = socketService.connected;
          console.log("🔍 [ChatModal] Connection check - connected:", isConnected);
          setConnected(isConnected);
        };

        // Check connection status periodically
        const connectionInterval = setInterval(checkConnection, 1000);
        
        // Initial check
        checkConnection();

        // Listen for new messages
        console.log("👂 [ChatModal] Setting up message listener");
        socketService.onNewMessage(handleNewMessage);

        // Cleanup interval on unmount
        return () => {
          console.log("🧹 [ChatModal] Clearing connection interval");
          clearInterval(connectionInterval);
        };
      } else {
        console.error("❌ [ChatModal] Missing authentication data:", { 
          hasToken: !!token, 
          hasUser: !!user, 
          hasUserId: !!(user && user.userId) 
        });
      }
    } catch (error) {
      console.error('❌ [ChatModal] Error initializing chat:', error);
    } finally {
      setLoading(false);
      console.log("✅ [ChatModal] Chat initialization complete");
    }
  };

  const handleNewMessage = (message) => {
    console.log('📨 [ChatModal] New message received in handler:', message);
    setMessages(prev => {
      console.log('📨 [ChatModal] Adding message to existing messages. Current count:', prev.length);
      return [...prev, message];
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    console.log("📤 [ChatModal] Send message attempt - message:", newMessage.trim());
    console.log("📤 [ChatModal] Send conditions - sending:", sending, "connected:", connected);
    
    if (!newMessage.trim() || sending || !connected) {
      console.warn("⚠️ [ChatModal] Cannot send message - conditions not met");
      return;
    }

    setSending(true);
    try {
      console.log("📤 [ChatModal] Sending message via socket service");
      socketService.sendMessage(newMessage.trim());
      setNewMessage('');
      console.log("✅ [ChatModal] Message sent successfully");
    } catch (error) {
      console.error('❌ [ChatModal] Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  if (!isOpen) return null;

  const messageGroups = groupMessagesByDate(messages);
  console.log("📊 [ChatModal] Rendering with message groups:", Object.keys(messageGroups).length);

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        <div className="chat-header">
          <div className="chat-header-info">
            <MessageCircle size={20} />
            <div>
              <h3>Chat with {clientName}</h3>
              <span className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
                {connected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
          </div>
          <button className="chat-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="chat-messages">
          {loading ? (
            <div className="chat-loading">
              <div className="loading-spinner"></div>
              <p>Loading messages...</p>
            </div>
          ) : Object.keys(messageGroups).length === 0 ? (
            <div className="chat-empty">
              <MessageCircle size={48} />
              <p>No messages yet</p>
              <small>Start the conversation by sending a message</small>
            </div>
          ) : (
            Object.entries(messageGroups).map(([date, dateMessages]) => (
              <div key={date} className="message-group">
                <div className="date-separator">
                  <span>{formatDate(dateMessages[0].createdAt)}</span>
                </div>
                {dateMessages.map((message) => (
                  <div
                    key={message._id}
                    className={`message ${
                      message.senderId === currentUser.userId ? 'own-message' : 'other-message'
                    }`}
                  >
                    <div className="message-content">
                      <p>{message.text}</p>
                      <span className="message-time">
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="chat-input"
              rows={1}
              disabled={!connected || sending}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || !connected || sending}
              className="chat-send-btn"
            >
              {sending ? (
                <div className="sending-spinner"></div>
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
          {!connected && (
            <div className="connection-warning">
              Reconnecting to chat server...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatModal;