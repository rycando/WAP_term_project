import React, { useEffect, useState } from 'react';
import api from '../api/apiClient';

const KeywordsPage = () => {
  const [keywords, setKeywords] = useState([]);
  const [input, setInput] = useState('');

  const fetchKeywords = () => api.get('/keywords').then((res) => setKeywords(res.data));

  useEffect(() => {
    fetchKeywords();
  }, []);

  const addKeyword = async () => {
    await api.post('/keywords', { keyword: input });
    setInput('');
    fetchKeywords();
  };

  const removeKeyword = async (id) => {
    await api.delete(`/keywords/${id}`);
    fetchKeywords();
  };

  return (
    <div className="container">
      <h3>키워드 관리</h3>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="키워드" />
      <button onClick={addKeyword} disabled={!input}>추가</button>
      {keywords.map((k) => (
        <div key={k.id} className="card">
          {k.keyword}
          <button onClick={() => removeKeyword(k.id)}>삭제</button>
        </div>
      ))}
    </div>
  );
};

export default KeywordsPage;
