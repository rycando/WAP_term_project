import React from 'react';
import { useAuth } from '../context/AuthContext';

const MyPage = () => {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="container">
      <div className="card stack" style={{ maxWidth: 520 }}>
        <h2>마이페이지</h2>
        <p className="muted">계정 정보를 확인하세요.</p>
        <div className="chip">이메일: {user.email}</div>
        <div className="chip">이름: {user.name}</div>
        <div className="chip">전공: {user.major}</div>
      </div>
    </div>
  );
};

export default MyPage;
