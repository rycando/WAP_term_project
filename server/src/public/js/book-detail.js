(() => {
  const { buildImageUrl, formatDate } = window.utils;
  const id = window.bookDetailConfig?.id || window.location.pathname.split('/').pop();
  const loadingEl = document.getElementById('book-loading');
  const contentEl = document.getElementById('book-content');
  const mainEl = document.getElementById('book-main');
  const imagesEl = document.getElementById('book-images');

  const renderBook = (book) => {
    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';
    const isSeller = window.currentUser && book.seller && window.currentUser.id === book.seller.id;
    mainEl.innerHTML = `
      <div class="section-heading">
        <div>
          <h2>${book.title}</h2>
          <p>${book.author} · ${book.publisher}</p>
        </div>
        <span class="chip">상태 ${book.condition}</span>
      </div>
      <div class="section-heading">
        <span class="price">${Number(book.price).toLocaleString()}원</span>
        <div class="flex">
          <span class="pill">판매자 ${book.seller?.name || '-'}</span>
          <span class="muted">출판일 ${book.publishedAt}</span>
          <span class="muted">판매자 등록일 ${formatDate(book.seller?.createdAt)}</span>
        </div>
      </div>
      <p>${book.description || ''}</p>
      <div class="button-row" id="book-actions"></div>
    `;

    const actionsEl = mainEl.querySelector('#book-actions');
    if (book.status === 'SOLD') {
      actionsEl.innerHTML += '<span class="pill muted">이 책은 판매가 완료되었습니다</span>';
    } else {
      const chatBtn = document.createElement('button');
      chatBtn.textContent = '채팅으로 문의하기';
      chatBtn.onclick = handleStartChat;
      actionsEl.appendChild(chatBtn);
    }

    if (isSeller) {
      const editBtn = document.createElement('a');
      editBtn.className = 'pill';
      editBtn.href = `/books/${id}/edit`;
      editBtn.textContent = '판매 글 수정';
      actionsEl.appendChild(editBtn);

      const delBtn = document.createElement('button');
      delBtn.className = 'danger';
      delBtn.textContent = '판매 글 삭제';
      delBtn.onclick = handleDelete;
      actionsEl.appendChild(delBtn);
    }

    const images = book.images || [];
    if (!images.length) {
      imagesEl.innerHTML = '<div class="card">등록된 이미지가 없습니다.</div>';
    } else {
      imagesEl.className = 'grid';
      imagesEl.innerHTML = images
        .map(
          (img) =>
            `<div class="card" style="padding:10px;"><img src="${buildImageUrl(img.url)}" alt="book"></div>`
        )
        .join('');
    }
  };

  const handleStartChat = async () => {
    if (!window.currentUser) {
      window.location.href = `/login?redirect=/books/${id}`;
      return;
    }
    try {
      const res = await window.api.post('/chat/rooms', { bookId: Number(id) });
      window.location.href = `/chat?roomId=${res.id}`;
    } catch {
      alert('채팅방을 생성할 수 없습니다.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('판매 글을 삭제하시겠습니까?')) return;
    try {
      await window.api.delete(`/books/${id}`);
      alert('판매 글이 삭제되었습니다.');
      window.location.href = '/';
    } catch {
      alert('판매 글을 삭제할 수 없습니다.');
    }
  };

  const bootstrap = async () => {
    try {
      const book = await window.api.get(`/books/${id}`);
      renderBook(book);
    } catch (err) {
      loadingEl.textContent = '삭제되었거나 존재하지 않는 상품입니다.';
    }
  };

  bootstrap();
})();
