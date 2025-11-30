import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert('아직 빈 칸이 있습니다. 모든 칸을 입력해 주세요.');
      return;
    }

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 401) {
        alert('아이디나 비밀번호가 일치하지 않습니다.');
      } else {
        alert('로그인에 실패했습니다.');
      }
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
