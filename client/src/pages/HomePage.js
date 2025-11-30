import React, { useEffect, useState } from 'react';
import api from '../api/apiClient';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/books').then((res) => setBooks(res.data.data));
  }, []);

  useEffect(() => {
    if (user) {
      api.get('/alerts').then((res) => setAlerts(res.data));
    }
  }, [user]);

  return (
    <div className="container stack">
      <div className="card">
        <div className="section-heading">
          <div>
            <h2>중고 전공 도서</h2>
            <p>필요한 책을 빠르게 찾고, 안 쓰는 책을 간편하게 판매하세요.</p>
          </div>
          <Link to="/books/new">
            <button>내 책 등록하기</button>
          </Link>
        </div>
      </div>

      <div className="section-heading">
        <h3>최근 등록</h3>
        <span className="muted">{books.length}권</span>
      </div>
      <div className="grid">
        {books.map((book) => (
          <Link key={book.id} to={`/books/${book.id}`} className="card" style={{ textDecoration: 'none' }}>
            <div className="section-heading">
              <h3>{book.title}</h3>
              <span className="chip">상태 {book.condition || '-'}</span>
            </div>
            <p>{book.author} · {book.publisher}</p>
            <div className="section-heading">
              <span className="price">₩{Number(book.price).toLocaleString()}</span>
              <span className="muted">{book.publishedAt}</span>
            </div>
          </Link>
        ))}
        {books.length === 0 && <div className="card">아직 등록된 도서가 없습니다.</div>}
      </div>

      {user && (
        <div className="card stack">
          <div className="section-heading">
            <h3>키워드 알림</h3>
            <span className="muted">{alerts.length ? `${alerts.length}건 도착` : '알림 없음'}</span>
          </div>
          {alerts.map((book) => (
            <Link key={book.id} to={`/books/${book.id}`} className="pill">
              {book.title}
            </Link>
          ))}
          {!alerts.length && <p className="muted">등록한 키워드와 맞는 새 책이 올라오면 알려드릴게요.</p>}
        </div>
      )}
    </div>
  );
};

export default HomePage;
