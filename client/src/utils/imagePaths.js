const resolveApiOrigin = () => {
  if (process.env.REACT_APP_API_ORIGIN) return process.env.REACT_APP_API_ORIGIN;
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL.replace(/\/api\/?$/, '');
  }
  return 'http://localhost:4000';
};

const apiOrigin = resolveApiOrigin();

export const normalizeImagePath = (path) => {
  if (!path) return null;
  const uploadsIndex = path.lastIndexOf('uploads/');
  if (uploadsIndex >= 0) return path.slice(uploadsIndex);
  return path.replace(/^\//, '');
};

export const buildImageUrl = (path) => {
  const normalized = normalizeImagePath(path);
  if (!normalized) return null;
  return `${apiOrigin}/${normalized}`;
};

export const getApiOrigin = () => apiOrigin;

