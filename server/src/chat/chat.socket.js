const { saveMessage } = require("./message.model");

function chatSocket(io) {
  io.on("connection", (socket) => {
    const jobId = socket.jobId;

    // join job room
    socket.join(jobId);

    socket.on("send-message", async (text) => {
      if (!text) return;

      const message = await saveMessage({
        jobId,
        senderId: socket.user.userId,
        text,
      });

      io.to(jobId).emit("new-message", message);
    });
  });
}

module.exports = chatSocket;
