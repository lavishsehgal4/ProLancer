import { io } from "socket.io-client";

class SocketService {
  socket = null;
  connected = false;
  messageHandler = null;

  connect(jobId, token) {
    console.log("🚀 [SocketService] Starting connection...");
    console.log("📋 [SocketService] JobId:", jobId);
    console.log("🔑 [SocketService] Token exists:", !!token);
    console.log("🔑 [SocketService] Token preview:", token ? token.substring(0, 20) + "..." : "null");

    // prevent reconnect storm
    if (this.socket && this.connected) {
      console.log("⚠️ [SocketService] Already connected, returning existing socket");
      return this.socket;
    }

    console.log("🔌 [SocketService] Creating new socket connection to http://localhost:8000");
    
    this.socket = io("http://localhost:8000", {
      auth: { token, jobId },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      forceNew: true
    });

    this.socket.on("connect", () => {
      console.log("✅ [SocketService] Connected to chat server");
      console.log("🆔 [SocketService] Socket ID:", this.socket.id);
      this.connected = true;
    });

    this.socket.on("disconnect", (reason) => {
      console.warn("⚠️ [SocketService] Disconnected:", reason);
      this.connected = false;
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log("🔁 [SocketService] Reconnected after", attemptNumber, "attempts");
      this.connected = true;
    });

    this.socket.on("reconnect_attempt", (attemptNumber) => {
      console.log("🔄 [SocketService] Reconnection attempt #", attemptNumber);
    });

    this.socket.on("reconnect_error", (error) => {
      console.error("🔴 [SocketService] Reconnection error:", error.message);
    });

    this.socket.on("reconnect_failed", () => {
      console.error("💀 [SocketService] Reconnection failed - giving up");
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ [SocketService] Socket connection error:", error.message);
      console.error("❌ [SocketService] Error type:", error.type);
      console.error("❌ [SocketService] Error description:", error.description);
      console.error("❌ [SocketService] Full error:", error);
      this.connected = false;
    });

    // Log all socket events for debugging
    this.socket.onAny((eventName, ...args) => {
      console.log("📡 [SocketService] Event received:", eventName, args);
    });

    return this.socket;
  }

  disconnect() {
    console.log("🔌 [SocketService] Disconnecting socket...");
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.messageHandler = null;
      console.log("✅ [SocketService] Socket disconnected and cleaned up");
    }
  }

  sendMessage(text) {
    console.log("📤 [SocketService] Attempting to send message:", text);
    if (!this.socket) {
      console.warn("⚠️ [SocketService] Socket not initialized");
      return;
    }
    if (!this.connected) {
      console.warn("⚠️ [SocketService] Socket not connected");
      return;
    }
    console.log("📤 [SocketService] Emitting send-message event");
    this.socket.emit("send-message", text);
  }

  onNewMessage(callback) {
    console.log("👂 [SocketService] Setting up new message listener");
    if (!this.socket) {
      console.warn("⚠️ [SocketService] Socket not available for message listener");
      return;
    }
    
    // prevent duplicate listeners
    if (this.messageHandler) {
      console.log("🧹 [SocketService] Removing existing message handler");
      this.socket.off("new-message", this.messageHandler);
    }
    
    this.messageHandler = callback;
    this.socket.on("new-message", (message) => {
      console.log("📨 [SocketService] New message received:", message);
      callback(message);
    });
  }

  offNewMessage() {
    console.log("🔇 [SocketService] Removing message listener");
    if (this.socket && this.messageHandler) {
      this.socket.off("new-message", this.messageHandler);
      this.messageHandler = null;
    }
  }
}

export default new SocketService();