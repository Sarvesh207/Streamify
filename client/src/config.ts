/// <reference types="vite/client" />
// import.meta.env is undefined outside Vite (e.g. under Jest)
export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL;
