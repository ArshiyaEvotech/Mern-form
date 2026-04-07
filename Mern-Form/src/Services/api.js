import axios from "axios";

const envApiUrl = import.meta.env.VITE_API_URL?.trim();

export const baseURL =
  envApiUrl || (import.meta.env.DEV ? "http://localhost:5000/api" : "");

const instance = axios.create({
  baseURL,
  timeout: 8000,
});

const OFFLINE_FORMS_KEY = "offlineForms";
const OFFLINE_SUBMISSIONS_KEY = "offlineSubmissions";
const DEFAULT_USERS = {
  "admin@evotech.global": {
    password: "Evotech@123",
    role: "admin",
  },
  "user@evotech.global": {
    password: "Evotech@123",
    role: "user",
  },
};

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

const createId = (prefix) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const createResponse = (data, status = 200) => ({
  data,
  status,
});

const createErrorResponse = (status, message) => {
  const error = new Error(message);
  error.response = {
    status,
    data: { message },
  };
  return error;
};

const shouldUseOfflineFallback = (error) => {
  if (!error) {
    return false;
  }

  if (!error.response) {
    return true;
  }

  return error.response.status >= 500;
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

const cacheSubmission = (submission) => {
  const submissions = getOfflineSubmissions();
  submissions.push(submission);
  saveOfflineSubmissions(submissions);
};

const cacheSubmissionsForForm = (formId, submissions) => {
  const existing = getOfflineSubmissions().filter(
    (submission) => submission.formId !== formId
  );
  saveOfflineSubmissions([...existing, ...submissions]);
};

const buildOfflineToken = (email, role) =>
  `offline-token:${btoa(JSON.stringify({ email, role }))}`;

const loginOffline = ({ email, password }) => {
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedPassword = password ?? "";
  const user = DEFAULT_USERS[normalizedEmail];

  if (!user) {
    throw createErrorResponse(401, "Invalid Email");
  }

  if (user.password !== normalizedPassword) {
    throw createErrorResponse(401, "Invalid Password");
  }

  return createResponse({
    token: buildOfflineToken(normalizedEmail, user.role),
    user: {
      email: normalizedEmail,
      role: user.role,
    },
  });
};

export const loginUser = async (payload) => {
  if (!baseURL) {
    return loginOffline(payload);
  }

  try {
    return await instance.post("/auth/login", payload);
  } catch (error) {
    if (!shouldUseOfflineFallback(error)) {
      throw error;
    }

    return loginOffline(payload);
  }
};

export const getForms = async () => {
  if (!baseURL) {
    return createResponse(getOfflineForms());
  }

  try {
    const response = await instance.get("/forms");
    cacheForms(response.data);
    return response;
  } catch (error) {
    if (!shouldUseOfflineFallback(error)) {
      throw error;
    }

    return createResponse(getOfflineForms());
  }
};

export const getFormById = async (id) => {
  if (!baseURL) {
    const form = getOfflineForms().find((item) => item._id === id);
    if (!form) {
      throw createErrorResponse(404, "Form not found");
    }
    return createResponse(form);
  }

  try {
    const response = await instance.get(`/forms/${id}`);
    cacheForm(response.data);
    return response;
  } catch (error) {
    if (!shouldUseOfflineFallback(error)) {
      throw error;
    }

    const form = getOfflineForms().find((item) => item._id === id);
    if (!form) {
      throw createErrorResponse(404, "Form not found");
    }
    return createResponse(form);
  }
};

export const createForm = async (payload) => {
  if (!baseURL) {
    const form = {
      ...payload,
      _id: createId("form"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: localStorage.getItem("userEmail") || "admin@evotech.global",
    };
    const forms = [...getOfflineForms(), form];
    saveOfflineForms(forms);
    return createResponse(form, 201);
  }

  try {
    const response = await instance.post("/forms", payload);
    cacheForm(response.data);
    return response;
  } catch (error) {
    if (!shouldUseOfflineFallback(error)) {
      throw error;
    }

    const form = {
      ...payload,
      _id: createId("form"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: localStorage.getItem("userEmail") || "admin@evotech.global",
    };
    const forms = [...getOfflineForms(), form];
    saveOfflineForms(forms);
    return createResponse(form, 201);
  }
};

export const deleteAllForms = async () => {
  if (!baseURL) {
    saveOfflineForms([]);
    saveOfflineSubmissions([]);
    return createResponse({ message: "All forms deleted successfully" });
  }

  try {
    const response = await instance.delete("/forms");
    saveOfflineForms([]);
    saveOfflineSubmissions([]);
    return response;
  } catch (error) {
    if (!shouldUseOfflineFallback(error)) {
      throw error;
    }

    saveOfflineForms([]);
    saveOfflineSubmissions([]);
    return createResponse({ message: "All forms deleted successfully" });
  }
};

export const submitForm = async (payload) => {
  if (!baseURL) {
    const submission = {
      _id: createId("submission"),
      formId: payload.formId,
      submittedBy: payload.submittedBy,
      responses: payload.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    cacheSubmission(submission);
    return createResponse({ message: "Submitted successfully" }, 201);
  }

  try {
    const response = await instance.post("/submissions", payload);
    cacheSubmission({
      _id: createId("submission"),
      formId: payload.formId,
      submittedBy: payload.submittedBy,
      responses: payload.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response;
  } catch (error) {
    if (!shouldUseOfflineFallback(error)) {
      throw error;
    }

    const submission = {
      _id: createId("submission"),
      formId: payload.formId,
      submittedBy: payload.submittedBy,
      responses: payload.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    cacheSubmission(submission);
    return createResponse({ message: "Submitted successfully" }, 201);
  }
};

export const getSubmissionsByForm = async (formId) => {
  if (!baseURL) {
    const submissions = getOfflineSubmissions().filter(
      (submission) => submission.formId === formId
    );
    return createResponse(submissions);
  }

  try {
    const response = await instance.get(`/submissions/${formId}`);
    cacheSubmissionsForForm(formId, response.data);
    return response;
  } catch (error) {
    if (!shouldUseOfflineFallback(error)) {
      throw error;
    }

    const submissions = getOfflineSubmissions().filter(
      (submission) => submission.formId === formId
    );
    return createResponse(submissions);
  }
};

export default instance;
