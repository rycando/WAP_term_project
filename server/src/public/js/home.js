(() => {
  const bookListEl = document.getElementById('book-list');
  const bookCountEl = document.getElementById('book-count');
  const alertCard = document.getElementById('alert-card');
  const alertList = document.getElementById('alert-list');
  const alertCount = document.getElementById('alert-count');
  const alertEmpty = document.getElementById('alert-empty');
  const { buildImageUrl, formatDate } = window.utils;

  const discountByCondition = { S: 80, A: 65, B: 50, C: 35 };

  const renderBooks = (books) => {
    bookListEl.innerHTML = '';
    bookCountEl.textContent = `${books.length}권`;
    if (!books.length) {
      bookListEl.innerHTML = '<div class="card">아직 등록된 도서가 없습니다.</div>';
      return;
    }

    const sorted = [...books].sort((a, b) => {
      const aOn = a.status === 'ON';
      const bOn = b.status === 'ON';
      if (aOn && !bOn) return -1;
      if (!aOn && bOn) return 1;
      return 0;
    });

    sorted.forEach((book) => {
      const imgSrc = buildImageUrl(book.mainImage) || buildImageUrl(book.images?.[0]?.url);
      const card = document.createElement('a');
      card.href = `/books/${book.id}`;
      card.className = 'card home-card';
      card.innerHTML = `
        <div class="home-thumb">
          ${
            imgSrc
              ? `<img src="${imgSrc}" alt="${book.title}">`
              : '<div class="thumb-placeholder">이미지 없음</div>'
          }
          ${book.status !== 'ON' ? '<span class="chip danger status-chip">판매완료</span>' : ''}
        </div>
        <div class="home-card-body">
          <div class="home-card-title">
            <h3>${book.title}</h3>
            <span class="chip subtle">${book.condition || '-'}</span>
          </div>
          <p class="muted">${book.author} · ${book.publisher}</p>
          <div class="home-price-row">
            <div class="stack" style="gap:6px;">
              ${
                book.listPrice != null
                  ? `<span class="muted" style="text-decoration: line-through;">${Number(book.listPrice).toLocaleString()}원</span>`
                  : ''
              }
              <div class="flex" style="align-items: baseline; gap: 8px;">
                <span class="price" style="text-decoration:${book.status !== 'ON' ? 'line-through' : 'none'};color:${book.status !== 'ON' ? 'var(--muted)' : 'var(--primary)'};">
                  ${Number(book.price).toLocaleString()}원
                </span>
                ${
                  discountByCondition[book.condition]
                    ? `<span class="chip highlight">${100 - discountByCondition[book.condition]}% 할인</span>`
                    : ''
                }
              </div>
            </div>
            <div class="home-meta">
              <span class="muted">출판 ${book.publishedAt}</span>
              <span class="muted">등록 ${formatDate(book.seller?.createdAt)}</span>
            </div>
          </div>
        </div>
      `;
      bookListEl.appendChild(card);
    });
  };

  const renderAlerts = (alerts) => {
    if (!alertCard) return;
    if (!alerts.length) {
      alertCount.textContent = '알림 없음';
      alertEmpty.style.display = 'block';
      alertList.innerHTML = '';
      alertCard.style.display = 'block';
      return;
    }
    alertCard.style.display = 'block';
    alertEmpty.style.display = 'none';
    alertCount.textContent = `${alerts.length}건 도착`;
    alertList.innerHTML = alerts
      .map((book) => `<a href="/books/${book.id}" class="pill">${book.title}</a>`)
      .join('');
  };

  const bootstrap = async () => {
    try {
      const res = await window.api.get('/books');
      renderBooks(res.data || []);
    } catch (err) {
      bookListEl.innerHTML = '<div class="card">도서를 불러올 수 없습니다.</div>';
    }

    if (window.currentUser) {
      try {
        const alerts = await window.api.get('/alerts');
        renderAlerts(alerts || []);
      } catch {
        // ignore
      }
    }
  };

  bootstrap();
})();
