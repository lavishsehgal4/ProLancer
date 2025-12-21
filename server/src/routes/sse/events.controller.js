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
  console.log(`[SSE] Attempting to send notification`, {
    userId,
    payload,
  });

  const client = clients.get(userId);

  if (!client) {
    console.warn(`[SSE] No active client found`, { userId });
    return;
  }

  try {
    client.write(`data: ${JSON.stringify(payload)}\n\n`);
    console.log(`[SSE] Notification sent successfully`, { userId });
  } catch (err) {
    console.error(`[SSE] Failed to send notification`, {
      userId,
      error: err.message,
    });
  }
}


module.exports = { sseConnect, sendNotification };
