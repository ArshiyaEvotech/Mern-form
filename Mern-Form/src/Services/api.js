import axios from "axios";

const envApiUrl = import.meta.env.VITE_API_URL?.trim();

export const baseURL =
  envApiUrl || (import.meta.env.DEV ? "http://localhost:5000/api" : "");

const instance = axios.create({
  baseURL,
  timeout: 10000,
});

const OFFLINE_FORMS_KEY = "offlineForms";
const OFFLINE_SUBMISSIONS_KEY = "offlineSubmissions";

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const isBrowser = typeof window !== "undefined";

const readJson = (key, fallback) => {
  if (!isBrowser) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

const createErrorResponse = (status, message) => {
  const error = new Error(message);
  error.response = {
    status,
    data: { message },
  };
  return error;
};

const shouldSkipNetworkRequest = () =>
  isBrowser &&
  typeof navigator !== "undefined" &&
  navigator.onLine === false;

export const getApiErrorMessage = (error, fallbackMessage) => {
  if (!baseURL) {
    return "Frontend is running, but VITE_API_URL is not configured.";
  }

  if (error?.code === "ECONNABORTED") {
    return `The backend at ${baseURL} took too long to respond. If it is hosted on Render, it may be waking up. Please wait a few seconds and try again.`;
  }

  if (error?.code === "ERR_NETWORK" || !error?.response) {
    return `Cannot reach the backend API at ${baseURL}. Make sure the backend server is running and accessible.`;
  }

  return error.response?.data?.message || error.message || fallbackMessage;
};

const getOfflineForms = () => readJson(OFFLINE_FORMS_KEY, []);
const saveOfflineForms = (forms) => writeJson(OFFLINE_FORMS_KEY, forms);
const getOfflineSubmissions = () => readJson(OFFLINE_SUBMISSIONS_KEY, []);
const saveOfflineSubmissions = (submissions) =>
  writeJson(OFFLINE_SUBMISSIONS_KEY, submissions);

const cacheForm = (form) => {
  const forms = getOfflineForms();
  const nextForms = forms.filter((item) => item._id !== form._id);
  nextForms.push(form);
  saveOfflineForms(nextForms);
};

const cacheForms = (forms) => {
  saveOfflineForms(forms);
};

const cacheSubmissionsForForm = (formId, submissions) => {
  const existing = getOfflineSubmissions().filter(
    (submission) => submission.formId !== formId
  );
  saveOfflineSubmissions([...existing, ...submissions]);
};

export const loginUser = async (payload) => {
  if (!baseURL) {
    throw createErrorResponse(
      500,
      "Frontend is running, but VITE_API_URL is not configured."
    );
  }

  if (shouldSkipNetworkRequest()) {
    throw createErrorResponse(
      503,
      "You are offline, so the app cannot reach the backend."
    );
  }

  try {
    return await instance.post("/auth/login", payload);
  } catch (error) {
    throw error;
  }
};

export const getForms = async () => {
  if (!baseURL) {
    throw createErrorResponse(
      500,
      "Frontend is running, but VITE_API_URL is not configured."
    );
  }

  if (shouldSkipNetworkRequest()) {
    throw createErrorResponse(
      503,
      "You are offline, so the app cannot reach the backend."
    );
  }

  try {
    const response = await instance.get("/forms");
    cacheForms(response.data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getFormById = async (id) => {
  if (!baseURL) {
    throw createErrorResponse(
      500,
      "Frontend is running, but VITE_API_URL is not configured."
    );
  }

  if (shouldSkipNetworkRequest()) {
    throw createErrorResponse(
      503,
      "You are offline, so the app cannot reach the backend."
    );
  }

  try {
    const response = await instance.get(`/forms/${id}`);
    cacheForm(response.data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createForm = async (payload) => {
  if (!baseURL) {
    throw createErrorResponse(
      500,
      "Frontend is running, but VITE_API_URL is not configured."
    );
  }

  if (shouldSkipNetworkRequest()) {
    throw createErrorResponse(
      503,
      "You are offline, so the app cannot reach the backend."
    );
  }

  try {
    const response = await instance.post("/forms", payload);
    cacheForm(response.data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteAllForms = async () => {
  if (!baseURL) {
    throw createErrorResponse(
      500,
      "Frontend is running, but VITE_API_URL is not configured."
    );
  }

  if (shouldSkipNetworkRequest()) {
    throw createErrorResponse(
      503,
      "You are offline, so the app cannot reach the backend."
    );
  }

  try {
    const response = await instance.delete("/forms");
    saveOfflineForms([]);
    saveOfflineSubmissions([]);
    return response;
  } catch (error) {
    throw error;
  }
};

export const submitForm = async (payload) => {
  if (!baseURL) {
    throw createErrorResponse(
      500,
      "Frontend is running, but VITE_API_URL is not configured."
    );
  }

  if (shouldSkipNetworkRequest()) {
    throw createErrorResponse(
      503,
      "You are offline, so the app cannot reach the backend."
    );
  }

  try {
    const response = await instance.post("/submissions", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSubmissionsByForm = async (formId) => {
  if (!baseURL) {
    throw createErrorResponse(
      500,
      "Frontend is running, but VITE_API_URL is not configured."
    );
  }

  if (shouldSkipNetworkRequest()) {
    throw createErrorResponse(
      503,
      "You are offline, so the app cannot reach the backend."
    );
  }

  try {
    const response = await instance.get(`/submissions/${formId}`);
    cacheSubmissionsForForm(formId, response.data);
    return response;
  } catch (error) {
    throw error;
  }
};

export default instance;
