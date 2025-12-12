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
  X
} from "lucide-react";
import { createGithubRepository, getGithubRepoStatus } from "../../services/api/workspaceApi";
import { getUserProfile } from "../../services/api/userApi";
import NotificationPopup from "../../components/common/NotificationPopup/NotificationPopup";
import "./ProjectWorkspace.css";

const ProjectWorkspace = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  // Project data
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSetup, setIsSetup] = useState(false);
  
  // Setup state
  const [repoName, setRepoName] = useState("");
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
      // Mock project data - replace with actual API call
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
      
      // Check if repository exists via backend API
      const repoResponse = await getGithubRepoStatus(projectId);
      if (repoResponse.success && repoResponse.data?.exists) {
        setIsSetup(true);
        setGithubRepo(repoResponse.data.repoUrl);
        loadProjectData();
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

  const loadProjectData = () => {
    // Load saved project data from localStorage (replace with API calls)
    const savedRepo = localStorage.getItem(`project_repo_${projectId}`);
    const savedTasks = localStorage.getItem(`project_tasks_${projectId}`);
    const savedFiles = localStorage.getItem(`project_files_${projectId}`);
    
    if (savedRepo) setGithubRepo(savedRepo);
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedFiles) setUploadedFiles(JSON.parse(savedFiles));
  };



  const handleCreateRepository = async () => {
    // Clear previous errors
    setRepoError("");
    
    // Validate inputs
    if (!repoName.trim()) {
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
      const response = await createGithubRepository(projectId, repoName.trim(), repoDescription.trim());
      
      if (response.success) {
        setGithubRepo(response.data.repoUrl);
        setNotification({
          isVisible: true,
          type: "success",
          title: "Repository Created!",
          message: "Redirecting to workspace...",
        });
        
        // Automatically go to workspace after successful repository creation
        setTimeout(() => {
          setIsSetup(true);
          loadProjectData();
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

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      const updatedTasks = [...tasks, task];
      setTasks(updatedTasks);
      localStorage.setItem(`project_tasks_${projectId}`, JSON.stringify(updatedTasks));
      setNewTask("");
      setIsAddingTask(false);
    }
  };

  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem(`project_tasks_${projectId}`, JSON.stringify(updatedTasks));
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem(`project_tasks_${projectId}`, JSON.stringify(updatedTasks));
  };

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file) // In real app, upload to server
    }));
    
    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    localStorage.setItem(`project_files_${projectId}`, JSON.stringify(updatedFiles));
  };

  const deleteFile = (fileId) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== fileId);
    setUploadedFiles(updatedFiles);
    localStorage.setItem(`project_files_${projectId}`, JSON.stringify(updatedFiles));
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
    const completedTasks = tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
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
                    disabled={!repoName.trim() || !repoDescription.trim() || repoLoading}
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
    <div className="project-workspace">
      <NotificationPopup
        isVisible={notification.isVisible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isVisible: false })}
        autoClose={3000}
      />

      {/* Header */}
      <div className="workspace-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="project-info">
            <h1>{project?.title}</h1>
            <div className="project-meta">
              <span><DollarSign size={16} />${project?.budget?.toLocaleString()}</span>
              <span><Calendar size={16} />Due: {formatDate(project?.deadline)}</span>
              <span><Clock size={16} />Started: {formatDate(project?.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button className="github-repo-btn">
            <Github size={16} />
            Open GitHub Repo
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="workspace-content">
        {/* Left Column */}
        <div className="left-column">
          {/* Progress Section */}
          <div className="progress-section">
            <h3>Progress Tracking</h3>
            <div className="progress-circle">
              <div className="circle-progress" style={{'--progress': calculateProgress()}}>
                <span className="progress-text">{calculateProgress()}%</span>
              </div>
            </div>
            <p className="progress-label">
              {tasks.filter(t => t.completed).length}/{tasks.length} Tasks Completed
            </p>
          </div>

          {/* Tasks Section */}
          <div className="tasks-section">
            <div className="section-header">
              <h3>
                <Github size={20} />
                Project Tasks
              </h3>
              <button 
                className="add-btn"
                onClick={() => setIsAddingTask(true)}
              >
                <Plus size={16} />
              </button>
            </div>
            
            {isAddingTask && (
              <div className="add-task-form">
                <input
                  type="text"
                  placeholder="Enter new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  autoFocus
                />
                <div className="form-actions">
                  <button onClick={addTask} className="save-btn">
                    <Save size={14} />
                  </button>
                  <button onClick={() => {setIsAddingTask(false); setNewTask("");}} className="cancel-btn">
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}

            <div className="tasks-list">
              {tasks.map(task => (
                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <button 
                    className="task-checkbox"
                    onClick={() => toggleTask(task.id)}
                  >
                    {task.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                  </button>
                  <span className="task-text">{task.text}</span>
                  <button 
                    className="delete-task"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* File Upload Section */}
          <div className="files-section">
            <h3>
              <Upload size={20} />
              Project Files
            </h3>
            
            <div 
              className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload size={32} />
              <p>Drag and drop files here</p>
              <span>or</span>
              <input
                type="file"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="file-input"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="upload-btn">
                Choose Files
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="uploaded-files">
                <h4>Uploaded Files</h4>
                {uploadedFiles.map(file => (
                  <div key={file.id} className="file-item">
                    <div className="file-info">
                      <FileText size={16} />
                      <div className="file-details">
                        <span className="file-name">{file.name}</span>
                        <span className="file-meta">
                          {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="file-actions">
                      <button className="download-btn">
                        <Download size={14} />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteFile(file.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Client Actions */}
          <div className="client-actions">
            <button className="client-profile-btn">
              <User size={16} />
              See Client Profile
            </button>
          </div>
        </div>
      </div>

      {/* Chat Button */}
      <button 
        className="chat-btn"
        onClick={() => setShowChat(true)}
      >
        <MessageCircle size={20} />
      </button>

      {/* Chat Modal (placeholder) */}
      {showChat && (
        <div className="chat-modal">
          <div className="chat-header">
            <h3>Chat with {project?.clientName}</h3>
            <button onClick={() => setShowChat(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="chat-content">
            <p>Chat functionality will be implemented here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectWorkspace;