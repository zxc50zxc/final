import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({ baseURL: `${API_URL}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nabd_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: "pilgrim" | "staff" | "admin";
  preferred_lang: string;
  center_id?: number | null;
}

export interface Center {
  id: number;
  name_ar: string;
  name_en: string;
  zone_ar: string;
  zone_en: string;
  lat: number;
  lng: number;
  capacity: number;
  current_queue: number;
  avg_wait_min: number;
  occupancy_pct: number;
  crowd_level: "low" | "medium" | "high";
}

export interface TokenRes {
  access_token: string;
  user: User;
}

export async function login(email: string, password: string) {
  const { data } = await api.post<TokenRes>("/auth/login/json", { email, password });
  return data;
}

export async function register(payload: {
  email: string;
  password: string;
  full_name: string;
  role?: string;
}) {
  const { data } = await api.post<TokenRes>("/auth/register", {
    ...payload,
    role: payload.role || "pilgrim",
    preferred_lang: localStorage.getItem("nabd_lang") || "ar",
  });
  return data;
}

export async function getCenters() {
  const { data } = await api.get<Center[]>("/centers");
  return data;
}

export async function getZones() {
  const { data } = await api.get<{ id: string; name_ar: string; name_en: string }[]>("/centers/zones");
  return data;
}

export async function recommend(zone: string) {
  const { data } = await api.get("/centers/recommend", { params: { zone } });
  return data;
}

export async function createAppointment(center_id: number, slot_time: string, notes?: string) {
  const { data } = await api.post("/appointments", { center_id, slot_time, notes });
  return data;
}

export async function myAppointments() {
  const { data } = await api.get("/appointments/me");
  return data;
}

export async function createMedRequest(center_id: number, medication_name: string, notes?: string) {
  const { data } = await api.post("/medication-requests", { center_id, medication_name, notes });
  return data;
}

export async function myMedRequests() {
  const { data } = await api.get("/medication-requests/me");
  return data;
}

export async function updateCenter(centerId: number, body: { current_queue?: number; avg_wait_min?: number }) {
  const { data } = await api.patch(`/centers/${centerId}`, body);
  return data;
}

export async function centerAppointments(centerId: number) {
  const { data } = await api.get(`/appointments/center/${centerId}`);
  return data;
}

export async function centerMedRequests(centerId: number) {
  const { data } = await api.get(`/medication-requests/center/${centerId}`);
  return data;
}

export async function updateMedRequest(id: number, status: string) {
  const { data } = await api.patch(`/medication-requests/${id}`, { status });
  return data;
}

export async function getKpis() {
  const { data } = await api.get("/analytics/kpis");
  return data;
}

export async function getChart(path: string) {
  const { data } = await api.get(path);
  return data;
}
