import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { buildImageUrl } from '../utils/imagePaths';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? '-'
      : date.toLocaleDateString('ko-KR');
  };

  useEffect(() => {
    api
      .get(`/books/${id}`)
      .then((res) => setBook(res.data))
      .catch(() => {
        alert('삭제되었거나 존재하지 않는 상품입니다.');
        navigate('/');
      });
  }, [id, navigate]);

  const handleStartChat = async () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (book?.status === 'SOLD' && user?.id !== book.seller?.id) {
      alert('이미 판매 완료된 상품입니다.');
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

  const handleDelete = async () => {
    if (!window.confirm('판매 글을 삭제하시겠습니까?')) return;
    setDeleting(true);
    try {
      await api.delete(`/books/${id}`);
      alert('판매 글이 삭제되었습니다.');
      navigate('/');
    } catch (err) {
      alert('판매 글을 삭제할 수 없습니다.');
    } finally {
      setDeleting(false);
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
            <span className="muted">판매자 등록일 {formatDate(book.seller?.createdAt)}</span>
          </div>
        </div>
        <p>{book.description}</p>
        <div className="flex" style={{ gap: 10 }}>
          <button onClick={handleStartChat} disabled={creatingRoom}>
            {creatingRoom ? '채팅방 생성 중...' : '채팅으로 문의하기'}
          </button>
          {user?.id === book.seller?.id && (
            <button
              className="danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? '삭제 중...' : '판매 글 삭제'}
            </button>
          )}
          <button className="ghost" onClick={() => navigate(-1)}>목록으로</button>
        </div>
      </div>

      {book.images?.length ? (
        <div className="grid">
          {book.images.map((img) => (
            <div key={img.id} className="card" style={{ padding: 10 }}>
              <img src={buildImageUrl(img.url) || undefined} alt="book" />
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
