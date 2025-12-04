(() => {
  const logoutForm = document.getElementById('logout-form');
  if (logoutForm) {
    logoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await window.api.post('/auth/logout', {});
      } finally {
        window.location.href = '/';
      }
    });
  }
})();
