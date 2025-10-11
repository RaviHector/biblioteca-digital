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

// Article
