export const normalizeUploadPath = (path?: string | null) => {
  if (!path) return '';

  const unified = path.replace(/\\+/g, '/');
  const uploadsIndex = unified.lastIndexOf('uploads/');

  if (uploadsIndex >= 0) {
    return unified.slice(uploadsIndex);
  }

  return unified.replace(/^\//, '');
};
