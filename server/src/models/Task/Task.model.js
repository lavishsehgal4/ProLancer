const Task = require("./Task.mongo");


// 1️⃣ CREATE TASK
async function createTask(jobId, title) {
  try {
    const task = await Task.create({
      jobId,
      title,
      isCompleted: false,
    });

    return {
      success: true,
      data: task,
    };

  } catch (err) {
    return {
      success: false,
      message: "Failed to create task",
      error: err.message,
    };
  }
}



// 2️⃣ GET ALL TASKS FOR A JOB
async function getTasksByJobId(jobId) {
  try {
    const tasks = await Task.find({ jobId }).sort({ createdAt: 1 });

    return {
      success: true,
      data: tasks,
    };

  } catch (err) {
    return {
      success: false,
      message: "Failed to fetch tasks",
      error: err.message,
    };
  }
}



// 3️⃣ UPDATE TASK COMPLETION (checkbox toggle)
async function updateTaskStatus(taskId, isCompleted) {
  try {
    const updated = await Task.findByIdAndUpdate(
      taskId,
      { $set: { isCompleted } },
      { new: true }
    );

    if (!updated) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    return {
      success: true,
      data: updated,
    };

  } catch (err) {
    return {
      success: false,
      message: "Failed to update task",
      error: err.message,
    };
  }
}



// 4️⃣ DELETE TASK
async function deleteTask(taskId) {
  try {
    const deleted = await Task.findByIdAndDelete(taskId);

    if (!deleted) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    return {
      success: true,
    };

  } catch (err) {
    return {
      success: false,
      message: "Failed to delete task",
      error: err.message,
    };
  }
}



module.exports = {
  createTask,
  getTasksByJobId,
  updateTaskStatus,
  deleteTask,
};
