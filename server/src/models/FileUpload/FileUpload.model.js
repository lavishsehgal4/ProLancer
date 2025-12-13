const FileUpload = require("./FileUpload.mongo");

// 1️⃣ SAVE UPLOADED FILE
async function saveUploadedFile(data) {
  try {
    const file = await FileUpload.create(data);

    return {
      success: true,
      message: "File saved successfully",
      file,
    };

  } catch (err) {
    console.error("FileUpload Save Error:", err);

    // 🟧 Mongoose validation errors
    if (err.name === "ValidationError") {
      const errors = {};
      for (let field in err.errors) {
        errors[field] = err.errors[field].message;
      }

      return {
        success: false,
        type: "validation",
        message: "File validation failed",
        errors,
      };
    }

    // 🔴 Any other DB / server error
    return {
      success: false,
      type: "server",
      message: "Failed to save file",
      error: err.message,
    };
  }
}

// 2️⃣ GET FILES BY JOB ID
async function getFilesByJobId(jobId) {
  try {
    if (!jobId) {
      return {
        success: false,
        type: "validation",
        message: "jobId is required",
      };
    }

    const files = await FileUpload.find({ jobId });

    return {
      success: true,
      files,
    };

  } catch (err) {
    console.error("FileUpload Fetch Error:", err);

    return {
      success: false,
      type: "server",
      message: "Failed to fetch files",
      error: err.message,
    };
  }
}

// 3️⃣ DELETE FILE RECORD (DB ONLY)
async function deleteFileRecord(publicId) {
  try {
    if (!publicId) {
      return {
        success: false,
        type: "validation",
        message: "publicId is required",
      };
    }

    const result = await FileUpload.deleteOne({ publicId });

    if (result.deletedCount === 0) {
      return {
        success: false,
        type: "not_found",
        message: "File record not found",
      };
    }

    return {
      success: true,
      message: "File record deleted successfully",
    };

  } catch (err) {
    console.error("FileUpload Delete Error:", err);

    return {
      success: false,
      type: "server",
      message: "Failed to delete file record",
      error: err.message,
    };
  }
}

module.exports = {
  saveUploadedFile,
  getFilesByJobId,
  deleteFileRecord,
};
