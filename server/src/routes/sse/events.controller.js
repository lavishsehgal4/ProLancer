// Store connected clients: userId (string) → response object
const clients = new Map();

function sseConnect(req, res) {
  const userId = req.user?.userId?.toString();

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "userId required" });
  }

  // Required SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders?.();

  // Initial handshake
  res.write(`data: connected\n\n`);

  // Save client connection
  clients.set(userId, res);

  // Cleanup on disconnect
  req.on("close", () => {
    clients.delete(userId);
  });

  // Cleanup on stream error
  res.on("error", () => {
    clients.delete(userId);
  });
}

function sendNotification(userId, payload) {
  const client = clients.get(userId.toString());
  if (!client) return;

  client.write(`data: ${JSON.stringify(payload)}\n\n`);
}

module.exports = { sseConnect, sendNotification };
