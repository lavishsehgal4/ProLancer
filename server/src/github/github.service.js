const axios = require("axios");
const { Buffer } = require("buffer");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;

const githubAPI = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "prolancer-app",
  },
});

// 1️⃣ CREATE REPOSITORY
async function createRepository(repoName, description, freelancerGithub, clientGithub) {
  try {
    const repoResponse = await githubAPI.post("/user/repos", {
      name: repoName,
      description: description || "ProLancer project repository",
      private: true,
    });

    const repoUrl = repoResponse.data.html_url;

    // Add Freelancer (write)
    if (freelancerGithub) {
      await addCollaborator(repoName, freelancerGithub, "push");
    }

    // Add Client (read)
    if (clientGithub) {
      await addCollaborator(repoName, clientGithub, "pull");
    }

    // Create README.md
    const readme = `# ${repoName}

This repository was automatically created by ProLancer when the freelancer accepted the project.

## Project Information
${description || "No description provided."}
`;

    await createOrUpdateFile(repoName, "README.md", readme, "Initial commit");

    return { success: true, repoUrl, repoName };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create GitHub repository",
      error: error.response?.data || error.message,
    };
  }
}

// 2️⃣ ADD COLLABORATOR
async function addCollaborator(repoName, username, permission) {
  try {
    await githubAPI.put(
      `/repos/${GITHUB_OWNER}/${repoName}/collaborators/${username}`,
      { permission }
    );

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "Failed to add collaborator",
      error: error.response?.data || error.message,
    };
  }
}

// 3️⃣ CREATE OR UPDATE FILE
async function createOrUpdateFile(repoName, path, content, commitMessage) {
  try {
    const encoded = Buffer.from(content).toString("base64");

    await githubAPI.put(
      `/repos/${GITHUB_OWNER}/${repoName}/contents/${path}`,
      {
        message: commitMessage,
        content: encoded,
      }
    );

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create/update file",
      error: error.response?.data || error.message,
    };
  }
}

// 4️⃣ GET REPOSITORY INFO
async function getRepoInfo(repoName) {
  try {
    const response = await githubAPI.get(
      `/repos/${GITHUB_OWNER}/${repoName}`
    );

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch repository info",
      error: error.response?.data || error.message,
    };
  }
}

// 5️⃣ DELETE REPOSITORY
async function deleteRepository(repoName) {
  try {
    await githubAPI.delete(`/repos/${GITHUB_OWNER}/${repoName}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete repository",
      error: error.response?.data || error.message,
    };
  }
}

module.exports = {
  createRepository,
  addCollaborator,
  createOrUpdateFile,
  getRepoInfo,
  deleteRepository,
};
