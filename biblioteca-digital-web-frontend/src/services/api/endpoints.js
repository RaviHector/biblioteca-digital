import useAuthStore from "../../stores/auth";
import api from "./instance";

// User sessions
export const login = async (credentials) => {
  const { setAuth } = useAuthStore.getState();
  const { data } = await api.post("/login", credentials);

  setAuth(data.accessToken);
  return data;
};
export const logout = async () => {
  const { clearAuth } = useAuthStore.getState();
  await api.post("/logout");

  clearAuth();
};
export async function refresh() {
  const { setAuth } = useAuthStore.getState();
  const { data } = await api.get("/refresh");

  setAuth(data.accessToken);
  return data;
}

// Events
export const getEvents = async (filters = {}) => {
  const { data } = await api.get("/events", { params: filters });

  return data;
};
export const getEventById = async (_id) => {
  const { data } = await api.get(`/events/${_id}`);

  return data;
};
export const searchByNameEvents = async (name) => {
  const { data } = await api.get("/events/search-by-name", {
    params: { name },
  });

  return data;
};
export const searchByEvents = async (name) => {
  const { data } = await api.get("/events/search-events", {
    params: { name },
  });

  return data;
};
export const createEvent = async (eventData) => {
  const { data } = await api.post("/events", eventData);
  return data;
};
export const updateEvent = async ({ _id, newEventData }) => {
  const { data } = await api.put(`/events/${_id}`, newEventData);

  return data;
};
export const deleteEvent = async (_id) => {
  const { data } = await api.delete(`/events/${_id}`);

  return data;
};

// Editions

export const getEditions = async (filters = {}) => {
  const { data } = await api.get("/editions", { params: filters });

  return data;
};
export const getEditionById = async (_id) => {
  const { data } = await api.get(`/editions/${_id}`);

  return data;
};
export const searchByNameEditions = async (name) => {
  const { data } = await api.get("/editions/search-by-name", {
    params: { name },
  });

  return data;
};
export const searchByEditions = async (name) => {
  const { data } = await api.get("/editions/search-editions", {
    params: { name },
  });

  return data;
};
export const createEdition = async (newEdition) => {
  const { data } = await api.post("/editions", newEdition);

  return data;
};
export const updateEdition = async ({ _id, newEditionData }) => {
  const { data } = await api.put(`/editions/${_id}`, newEditionData);

  return data;
};
export const deleteEdition = async (_id) => {
  const { data } = await api.delete(`/editions/${_id}`);

  return data;
};

// Articles

export const getArticle = async (filters = {}) => {
  const { data } = await api.get("/article", { params: filters });

  return data;
};
export const getArticleById = async (_id) => {
  const { data } = await api.get(`/article/${_id}`);

  return data;
};
export const searchByNameArticle = async (name) => {
  const { data } = await api.get("/article/search-by-name", {
    params: { name },
  });

  return data;
};
export const searchByArticle = async (name) => {
  const { data } = await api.get("/article/search-article", {
    params: { name },
  });

  return data;
};
export const createArticle = async (newArticle) => {
  const config = {};
  
  // Se newArticle for FormData (com arquivo), definir headers apropriados
  if (newArticle instanceof FormData) {
    config.headers = {
      'Content-Type': 'multipart/form-data',
    };
  }
  
  const { data } = await api.post("/article", newArticle, config);

  return data;
};
export const updateArticle = async ({ _id, newArticleData }) => {
  const config = {};
  
  // Se newArticleData for FormData (com arquivo), definir headers apropriados
  if (newArticleData instanceof FormData) {
    config.headers = {
      'Content-Type': 'multipart/form-data',
    };
  }
  
  const { data } = await api.put(`/article/${_id}`, newArticleData, config);

  return data;
};
export const deleteArticle = async (_id) => {
  const { data } = await api.delete(`/article/${_id}`);

  return data;
};

export const downloadArticlePdf = async (_id) => {
  const response = await api.get(`/article/${_id}/download`, {
    responseType: 'blob'
  });
  
  return response;
};

export const bulkUploadArticles = async (formData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  
  const { data } = await api.post("/bulk-articles/upload-bulk", formData, config);
  return data;
};

export const createUser = async (userData) => {
  const { data } = await api.post("/users/register", userData);
  return data;
};

// Admin user management
export const getUsers = async (filters = {}) => {
  const { data } = await api.get("/users", { params: filters });
  return data;
};

export const createUserByAdmin = async (userData) => {
  const { data } = await api.post("/users", userData);
  return data;
};

export const updateUser = async ({ _id, ...userData }) => {
  const { data } = await api.put(`/users/${_id}`, userData);
  return data;
};

export const deleteUser = async (_id) => {
  const { data } = await api.delete(`/users/${_id}`);
  return data;
};

// Email Notifications
export const subscribeEmailNotification = async (notificationData) => {
  const { data } = await api.post("/email-notifications/subscribe", notificationData);
  return data;
};

export const unsubscribeEmailNotification = async (notificationData) => {
  const { data } = await api.delete("/email-notifications/unsubscribe", {
    data: notificationData
  });
  return data;
};

export const getEmailNotifications = async () => {
  const { data } = await api.get("/email-notifications");
  return data;
};

export const getEmailNotificationsByName = async (name) => {
  const { data } = await api.get("/email-notifications/by-name", {
    params: { name }
  });
  return data;
};

export const toggleEmailNotification = async ({ id, isActive }) => {
  const { data } = await api.patch(`/email-notifications/${id}/toggle`, { isActive });
  return data;
};
