const Message = require("./message.mongo");

async function saveMessage({ jobId, senderId, text }) {
  return Message.create({
    jobId,
    senderId,
    text,
  });
}

async function getMessagesByJob(jobId) {
  return Message.find({ jobId }).sort({ createdAt: 1 });
}

module.exports = {
  saveMessage,
  getMessagesByJob,
};
