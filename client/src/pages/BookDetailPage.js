import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/apiClient';

const BookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    api.get(`/books/${id}`).then((res) => setBook(res.data));
  }, [id]);

  if (!book) return <div className="container">불러오는 중...</div>;

  return (
    <div className="container">
      <h2>{book.title}</h2>
      <p>{book.author}</p>
      <p>{book.description}</p>
      {book.images?.map((img) => (
        <img key={img.id} src={`/${img.url}`} alt="book" width={120} />
      ))}
    </div>
  );
};

export default BookDetailPage;
