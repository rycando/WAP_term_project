(() => {
  const form = document.getElementById('book-form');
  if (!form) return;

  const isbnBtn = document.getElementById('isbn-search');
  const lookupResult = document.getElementById('lookup-result');
  const submitBtn = document.getElementById('submit-book');
  const bookId = form.dataset.bookId;

  const discountPercentMap = { S: 80, A: 65, B: 50, C: 35 };

  const getSuggestedPrice = () => {
    const listPrice = Number(form.elements.listPrice.value);
    if (Number.isNaN(listPrice) || !listPrice) return null;
    const condition = form.elements.condition.value;
    const ratio = (discountPercentMap[condition] ?? 50) / 100;
    return Math.round((listPrice * ratio) / 1000) * 1000;
  };

  const syncPricePlaceholder = () => {
    const suggested = getSuggestedPrice();
    form.elements.price.placeholder = suggested ? `가격제안 : ${suggested.toLocaleString()}원` : '가격제안 : -';
  };

  const fillForm = (data) => {
    ['isbn', 'title', 'author', 'publisher', 'publishedAt', 'listPrice', 'price', 'condition', 'status', 'description'].forEach((key) => {
      if (data[key] !== undefined && form.elements[key]) {
        form.elements[key].value = data[key] ?? '';
      }
    });
    syncPricePlaceholder();
  };

  const loadBookIfEditing = async () => {
    if (!bookId) return;
    try {
      const book = await window.api.get(`/books/${bookId}`);
      fillForm(book);
    } catch {
      alert('책 정보를 불러올 수 없습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ['isbn', 'title', 'author', 'publisher', 'publishedAt', 'price', 'description'];
    const hasEmpty = required.some((key) => !String(form.elements[key].value || '').trim());
    if (hasEmpty) {
      alert('아직 빈 칸이 있습니다.');
      return;
    }
    submitBtn.disabled = true;
    const data = new FormData();
    Array.from(form.elements)
      .filter((el) => ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName) && el.name && el.type !== 'file')
      .forEach((el) => data.append(el.name, el.value));

    const files = form.elements.images?.files ? Array.from(form.elements.images.files) : [];
    files.forEach((file) => data.append('images', file));

    try {
      const path = bookId ? `/books/${bookId}` : '/books';
      const method = bookId ? 'PUT' : 'POST';
      const res = await window.api.request(path, { method, body: data });
      alert(bookId ? '수정되었습니다.' : '등록되었습니다.');
      const targetId = bookId || res.id;
      window.location.href = `/books/${targetId}`;
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      submitBtn.disabled = false;
    }
  };

  const handleIsbnSearch = async () => {
    const isbn = form.elements.isbn.value.trim();
    if (!isbn) return;
    isbnBtn.disabled = true;
    try {
      const data = await window.api.get(`/books/isbn/${isbn}`);
      lookupResult.style.display = 'block';
      lookupResult.textContent = `검색 결과: ${data.title}`;
      fillForm({
        ...data,
        listPrice: data.listPrice ? String(data.listPrice) : '',
      });
    } catch {
      alert('ISBN 검색 결과가 없습니다.');
    } finally {
      isbnBtn.disabled = false;
    }
  };

  form.addEventListener('submit', handleSubmit);
  form.elements.condition?.addEventListener('change', syncPricePlaceholder);
  form.elements.listPrice?.addEventListener('input', syncPricePlaceholder);
  if (isbnBtn) isbnBtn.addEventListener('click', handleIsbnSearch);

  loadBookIfEditing();
  syncPricePlaceholder();
})();
