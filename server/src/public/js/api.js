const apiBase = '/api';

const api = {
  async request(path, options = {}) {
    const isFormData = options.body instanceof FormData;
    const body =
      options.body && !isFormData && typeof options.body === 'object'
        ? JSON.stringify(options.body)
        : options.body;
    const res = await fetch(`${apiBase}${path}`, {
      credentials: 'include',
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers || {}),
      },
      ...options,
      body,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }
    if (res.status === 204) return null;
    return res.json();
  },
  get(path, params) {
    const query = params
      ? `?${new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== null)).toString()}`
      : '';
    return this.request(`${path}${query}`, { method: 'GET' });
  },
  post(path, body) {
    return this.request(path, { method: 'POST', body: JSON.stringify(body) });
  },
  put(path, body) {
    return this.request(path, { method: 'PUT', body: JSON.stringify(body) });
  },
  delete(path) {
    return this.request(path, { method: 'DELETE' });
  },
};

window.api = api;
