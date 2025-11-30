import React, { useState } from 'react';
import api from '../api/apiClient';

const NewBookPage = () => {
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
  });

  const [images, setImages] = useState([]);
  const [lookupResult, setLookupResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searching, setSearching] = useState(false);

  // 자동 가격 제안 계산
  const getSuggestedPrice = () => {
    const baseValue = form.listPrice || lookupResult?.salePrice;
    if (!baseValue) return null;
    const base = Number(baseValue);
    if (Number.isNaN(base)) return null;

    const ratioMap = { S: 0.8, A: 0.65, B: 0.5, C: 0.4 };
    const ratio = ratioMap[form.condition] ?? 0.5;

    return Math.round(base * ratio);
  };

  const pricePlaceholder = () => {
    const suggested = getSuggestedPrice();
    if (!suggested) return '가격제안 : -원 (판매가 정보를 입력하거나 불러주세요)';
    return `가격제안 : ${suggested.toLocaleString()}원`;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = ['isbn', 'title', 'author', 'publisher', 'publishedAt', 'price', 'description'];
    const hasEmpty = required.some((key) => !String(form[key] || '').trim());
    if (hasEmpty) {
      alert('아직 빈 칸이 있습니다. 필수 항목을 모두 입력해 주세요.');
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      images.forEach((file) => data.append('images', file));

      await api.post('/books', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('등록되었습니다');
    } catch (err) {
      alert(err.response?.data?.message || '등록에 실패했습니다. 다시 시도해주세요.');
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
        ...res.data, // title, author, publisher, publishedAt
        listPrice: res.data.listPrice ? String(res.data.listPrice) : '',
      }));
    } catch (err) {
      alert('ISBN 검색 결과가 없습니다.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="container stack">
      <div className="section-heading">
        <div>
          <h2>책 등록</h2>
          <p>ISBN을 검색해 빠르게 채우고, 상태 등급을 선택해 주세요.</p>
        </div>

        <button
          type="button"
          onClick={handleIsbnSearch}
          disabled={!form.isbn || searching}
        >
          {searching ? '검색 중...' : 'ISBN 자동 채우기'}
        </button>
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

          {/* 상태 선택 */}
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

          {/* 정가 */}
          <input
            name="listPrice"
            placeholder="정가/판매가 (네이버 자동입력)"
            value={form.listPrice}
            onChange={handleChange}
          />

          {/* 판매가 */}
          <input
            name="price"
            placeholder={pricePlaceholder()}
            value={form.price}
            onChange={handleChange}
          />
        </div>

        {lookupResult?.salePrice && (
          <div className="muted">
            네이버 판매가 기준 정가: ₩{Number(lookupResult.salePrice).toLocaleString()} ·
            상태 {form.condition}일 때 제안가 약 {getSuggestedPrice()?.toLocaleString() || '-'}원
            (S 80% / A 65% / B 50% / C 40%)
          </div>
        )}

        <textarea
          name="description"
          placeholder="책에 대한 설명을 추가하세요"
          value={form.description}
          onChange={handleChange}
        />

        {/* 이미지 업로드 */}
        <input
          type="file"
          multiple
          onChange={(e) =>
            setImages(Array.from(e.target.files || []))
          }
        />

        <button type="submit" disabled={submitting}>
          {submitting ? '등록 중...' : '등록'}
        </button>
      </form>
    </div>
  );
};

export default NewBookPage;
