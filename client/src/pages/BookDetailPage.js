import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [creatingRoom, setCreatingRoom] = useState(false);

  useEffect(() => {
    api.get(`/books/${id}`).then((res) => setBook(res.data));
  }, [id]);

  const handleStartChat = async () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setCreatingRoom(true);
    try {
      const res = await api.post('/chat/rooms', { bookId: Number(id) });
      navigate(`/chat?roomId=${res.data.id}`);
    } catch (err) {
      alert('채팅방을 생성할 수 없습니다.');
    } finally {
      setCreatingRoom(false);
    }
  };

  if (!book) return <div className="container">불러오는 중...</div>;

  return (
    <div className="container stack">
      <div className="card stack">
        <div className="section-heading">
          <div>
            <h2>{book.title}</h2>
            <p>{book.author} · {book.publisher}</p>
          </div>
          <span className="chip">상태 {book.condition}</span>
        </div>
        <div className="section-heading">
          <span className="price">₩{Number(book.price).toLocaleString()}</span>
          <div className="flex">
            <span className="pill">판매자 {book.seller?.name}</span>
            <span className="muted">출판일 {book.publishedAt}</span>
          </div>
        </div>
        <p>{book.description}</p>
        <div className="flex" style={{ gap: 10 }}>
          <button onClick={handleStartChat} disabled={creatingRoom}>
            {creatingRoom ? '채팅방 생성 중...' : '채팅으로 문의하기'}
          </button>
          <button className="ghost" onClick={() => navigate(-1)}>목록으로</button>
        </div>
      </div>

      {book.images?.length ? (
        <div className="grid">
          {book.images.map((img) => (
            <div key={img.id} className="card" style={{ padding: 10 }}>
              <img src={`/${img.url}`} alt="book" />
            </div>
          ))}
        </div>
      ) : (
        <div className="card">등록된 이미지가 없습니다.</div>
      )}
    </div>
  );
};

export default BookDetailPage;
