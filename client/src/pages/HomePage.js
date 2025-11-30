import React, { useEffect, useState } from 'react';
import api from '../api/apiClient';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const { user } = useAuth();

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

  // 이미지 경로 정규화
  const normalizeImagePath = (path) => {
    if (!path) return null;
    const idx = path.lastIndexOf('uploads/');
    if (idx >= 0) return path.slice(idx);
    return path.replace(/^\//, '');
  };

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
      <div className="grid">
        {books.map((book) => {
          const thumb =
            normalizeImagePath(book.mainImage) ||
            normalizeImagePath(book.images?.[0]?.url);

          return (
            <Link
              key={book.id}
              to={`/books/${book.id}`}
              className="card"
              style={{ textDecoration: 'none' }}
            >
              {/* 썸네일 */}
              <div className="book-thumb">
                {thumb ? (
                  <img src={`/${thumb}`} alt={book.title} />
                ) : (
                  <div className="thumb-placeholder">이미지 없음</div>
                )}
              </div>

              {/* 제목 + 상태 */}
              <div className="section-heading">
                <div
                  className="flex"
                  style={{ gap: 10, alignItems: 'center' }}
                >
                  <h3
                    style={{
                      margin: 0,
                      textDecoration:
                        book.status !== 'ON' ? 'line-through' : 'none',
                    }}
                  >
                    {book.title}
                  </h3>

                  {book.status !== 'ON' && (
                    <span className="chip danger">판매완료</span>
                  )}
                </div>

                <span className="chip">
                  상태 {book.condition || '-'}
                </span>
              </div>

              {/* 저자 / 출판사 */}
              <p>
                {book.author} · {book.publisher}
              </p>

              {/* 가격 */}
              <div className="section-heading">
                <div className="stack" style={{ gap: 6 }}>
                  {/* 정가 */}
                  {book.listPrice && (
                    <span
                      className="muted"
                      style={{ textDecoration: 'line-through' }}
                    >
                      정가 ₩{Number(book.listPrice).toLocaleString()}
                    </span>
                  )}

                  {/* 할인가 */}
                  <div
                    className="flex"
                    style={{
                      gap: 10,
                      alignItems: 'baseline',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      className="price"
                      style={{
                        textDecoration:
                          book.status !== 'ON' ? 'line-through' : 'none',
                        color:
                          book.status !== 'ON' ? 'var(--muted)' : undefined,
                      }}
                    >
                      할인가 ₩{Number(book.price).toLocaleString()}
                    </span>
                  </div>

                  {/* 할인율 */}
                  {book.listPrice && book.price && (
                    <span
                      className="chip"
                      style={{
                        background: 'var(--primary-100)',
                        color: 'var(--primary-800)',
                        width: 'fit-content',
                      }}
                    >
                      {Math.max(
                        0,
                        Math.round(
                          (1 - Number(book.price) / Number(book.listPrice)) *
                            100
                        )
                      )}
                      % 할인
                    </span>
                  )}
                </div>

                {/* 출판일 */}
                <span className="muted">{book.publishedAt}</span>
              </div>
            </Link>
          );
        })}

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
