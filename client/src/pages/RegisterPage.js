import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !name.trim() || !major.trim()) {
      alert('아직 빈 칸이 있습니다.');
      return;
    }
    try {
      await register({ email, password, name, major });
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || '회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="container" style={{ display: 'grid', placeItems: 'center' }}>
      <form className="card stack" style={{ maxWidth: 460, width: '100%' }} onSubmit={handleSubmit}>
        <h2>회원가입</h2>
        <p className="muted">캠퍼스북에서 전공서를 사고팔아요.</p>
        <input placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="전공" value={major} onChange={(e) => setMajor(e.target.value)} />
        <button type="submit">가입하기</button>
      </form>
    </div>
  );
};

export default RegisterPage;
