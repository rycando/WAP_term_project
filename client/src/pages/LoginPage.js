import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const isEmailValid = (value) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert('아직 빈 칸이 있습니다.');
      return;
    }
    if (!isEmailValid(email)) {
      alert('이메일 형식이 올바르지 않습니다.');
      return;
    }
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message;
      alert(message || '아이디와 비밀번호를 다시 확인해주세요.');
    }
  };

  return (
    <div className="container" style={{ display: 'grid', placeItems: 'center' }}>
      <form className="card stack" style={{ maxWidth: 420, width: '100%' }} onSubmit={handleSubmit}>
        <h2>로그인</h2>
        <p className="muted">저렴한 전공서를 만나보세요.</p>
        <div>
          <input placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <input placeholder="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default LoginPage;
