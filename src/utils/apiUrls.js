export const buildBackendUrl = (path) => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    const cleanPath = path ? path.replace(/^\/|\/$/g, '') : '';

    return cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl;
  };