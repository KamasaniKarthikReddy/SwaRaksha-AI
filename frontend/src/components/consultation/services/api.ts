
const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || `http://localhost:3000`;
const ML_URL = (import.meta as any).env?.VITE_ML_URL || `http://localhost:8000`;

export {
    BACKEND_URL,
    ML_URL,
};
