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
    <div className="app-shell">
      <nav className="top-nav">
        <div className="nav-links">
          <Link to="/" className="brand">캠퍼스북</Link>
          <span className="badge">전공서 마켓</span>
        </div>
        <div className="nav-links">
          <Link className="pill" to="/books/new">판매등록</Link>
          <Link className="pill" to="/chat">채팅</Link>
          <Link className="pill" to="/keywords">키워드</Link>
        </div>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="chip">{user.name}</span>
              <button className="ghost" onClick={logout}>로그아웃</button>
              <Link className="pill" to="/me">마이페이지</Link>
            </>
          ) : (
            <>
              <Link className="pill" to="/login">로그인</Link>
              <Link className="pill" to="/register">회원가입</Link>
            </>
          )}
        </div>
      </nav>
      <main className="page">
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
      </main>
    </div>
  );
}

export default App;
