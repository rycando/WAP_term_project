import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NewBookPage from './pages/NewBookPage';
import BookDetailPage from './pages/BookDetailPage';
import MyPage from './pages/MyPage';
import ChatPage from './pages/ChatPage';
import KeywordsPage from './pages/KeywordsPage';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="container">로딩 중...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user, logout } = useAuth();
  return (
    <div>
      <nav>
        <Link to="/">캠퍼스북</Link>
        <Link to="/books/new">판매등록</Link>
        <Link to="/chat">채팅</Link>
        <Link to="/keywords">키워드</Link>
        {user ? (
          <>
            <span style={{ marginLeft: 'auto' }}>{user.name}</span>
            <button onClick={logout}>로그아웃</button>
            <Link to="/me">마이페이지</Link>
          </>
        ) : (
          <>
            <Link to="/login">로그인</Link>
            <Link to="/register">회원가입</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/books/new" element={<PrivateRoute><NewBookPage /></PrivateRoute>} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/me" element={<PrivateRoute><MyPage /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
        <Route path="/keywords" element={<PrivateRoute><KeywordsPage /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;
