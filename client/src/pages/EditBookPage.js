import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { buildImageUrl } from '../utils/imagePaths';

const EditBookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    publishedAt: '',
    price: '',
    listPrice: '',
    condition: 'A',
    description: '',
    status: 'ON',
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [lookupResult, setLookupResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const getSuggestedPrice = useMemo(() => {
    return () => {
      if (!form.listPrice) return null;
      const base = Number(form.listPrice);
      if (Number.isNaN(base)) return null;

      const discountPercentMap = { S: 80, A: 65, B: 50, C: 35 };
      const ratio = (discountPercentMap[form.condition] ?? 50) / 100;

      return Math.round((base * ratio) / 1000) * 1000;
    };
  }, [form.condition, form.listPrice]);

  const pricePlaceholder = () => {
    const suggested = getSuggestedPrice();
    if (!suggested) return '가격제안 : -원';
    return `가격제안 : ${suggested.toLocaleString()}원`;
  };

  const fetchBook = useCallback(async () => {
    try {
      const res = await api.get(`/books/${id}`);
      const book = res.data;

      if (book.seller?.id !== user?.id) {
        alert('본인이 등록한 판매글만 수정할 수 있습니다.');
        navigate(`/books/${id}`);
        return;
      }

      setForm({
        isbn: book.isbn || '',
        title: book.title || '',
        author: book.author || '',
        publisher: book.publisher || '',
        publishedAt: book.publishedAt || '',
        price: book.price ? String(book.price) : '',
        listPrice: book.listPrice ? String(book.listPrice) : '',
        condition: book.condition || 'A',
        description: book.description || '',
        status: book.status || 'ON',
      });
      setExistingImages(book.images || []);
    } catch (err) {
      alert('판매글 정보를 불러올 수 없습니다.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, user?.id]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ['isbn', 'title', 'author', 'publisher', 'publishedAt', 'price', 'description'];
    const hasEmpty = requiredFields.some((field) => !String(form[field]).trim());
    if (hasEmpty) {
      alert('아직 빈 칸이 있습니다.');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      images.forEach((file) => data.append('images', file));

      await api.put(`/books/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('판매글이 수정되었습니다.');
      navigate(`/books/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleIsbnSearch = async () => {
    if (!form.isbn) return;
    setSearching(true);

    try {
      const res = await api.get(`/books/isbn/${form.isbn}`);
      setLookupResult(res.data);

      setForm((prev) => ({
        ...prev,
        ...res.data,
        listPrice: res.data.listPrice ? String(res.data.listPrice) : '',
      }));
    } catch (err) {
      alert('ISBN 검색 결과가 없습니다.');
    } finally {
      setSearching(false);
    }
  };

  if (loading) return <div className="container">불러오는 중...</div>;

  return (
    <div className="container stack">
      <div className="section-heading">
        <div>
          <h2>판매글 수정</h2>
          <p>판매 상태를 포함해 정보를 최신으로 유지하세요.</p>
        </div>

        <div className="flex" style={{ flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleIsbnSearch}
            disabled={!form.isbn || searching}
          >
            {searching ? '검색 중...' : 'ISBN 자동 채우기'}
          </button>
          <button className="ghost" type="button" onClick={() => navigate(-1)}>이전으로</button>
        </div>
      </div>

      {lookupResult && (
        <div className="chip">검색 결과: {lookupResult.title}</div>
      )}

      <form className="card stack" onSubmit={handleSubmit}>
        <div className="form-grid">

          <input
            name="isbn"
            placeholder="ISBN"
            value={form.isbn}
            onChange={handleChange}
          />

          <input
            name="title"
            placeholder="제목"
            value={form.title}
            onChange={handleChange}
          />

          <input
            name="author"
            placeholder="저자"
            value={form.author}
            onChange={handleChange}
          />

          <input
            name="publisher"
            placeholder="출판사"
            value={form.publisher}
            onChange={handleChange}
          />

          <input
            name="publishedAt"
            placeholder="출판일"
            value={form.publishedAt}
            onChange={handleChange}
          />

          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
          >
            <option value="S">S · 새 책 수준</option>
            <option value="A">A · 사용감 적음</option>
            <option value="B">B · 보통</option>
            <option value="C">C · 사용감 많음</option>
          </select>

          <input
            name="listPrice"
            placeholder="정가 (네이버 자동입력)"
            value={form.listPrice}
            onChange={handleChange}
          />

          <input
            name="price"
            placeholder={pricePlaceholder()}
            value={form.price}
            onChange={handleChange}
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="ON">판매중</option>
            <option value="SOLD">판매완료</option>
          </select>
        </div>

        <textarea
          name="description"
          placeholder="책에 대한 설명을 추가하세요"
          value={form.description}
          onChange={handleChange}
        />

        {existingImages?.length > 0 && (
          <div className="stack">
            <div className="flex" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <h4 style={{ margin: 0 }}>현재 등록된 이미지</h4>
              <span className="muted" style={{ fontSize: 14 }}>새 이미지를 업로드하면 기존 이미지가 교체됩니다.</span>
            </div>
            <div className="grid">
              {existingImages.map((img) => (
                <div key={img.id} className="card" style={{ padding: 10 }}>
                  <img src={buildImageUrl(img.url) || undefined} alt="book" />
                </div>
              ))}
            </div>
          </div>
        )}

        <input
          type="file"
          multiple
          onChange={(e) =>
            setImages(Array.from(e.target.files || []))
          }
        />

        <div className="button-row" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="ghost" onClick={() => navigate(`/books/${id}`)}>
            취소
          </button>
          <button type="submit" disabled={submitting}>
            {submitting ? '수정 중...' : '수정 완료'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBookPage;
