// Store connected clients: userId → response object
const clients = new Map();

function sseConnect(req, res) {
const userId = req.user.userId;

  if (!userId) {
    return res.status(400).json({ success: false, message: "userId required" });
  }

  // Required SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send initial event
  res.write(`data: connected\n\n`);

  // Save client connection
  clients.set(userId, res);

  // Remove client on disconnect
  req.on("close", () => {
    clients.delete(userId);
  });
}

function sendNotification(userId, payload) {
  const client = clients.get(userId);
  if (client) {
    client.write(`data: ${JSON.stringify(payload)}\n\n`);
  }
}

module.exports = { sseConnect, sendNotification };
