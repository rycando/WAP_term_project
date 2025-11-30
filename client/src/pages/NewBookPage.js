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
    condition: '',
    description: '',
  });
  const [images, setImages] = useState([]);
  const [lookupResult, setLookupResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    images.forEach((file) => data.append('images', file));
    await api.post('/books', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    alert('등록되었습니다');
  };

  const handleIsbnSearch = async () => {
    const res = await api.get(`/books/isbn/${form.isbn}`);
    setLookupResult(res.data);
    setForm((prev) => ({ ...prev, ...res.data }));
  };

  return (
    <div className="container">
      <h2>책 등록</h2>
      <button onClick={handleIsbnSearch}>ISBN 검색</button>
      {lookupResult && <p>검색 결과: {lookupResult.title}</p>}
      <form onSubmit={handleSubmit}>
        <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} />
        <input name="title" placeholder="제목" value={form.title} onChange={handleChange} />
        <input name="author" placeholder="저자" value={form.author} onChange={handleChange} />
        <input name="publisher" placeholder="출판사" value={form.publisher} onChange={handleChange} />
        <input name="publishedAt" placeholder="출판일" value={form.publishedAt} onChange={handleChange} />
        <input name="price" placeholder="가격" value={form.price} onChange={handleChange} />
        <input name="condition" placeholder="상태" value={form.condition} onChange={handleChange} />
        <textarea name="description" placeholder="설명" value={form.description} onChange={handleChange} />
        <input type="file" multiple onChange={(e) => setImages(Array.from(e.target.files || []))} />
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default NewBookPage;
