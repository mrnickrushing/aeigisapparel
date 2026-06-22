import { api } from "./api";

const TOKEN_KEY = "aegis_admin_token";

export const getAdminToken = () => localStorage.getItem(TOKEN_KEY);
export const setAdminToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearAdminToken = () => localStorage.removeItem(TOKEN_KEY);

const authHeaders = () => ({ Authorization: `Bearer ${getAdminToken()}` });

export const adminLogin = async (password) => {
  const { data } = await api.post("/admin/login", { password });
  setAdminToken(data.token);
  return data;
};

export const fetchSubscribers = async () => {
  const { data } = await api.get("/admin/newsletter", { headers: authHeaders() });
  return data;
};

export const fetchContactMessages = async () => {
  const { data } = await api.get("/admin/contacts", { headers: authHeaders() });
  return data;
};

export const sendNewsletterBlast = async (subject, body) => {
  const { data } = await api.post(
    "/admin/newsletter/send",
    { subject, body },
    { headers: authHeaders() }
  );
  return data;
};

export const deleteSubscriber = async (id) => {
  const { data } = await api.delete(`/admin/newsletter/${id}`, { headers: authHeaders() });
  return data;
};

export const deleteContactMessage = async (id) => {
  const { data } = await api.delete(`/admin/contacts/${id}`, { headers: authHeaders() });
  return data;
};
