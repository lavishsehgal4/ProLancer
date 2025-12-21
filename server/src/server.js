const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = require("./app");
const connectDB = require("./services/mongo");

// 🔐 SOCKET AUTH (FIXED IMPORT)
const { verifySocketToken } = require("./auth/socketAuth");

// 📦 JOB MODEL
const { isUserPartOfJob } = require("./models/RequestJob/RequestJob.model");

// 💬 CHAT SOCKET (ONLY IMPORT, NO REDEFINE)
const chatSocket = require("./chat/chat.socket");

const PORT = process.env.PORT || 8000;

// CREATE HTTP SERVER
const server = http.createServer(app);

// ATTACH SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// SOCKET AUTH
io.use(async (socket, next) => {
  try {
    const { token, jobId } = socket.handshake.auth;

    if (!token || !jobId) {
      return next(new Error("Missing auth data"));
    }

    const decoded = verifySocketToken(token);
    socket.user = decoded;

    const auth = await isUserPartOfJob(jobId, decoded.userId);
    if (!auth.success) {
      return next(new Error("Not authorized for this job"));
    }

    socket.jobId = jobId;
    next();
  } catch (err) {
    console.error("Socket auth error:", err.message);
    next(new Error("Socket authentication failed"));
  }
});

// REGISTER CHAT SOCKET
chatSocket(io);

// START SERVER
async function startServer() {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
  });
}

startServer();
