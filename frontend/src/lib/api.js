import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export const fetchProducts = async (filters = {}) => {
  const { data } = await api.get("/products", { params: filters });
  return data;
};

export const fetchProduct = async (slug) => {
  const { data } = await api.get(`/products/${slug}`);
  return data;
};

export const fetchCampaigns = async () => {
  const { data } = await api.get("/campaigns");
  return data;
};

export const fetchCampaign = async (slug) => {
  const { data } = await api.get(`/campaigns/${slug}`);
  return data;
};

export const redeemLegacy = async (code) => {
  const { data } = await api.post("/legacy/redeem", { code });
  return data;
};

export const requestLegacy = async (payload) => {
  const { data } = await api.post("/legacy/request", payload);
  return data;
};

export const createStripeSession = async (payload) => {
  const { data } = await api.post("/checkout/session", payload);
  return data;
};

export const createManualOrder = async (payload) => {
  const { data } = await api.post("/orders/manual", payload);
  return data;
};

export const getCheckoutStatus = async (sessionId) => {
  const { data } = await api.get(`/checkout/status/${sessionId}`);
  return data;
};

export const subscribeNewsletter = async (email) => {
  const { data } = await api.post("/newsletter", { email });
  return data;
};

export const sendContact = async (payload) => {
  const { data } = await api.post("/contact", payload);
  return data;
};
