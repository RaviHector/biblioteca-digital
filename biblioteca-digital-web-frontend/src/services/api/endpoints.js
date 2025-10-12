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
export const searchByEvents = async (searchTerm) => {
  const { data } = await api.get("/events/search-events", {
    params: { searchTerm },
  });

  return data;
};
export const createEvent = async (newEvent) => {
  const { data } = await api.post("/events", newEvent);

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
  const { data } = await api.get("/events", { params: filters });

  return data;
};
export const getEditionById = async (_id) => {
  const { data } = await api.get(`/events/${_id}`);

  return data;
};
export const searchByNameEditions = async (name) => {
  const { data } = await api.get("/events/search-by-name", {
    params: { name },
  });

  return data;
};
export const searchByEditions = async (searchTerm) => {
  const { data } = await api.get("/events/search-editions", {
    params: { searchTerm },
  });

  return data;
};
export const createEdition = async (newEdition) => {
  const { data } = await api.post("/events", newEdition);

  return data;
};
export const updateEdition = async ({ _id, newEditionData }) => {
  const { data } = await api.put(`/events/${_id}`, newEditionData);

  return data;
};
export const deleteEdition = async (_id) => {
  const { data } = await api.delete(`/events/${_id}`);

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
export const searchByArticle = async (searchTerm) => {
  const { data } = await api.get("/article/search-article", {
    params: { searchTerm },
  });

  return data;
};
export const createArticle = async (newArticle) => {
  const { data } = await api.post("/article", newArticle);

  return data;
};
export const updateArticle = async ({ _id, newArticleData }) => {
  const { data } = await api.put(`/article/${_id}`, newArticleData);

  return data;
};
export const deleteArticle = async (_id) => {
  const { data } = await api.delete(`/article/${_id}`);

  return data;
};
