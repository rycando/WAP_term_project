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
      <div className="card stack">
        <div className="section-heading">
          <h3>키워드 관리</h3>
          <span className="muted">{keywords.length}개</span>
        </div>
        <div className="flex">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="예: 알고리즘, 선형대수" />
          <button onClick={addKeyword} disabled={!input}>추가</button>
        </div>
        <div className="flex" style={{ flexWrap: 'wrap' }}>
          {keywords.map((k) => (
            <div key={k.id} className="chip">
              {k.keyword}
              <button className="ghost" style={{ padding: '4px 8px' }} onClick={() => removeKeyword(k.id)}>삭제</button>
            </div>
          ))}
        </div>
        {!keywords.length && <p className="muted">알림을 받고 싶은 키워드를 등록하세요.</p>}
      </div>
    </div>
  );
};

export default KeywordsPage;
