(() => {
  const input = document.getElementById('keyword-input');
  const addBtn = document.getElementById('keyword-add');
  const listEl = document.getElementById('keyword-list');
  const countEl = document.getElementById('keyword-count');
  const emptyEl = document.getElementById('keyword-empty');

  if (!input) return;

  const renderKeywords = (keywords) => {
    countEl.textContent = `${keywords.length}개`;
    listEl.innerHTML = '';
    if (!keywords.length) {
      emptyEl.style.display = 'block';
      return;
    }
    emptyEl.style.display = 'none';
    keywords.forEach((k) => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.innerHTML = `${k.keyword} <button class="ghost" style="padding:4px 8px">삭제</button>`;
      chip.querySelector('button').onclick = () => removeKeyword(k.id);
      listEl.appendChild(chip);
    });
  };

  const fetchKeywords = async () => {
    try {
      const data = await window.api.get('/keywords');
      renderKeywords(data);
    } catch {
      listEl.innerHTML = '<p class="muted">키워드를 불러올 수 없습니다.</p>';
    }
  };

  const addKeyword = async () => {
    const value = input.value.trim();
    if (!value) return;
    addBtn.disabled = true;
    try {
      await window.api.post('/keywords', { keyword: value });
      input.value = '';
      fetchKeywords();
    } finally {
      addBtn.disabled = false;
    }
  };

  const removeKeyword = async (id) => {
    await window.api.delete(`/keywords/${id}`);
    fetchKeywords();
  };

  input.addEventListener('input', () => {
    addBtn.disabled = !input.value.trim();
  });
  addBtn.addEventListener('click', addKeyword);
  fetchKeywords();
})();
