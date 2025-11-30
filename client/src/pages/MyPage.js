import React from 'react';
import { useAuth } from '../context/AuthContext';

const MyPage = () => {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="container">
      <h2>마이페이지</h2>
      <p>이메일: {user.email}</p>
      <p>이름: {user.name}</p>
      <p>전공: {user.major}</p>
    </div>
  );
};

export default MyPage;
