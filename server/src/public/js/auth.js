(() => {
  const loginForm = document.getElementById('login-form');
  const loginBtn = document.getElementById('login-button');
  const loginError = document.getElementById('login-error');
  const registerForm = document.getElementById('register-form');
  const registerBtn = document.getElementById('register-button');
  const registerError = document.getElementById('register-error');

  const handleLogin = async (e) => {
    e.preventDefault();
    loginError.style.display = 'none';
    loginBtn.disabled = true;
    const formData = new FormData(loginForm);
    try {
      await window.api.post('/auth/login', Object.fromEntries(formData.entries()));
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect') || '/';
      window.location.href = redirect;
    } catch (err) {
      loginError.textContent = '로그인에 실패했습니다. 아이디/비밀번호를 확인해주세요.';
      loginError.style.display = 'block';
    } finally {
      loginBtn.disabled = false;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    registerError.style.display = 'none';
    registerBtn.disabled = true;
    const formData = new FormData(registerForm);
    try {
      await window.api.post('/auth/register', Object.fromEntries(formData.entries()));
      window.location.href = '/';
    } catch (err) {
      registerError.textContent = '회원가입에 실패했습니다. 이미 가입된 이메일인지 확인해주세요.';
      registerError.style.display = 'block';
    } finally {
      registerBtn.disabled = false;
    }
  };

  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (registerForm) registerForm.addEventListener('submit', handleRegister);
})();
