const backendURL = import.meta.env.VITE_BACKEND_URL;

export const backendRaw =
  typeof backendURL === "string" ? backendURL : "localhost:3001"; // raw
export const backend = `${
  typeof backendURL === "string" ? "https" : "http"
}://${backendRaw}`; // api
export const backendwss = `${
  typeof backendURL === "string" ? "wss" : "ws"
}://${backendRaw}`; // api
// wss://backend/...
// To be delete, mock data for development
