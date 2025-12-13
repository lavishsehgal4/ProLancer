const express = require("express");
const multer = require("multer");
const verifyToken = require("../../auth/auth.middleware");

const {
  httpUploadFile,
  httpGetFiles,
  httpDeleteFile,
} = require("./file.controller");

const fileRouter = express.Router();

// -------------------------------------
// Multer setup (stores file temporarily)
// -------------------------------------
const upload = multer({ dest: "uploads/" });

// -------------------------------------
// ROUTES
// -------------------------------------

// 1️⃣ Upload file (client or freelancer)
fileRouter.post(
  "/upload/:jobId",
  verifyToken,
  upload.single("file"),
  httpUploadFile
);

// 2️⃣ Get all files for a job
fileRouter.get(
  "/list/:jobId",
  verifyToken,
  httpGetFiles
);

// 3️⃣ Delete a file by publicId
fileRouter.delete(
  "/delete/:publicId",
  verifyToken,
  httpDeleteFile
);

module.exports = fileRouter;
