import apiClient from './apiClient';

export const getChatMessages = async (jobId) => {
  console.log("🌐 [ChatAPI] Fetching messages for jobId:", jobId);
  
  try {
    console.log("🌐 [ChatAPI] Making GET request to /chat/" + jobId + "/messages");
    const response = await apiClient.get(`/chat/${jobId}/messages`);
    console.log("🌐 [ChatAPI] Response received:", response);
    console.log("🌐 [ChatAPI] Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error('🌐 [ChatAPI] Error fetching chat messages:', error);
    console.error('🌐 [ChatAPI] Error response:', error.response);
    console.error('🌐 [ChatAPI] Error status:', error.response?.status);
    console.error('🌐 [ChatAPI] Error data:', error.response?.data);
    throw error;
  }
};