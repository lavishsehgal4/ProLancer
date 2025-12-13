const fs = require("fs");
const { uploadFile ,deleteFile } = require("../../cloudinary/cloudinary.service");
const {
  saveUploadedFile,
  getFilesByJobId,
  deleteFileRecord,
} = require("../../models/FileUpload/FileUpload.model");
const { getJobById } = require("../../models/RequestJob/RequestJob.model");


// 1️⃣ UPLOAD FILE
async function httpUploadFile(req, res) {
  try {
    const { jobId } = req.params;
    const uploaderId = req.user.userId;

    // Validate job
    const jobRes = await getJobById(jobId);
    if (!jobRes.success) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    console.log("hello");
    console.log("hello");
    console.log("hello");
    console.log("hello");
    console.log(jobRes);
    console.log("hi");
    console.log("hi");
    console.log("hi");
    console.log("hi");
    // Validate file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }
    console.log("habibibi");
    console.log(req.file);
    // Upload to Cloudinary
    const cloudRes = await uploadFile(req.file.path);
    console.log("bulabula");
    console.log(cloudRes);
    if (!cloudRes.success) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary upload failed",
        error: cloudRes.error,
      });
    }
    fs.unlink(req.file.path, (err) => {
  if (err) {
    console.error("Failed to delete temp file:", err);
  }
});
    const mime = req.file.mimetype;

let fileType = "other";
if (mime.includes("image")) fileType = "img";
else if (mime.includes("pdf")) fileType = "pdf";
else if (mime.includes("zip")) fileType = "zip";
else if (mime.includes("word")) fileType = "doc";

    // Save file metadata in DB
    const fileData = {
      jobId,
      uploaderId,
      fileUrl: cloudRes.url,
      publicId: cloudRes.publicId,
      fileName: req.file.originalname,
      fileType,
    };

    const savedFile = await saveUploadedFile(fileData);

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: savedFile.file,
    });

  } catch (error) {
    console.error("Upload File Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

async function httpGetFiles(req, res) {
  try {
    const { jobId } = req.params;

    const filesRes = await getFilesByJobId(jobId);

    return res.status(200).json(filesRes);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

async function httpDeleteFile(req, res) {
  try {
    const { publicId } = req.params;

    // Delete from Cloudinary
    const deleteCloud = await deleteFile(publicId);

    if (!deleteCloud.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete file from Cloudinary",
      });
    }

    // Delete from DB
    await deleteFileRecord(publicId);

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });

  } catch (error) {
    console.error("Delete File Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

module.exports = {
  httpUploadFile,
  httpGetFiles,
  httpDeleteFile,
};
