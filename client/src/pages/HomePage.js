import React, { useEffect, useState } from 'react';
import api from '../api/apiClient';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { buildImageUrl } from '../utils/imagePaths';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const { user } = useAuth();

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? '-'
      : date.toLocaleDateString('ko-KR');
  };

  // 전체 책 불러오기
  useEffect(() => {
    api.get('/books').then((res) => setBooks(res.data.data));
  }, []);

  // 키워드 알림 불러오기
  useEffect(() => {
    if (user) {
      api.get('/alerts').then((res) => setAlerts(res.data));
    }
  }, [user]);

  return (
    <div className="container stack">

      {/* 상단 안내 카드 */}
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

      {/* 최근 등록 */}
      <div className="section-heading">
        <h3>최근 등록</h3>
        <span className="muted">{books.length}권</span>
      </div>

      {/* 책 목록 */}
      <div className="home-grid">
        {books.map((book) => (
          <Link
            key={book.id}
            to={`/books/${book.id}`}
            className="card home-card"
            style={{ textDecoration: 'none' }}
          >
            <div className="home-thumb">
              {book.mainImage || book.images?.[0] ? (
                <img
                  src={
                    buildImageUrl(book.mainImage) ||
                    buildImageUrl(book.images?.[0]?.url) ||
                    undefined
                  }
                  alt={book.title}
                />
              ) : (
                <div className="thumb-placeholder">이미지 없음</div>
              )}
              {book.status !== 'ON' && <span className="chip danger status-chip">판매완료</span>}
            </div>

            <div className="home-card-body">
              <div className="home-card-title">
                <h3>{book.title}</h3>
                <span className="chip subtle">{book.condition || '-'}</span>
              </div>

              <p className="muted">{book.author} · {book.publisher}</p>

              <div className="home-price-row">
                <div className="stack" style={{ gap: 6 }}>
                  {book.listPrice && (
                    <span className="muted" style={{ textDecoration: 'line-through' }}>
                      {Number(book.listPrice).toLocaleString()}원
                    </span>
                  )}

                  <div className="flex" style={{ alignItems: 'baseline', gap: 8 }}>
                    <span
                      className="price"
                      style={{
                        textDecoration: book.status !== 'ON' ? 'line-through' : 'none',
                        color: book.status !== 'ON' ? 'var(--muted)' : undefined
                      }}
                    >
                      {Number(book.price).toLocaleString()}원
                    </span>
                    {book.listPrice && book.price && (
                      <span className="chip highlight">
                        {Math.max(
                          0,
                          Math.round((1 - Number(book.price) / Number(book.listPrice)) * 100)
                        )}% 할인
                      </span>
                    )}
                  </div>
                </div>
                <div className="home-meta">
                  <span className="muted">출판 {book.publishedAt}</span>
                  <span className="muted">등록 {formatDate(book.seller?.createdAt)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* 책 없음 */}
        {books.length === 0 && (
          <div className="card">아직 등록된 도서가 없습니다.</div>
        )}
      </div>

      {/* 키워드 알림 */}
      {user && (
        <div className="card stack">
          <div className="section-heading">
            <h3>키워드 알림</h3>
            <span className="muted">
              {alerts.length ? `${alerts.length}건 도착` : '알림 없음'}
            </span>
          </div>

          {alerts.map((book) => (
            <Link key={book.id} to={`/books/${book.id}`} className="pill">
              {book.title}
            </Link>
          ))}

          {!alerts.length && (
            <p className="muted">
              등록한 키워드와 맞는 새 책이 올라오면 알려드릴게요.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
