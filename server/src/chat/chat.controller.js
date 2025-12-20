const { getMessagesByJob } = require("./message.model");
const { isUserPartOfJob } = require("../models/RequestJob/RequestJob.model");

async function httpGetJobMessages(req, res) {
  try {
    const userId = req.user.userId;
    const { jobId } = req.params;

    // authorization via MODEL
    const auth = await isUserPartOfJob(jobId, userId);

    if (!auth.success) {
      return res.status(403).json({
        success: false,
        message: "Not authorized for this job",
      });
    }

    const messages = await getMessagesByJob(jobId);

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

module.exports = { httpGetJobMessages };
