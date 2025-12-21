/**
 * Project Workspace Component
 *
 * A comprehensive project management page that opens when clicking "Open Project"
 * Features:
 * - GitHub repository integration
 * - Task management with checkboxes
 * - Progress tracking with completion percentage
 * - File upload and management
 * - Client profile access
 * - Chat functionality
 * - Setup flow for freelancers
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Github,
  CheckCircle,
  Circle,
  Upload,
  FileText,
  Download,
  Trash2,
  User,
  MessageCircle,
  Settings,
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  Plus,
  Edit3,
  Save,
  X,
  Image,
  FileArchive,
  File
} from "lucide-react";
import { 
  createGithubRepository, 
  getGithubRepoStatus, 
  getTasks, 
  createTask as createTaskAPI, 
  updateTaskStatus as updateTaskStatusAPI, 
  deleteTask as deleteTaskAPI,
  uploadFile,
  getFiles,
  deleteFile as deleteFileAPI
} from "../../services/api/workspaceApi";
import { getUserProfile } from "../../services/api/userApi";
import NotificationPopup from "../../components/common/NotificationPopup/NotificationPopup";
import ChatModal from "../../components/chat/ChatModal/ChatModal";
import "./ProjectWorkspace.css";

const ProjectWorkspace = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  // Project data
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSetup, setIsSetup] = useState(false);
  const [repoName, setRepoName] = useState("");
  
  // Setup state
  const [setupRepoName, setSetupRepoName] = useState("");
  const [repoDescription, setRepoDescription] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [repoError, setRepoError] = useState("");
  const [repoLoading, setRepoLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  // File management
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [filesLoading, setFilesLoading] = useState(false);
  
  // UI state
  const [showChat, setShowChat] = useState(false);
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "info",
    title: "",
    message: "",
  });

  useEffect(() => {
    fetchProjectData();
    fetchUserProfile();
  }, [projectId]);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      if (response.success) {
        setUserProfile(response.data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchProjectData = async () => {
    setLoading(true);
    try {
      // Check if repository exists via backend API
      const repoResponse = await getGithubRepoStatus(projectId);
      if (repoResponse.success && repoResponse.data?.exists) {
        setIsSetup(true);
        setGithubRepo(repoResponse.data.repoUrl);
        setRepoName(repoResponse.data.repoName || "Project Repository");
        
        // Load tasks from backend
        await loadTasks();
      } else {
        // No repository exists - show setup page
        setIsSetup(false);
        // Mock project data for display
        const mockProject = {
          id: projectId,
          title: "E-commerce Website Development",
          description: "Build a modern e-commerce platform with React and Node.js",
          budget: 5000,
          deadline: "2024-02-15",
          clientName: "John Smith",
          clientEmail: "john@example.com",
          status: "accepted",
          createdAt: "2024-01-15T10:00:00Z"
        };
        setProject(mockProject);
        setRepoName("E-commerce Website Development");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      setNotification({
        isVisible: true,
        type: "error",
        title: "Error",
        message: "Failed to load project data",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const response = await getTasks(projectId);
      if (response.success) {
        setTasks(response.data || []);
      } else {
        console.error("Failed to load tasks:", response.message);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };



  const handleCreateRepository = async () => {
    // Clear previous errors
    setRepoError("");
    
    // Validate inputs
    if (!setupRepoName.trim()) {
      setRepoError("Repository name is required");
      return;
    }
    
    if (!repoDescription.trim()) {
      setRepoError("Repository description is required");
      return;
    }

    // Check if user has GitHub username
    if (!userProfile?.githubUsername) {
      setRepoError("Please add your GitHub username in Basic Profile before creating a repository");
      return;
    }

    setRepoLoading(true);
    
    try {
      const response = await createGithubRepository(projectId, setupRepoName.trim(), repoDescription.trim());
      
      if (response.success) {
        setGithubRepo(response.data.repoUrl);
        setNotification({
          isVisible: true,
          type: "success",
          title: "Repository Created!",
          message: "Redirecting to workspace...",
        });
        
        setRepoName(response.data.repoName);
        
        // Automatically go to workspace after successful repository creation
        setTimeout(() => {
          setIsSetup(true);
          loadTasks();
        }, 1500);
      } else {
        setRepoError(response.message);
      }
    } catch (error) {
      console.error("Error creating repository:", error);
      setRepoError("Failed to create repository. Please try again.");
    } finally {
      setRepoLoading(false);
    }
  };

  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const response = await createTaskAPI(projectId, newTask.trim());
        if (response.success) {
          await loadTasks(); // Reload tasks from backend
          setNewTask("");
          setIsAddingTask(false);
          setNotification({
            isVisible: true,
            type: "success",
            title: "Success",
            message: "Task created successfully",
          });
        } else {
          setNotification({
            isVisible: true,
            type: "error",
            title: "Error",
            message: response.message || "Failed to create task",
          });
        }
      } catch (error) {
        console.error("Error creating task:", error);
        setNotification({
          isVisible: true,
          type: "error",
          title: "Error",
          message: "Failed to create task",
        });
      }
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) return;
      
      const response = await updateTaskStatusAPI(taskId, !task.isCompleted);
      if (response.success) {
        await loadTasks(); // Reload tasks from backend
      } else {
        setNotification({
          isVisible: true,
          type: "error",
          title: "Error",
          message: response.message || "Failed to update task",
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setNotification({
        isVisible: true,
        type: "error",
        title: "Error",
        message: "Failed to update task",
      });
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await deleteTaskAPI(taskId);
      if (response.success) {
        await loadTasks(); // Reload tasks from backend
        setNotification({
          isVisible: true,
          type: "success",
          title: "Success",
          message: "Task deleted successfully",
        });
      } else {
        setNotification({
          isVisible: true,
          type: "error",
          title: "Error",
          message: response.message || "Failed to delete task",
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setNotification({
        isVisible: true,
        type: "error",
        title: "Error",
        message: "Failed to delete task",
      });
    }
  };

  const loadFiles = async () => {
    setFilesLoading(true);
    try {
      const response = await getFiles(projectId);
      if (response.success) {
        setUploadedFiles(response.data || []);
      } else {
        console.error("Failed to load files:", response.message);
        setNotification({
          isVisible: true,
          type: "error",
          title: "Error",
          message: "Failed to load files",
        });
      }
    } catch (error) {
      console.error("Error loading files:", error);
      setNotification({
        isVisible: true,
        type: "error",
        title: "Error",
        message: "Failed to load files",
      });
    } finally {
      setFilesLoading(false);
    }
  };

  const handleShowFiles = async () => {
    if (!showFiles) {
      setShowFiles(true);
      await loadFiles();
    } else {
      setShowFiles(false);
    }
  };

  const handleFileUpload = async (files) => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      try {
        const response = await uploadFile(projectId, file);
        if (response.success) {
          setNotification({
            isVisible: true,
            type: "success",
            title: "Success",
            message: `${file.name} uploaded successfully`,
          });
        } else {
          setNotification({
            isVisible: true,
            type: "error",
            title: "Upload Failed",
            message: response.message,
          });
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setNotification({
          isVisible: true,
          type: "error",
          title: "Upload Failed",
          message: `Failed to upload ${file.name}`,
        });
      }
    }
    
    // Reload files after upload
    await loadFiles();
  };

  const deleteFile = async (publicId, fileName) => {
    try {
      const response = await deleteFileAPI(publicId);
      if (response.success) {
        setNotification({
          isVisible: true,
          type: "success",
          title: "Success",
          message: `${fileName} deleted successfully`,
        });
        // Reload files after deletion
        await loadFiles();
      } else {
        setNotification({
          isVisible: true,
          type: "error",
          title: "Delete Failed",
          message: response.message,
        });
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setNotification({
        isVisible: true,
        type: "error",
        title: "Delete Failed",
        message: `Failed to delete ${fileName}`,
      });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType, fileName) => {
    // Check by fileType first (from backend)
    if (fileType === 'img') {
      return <Image size={24} />;
    }
    if (fileType === 'zip') {
      return <FileArchive size={24} />;
    }
    if (fileType === 'pdf' || fileType === 'doc') {
      return <FileText size={24} />;
    }
    
    // Fallback: check by file extension
    const extension = fileName?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) {
      return <Image size={24} />;
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
      return <FileArchive size={24} />;
    }
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension)) {
      return <FileText size={24} />;
    }
    
    // Default file icon
    return <File size={24} />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="project-workspace-loading">
        <div className="loading-spinner"></div>
        <p>Loading project workspace...</p>
      </div>
    );
  }

  if (!isSetup) {
    // If user is a client and workspace is not set up, show waiting message
    if (userProfile?.accountType === "client") {
      return (
        <div className="project-workspace">
          <NotificationPopup
            isVisible={notification.isVisible}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={() => setNotification({ ...notification, isVisible: false })}
            autoClose={3000}
          />
          
          <div className="setup-container">
            <div className="setup-header">
              <button className="back-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} />
                Back
              </button>
              <h1>Workspace Not Ready</h1>
              <p>The freelancer hasn't set up the workspace for "{project?.title}" yet</p>
            </div>

            <div className="waiting-message">
              <div className="waiting-icon">
                <Clock size={48} />
              </div>
              <h3>Workspace Setup in Progress</h3>
              <p>The freelancer is setting up the project workspace. You'll be able to access the workspace once it's ready.</p>
              <p>You can check back later or contact the freelancer for updates.</p>
            </div>
          </div>
        </div>
      );
    }

    // Show setup form for freelancers
    return (
      <div className="project-workspace">
        <NotificationPopup
          isVisible={notification.isVisible}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification({ ...notification, isVisible: false })}
          autoClose={3000}
        />
        
        <div className="setup-container">
          <div className="setup-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              Back
            </button>
            <h1>Project Setup</h1>
            <p>Set up your project workspace for "{project?.title}"</p>
          </div>

          <div className="setup-steps">
            <div className="setup-step-large active">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>
                  <Github size={24} />
                  Connect GitHub Repository
                </h3>
                <p className="step-description">
                  Create a GitHub repository to start working on this project. This will be your main workspace for code collaboration.
                </p>
                
                <div className="step-form">
                  <div className="repo-form-fields">
                    <input
                      type="text"
                      placeholder="Repository name (e.g., my-project)"
                      value={setupRepoName}
                      onChange={(e) => setSetupRepoName(e.target.value)}
                      className="github-input"
                      disabled={repoLoading}
                    />
                    <textarea
                      placeholder="Repository description"
                      value={repoDescription}
                      onChange={(e) => setRepoDescription(e.target.value)}
                      className="github-textarea"
                      rows={4}
                      disabled={repoLoading}
                    />
                  </div>
                  
                  {repoError && (
                    <div className="repo-error">
                      {repoError}
                    </div>
                  )}
                  
                  <button 
                    className="github-btn-large"
                    onClick={handleCreateRepository}
                    disabled={!setupRepoName.trim() || !repoDescription.trim() || repoLoading}
                  >
                    <Github size={20} />
                    {repoLoading ? "Creating Repository..." : "Create Repository"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-workspace-exact">
      <NotificationPopup
        isVisible={notification.isVisible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isVisible: false })}
        autoClose={3000}
      />

      {/* Dark Blue Header */}
      <div className="workspace-header-exact">
        <div className="header-content-exact">
          <div className="header-left-exact">
            <button className="back-btn-exact" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="project-info-exact">
              <h1>{repoName || "Project Workspace"}</h1>
              <div className="project-meta-exact">
                <span><DollarSign size={14} />$5,000</span>
                <span><Calendar size={14} />Due: Feb 15, 2024, 05:30 AM</span>
                <span><Clock size={14} />Started: Jan 15, 2024, 03:30 PM</span>
              </div>
            </div>
          </div>
          <div className="header-right-exact">
            <button className="profile-btn-exact">
              <User size={16} />
              See Freelancer Profile
            </button>
          </div>
        </div>
      </div>

      {/* GitHub Repository Button */}
      <div className="github-section-exact">
        <button className="github-repo-btn-exact" onClick={() => window.open(githubRepo, '_blank')}>
          <Github size={16} />
          Open GitHub Repository
          <ExternalLink size={14} />
        </button>
      </div>

      {/* Main Content - Three Columns */}
      <div className="workspace-content-exact">
        {/* Tasks Section */}
        <div className="tasks-section-exact">
          <div className="section-header-exact">
            <Github size={16} />
            <span>Project Tasks</span>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-tasks-message">
              <p>Add tasks and keep your client updated on project progress</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task._id} className={`task-item-exact ${task.isCompleted ? 'completed' : ''}`}>
                <div className="task-checkbox-exact">
                  {task.isCompleted ? <CheckCircle size={20} /> : <Circle size={20} />}
                </div>
                <div className="task-content-exact">
                  <div className="task-title-exact">{task.title}</div>
                  <div className="task-description-exact">Task created on {new Date(task.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))
          )}

          {/* Edit Tasks Button - Only show for freelancers */}
          {userProfile?.accountType === "freelancer" && (
            <button className="edit-tasks-btn-exact" onClick={() => setIsAddingTask(true)}>
              <Edit3 size={16} />
              Edit Tasks
            </button>
          )}

          {/* Edit Modal */}
          {isAddingTask && (
            <div className="edit-modal-overlay">
              <div className="edit-modal">
                <div className="modal-header">
                  <h3>Edit Project Tasks</h3>
                  <button onClick={() => setIsAddingTask(false)} className="close-modal">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="modal-content">
                  {/* Add Task Form - Only show for freelancers */}
                  {userProfile?.accountType === "freelancer" && (
                    <div className="add-task-form">
                      <input
                        type="text"
                        placeholder="Enter new task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                      />
                      <button onClick={addTask} className="add-task-btn">
                        <Plus size={16} />
                        Add Task
                      </button>
                    </div>
                  )}

                  <div className="tasks-list-edit">
                    {tasks.map(task => (
                      <div key={task._id} className={`task-item-edit ${task.isCompleted ? 'completed' : ''}`}>
                        {userProfile?.accountType === "freelancer" ? (
                          <button 
                            className="task-checkbox"
                            onClick={() => toggleTask(task._id)}
                          >
                            {task.isCompleted ? <CheckCircle size={18} /> : <Circle size={18} />}
                          </button>
                        ) : (
                          <div className="task-checkbox-readonly">
                            {task.isCompleted ? <CheckCircle size={18} /> : <Circle size={18} />}
                          </div>
                        )}
                        <span className="task-text">{task.title}</span>
                        {userProfile?.accountType === "freelancer" && (
                          <button 
                            className="delete-task"
                            onClick={() => deleteTask(task._id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="modal-footer">
                  <button 
                    className="confirm-btn"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to save these changes?')) {
                        setIsAddingTask(false);
                        setNewTask("");
                      }
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Progress Section */}
        <div className="progress-section-exact">
          <div className="section-header-exact">
            <span>Progress Tracking</span>
          </div>
          <div className="progress-circle-exact">
            <div className="circle-progress-exact">
              <span className="progress-text-exact">{calculateProgress()}%</span>
            </div>
          </div>
          <p className="progress-label-exact">
            {tasks.filter(task => task.isCompleted).length}/{tasks.length} Tasks Completed
          </p>
        </div>

        {/* Files Section */}
        <div className="files-section-exact">
          <div className="section-header-exact">
            <Upload size={16} />
            <span>Project Files</span>
          </div>
          
          <div 
            className={`file-upload-area-exact ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload size={32} />
            <p>Drag and drop files here (Max 5MB)</p>
            <input
              type="file"
              id="file-input-inline"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            />
            <button 
              className="choose-files-btn-inline-exact"
              onClick={() => document.getElementById('file-input-inline').click()}
            >
              Choose Files
            </button>
          </div>

          <input
            type="file"
            id="file-input-main"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />
          <button 
            className="choose-files-btn-exact"
            onClick={() => document.getElementById('file-input-main').click()}
          >
            Choose Files
          </button>
        </div>
      </div>

      {/* Files Sidebar Button */}
      <button 
        className="files-sidebar-toggle"
        onClick={handleShowFiles}
        title={showFiles ? 'Hide Files' : 'Show Files'}
      >
        <FileText size={20} />
        {filesLoading && <span className="loading-spinner-small"></span>}
      </button>

      {/* Files Sidebar */}
      <div className={`files-sidebar ${showFiles ? 'open' : ''}`}>
        <div className="files-sidebar-header">
          <h3>Project Files</h3>
          <button 
            className="close-sidebar-btn"
            onClick={() => setShowFiles(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="files-sidebar-content">
          {filesLoading ? (
            <div className="files-loading">
              <div className="loading-spinner"></div>
              <p>Loading files...</p>
            </div>
          ) : uploadedFiles.length === 0 ? (
            <div className="no-files-message">
              <FileText size={48} />
              <p>No files uploaded yet</p>
              <small>Upload files using the Project Files section</small>
            </div>
          ) : (
            <div className="files-list">
              {uploadedFiles.map(file => (
                <div key={file._id} className="file-item-sidebar">
                  <div className="file-icon-sidebar">
                    {getFileIcon(file.fileType, file.fileName)}
                  </div>
                  <div className="file-details-sidebar">
                    <h4 className="file-name-sidebar">{file.fileName}</h4>
                    <div className="file-meta-sidebar">
                      <span className="file-size-sidebar">
                        {file.fileSize ? formatFileSize(file.fileSize) : 'Unknown size'}
                      </span>
                      <span className="file-date-sidebar">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="file-actions-sidebar">
                    <button 
                      className="download-btn-sidebar"
                      onClick={() => window.open(file.fileUrl, '_blank')}
                      title="Download file"
                    >
                      <Download size={16} />
                    </button>
                    {/* Delete button - Only show for freelancers */}
                    {userProfile?.accountType === "freelancer" && (
                      <button 
                        className="delete-btn-sidebar"
                        onClick={() => deleteFile(file.publicId, file.fileName)}
                        title="Delete file"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Overlay */}
      {showFiles && <div className="sidebar-overlay" onClick={() => setShowFiles(false)}></div>}

      {/* Chat Button */}
      <button 
        className="chat-btn-exact"
        onClick={() => setShowChat(true)}
      >
        <MessageCircle size={20} />
      </button>

      {/* Chat Modal */}
      {showChat && (
        <ChatModal
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          jobId={projectId}
          clientName={project?.clientName || "Client"}
        />
      )}
    </div>
  );
};

export default ProjectWorkspace;