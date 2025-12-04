const apiOrigin = window.location.origin;

const normalizeImagePath = (path) => {
  if (!path) return null;
  const uploadsIndex = path.lastIndexOf('uploads/');
  if (uploadsIndex >= 0) return path.slice(uploadsIndex);
  return path.replace(/^\//, '');
};

const buildImageUrl = (path) => {
  const normalized = normalizeImagePath(path);
  if (!normalized) return null;
  return `${apiOrigin}/${normalized}`;
};

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('ko-KR');
};

window.utils = { buildImageUrl, normalizeImagePath, formatDate };
