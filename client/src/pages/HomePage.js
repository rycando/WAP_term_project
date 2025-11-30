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
    <div className="container">
      <h2>중고 전공 도서</h2>
      {books.map((book) => (
        <div key={book.id} className="card">
          <Link to={`/books/${book.id}`}>
            <h3>{book.title}</h3>
          </Link>
          <p>{book.author}</p>
          <p>₩{book.price}</p>
        </div>
      ))}
      {user && (
        <div className="card">
          <h3>키워드 알림</h3>
          {alerts.map((book) => (
            <div key={book.id}>
              <Link to={`/books/${book.id}`}>{book.title}</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
