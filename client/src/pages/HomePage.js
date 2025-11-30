<div className="home-grid">
  {sortedBooks.map((book) => (
    <Link
      key={book.id}
      to={`/books/${book.id}`}
      className="card home-card"
      style={{ textDecoration: 'none' }}
    >
      <div className="home-thumb">
        {book.mainImage || book.images?.[0] ? (
          <img
            src={
              buildImageUrl(book.mainImage) ||
              buildImageUrl(book.images?.[0]?.url) ||
              undefined
            }
            alt={book.title}
          />
        ) : (
          <div className="thumb-placeholder">이미지 없음</div>
        )}

        {book.status !== 'ON' && (
          <span className="chip danger status-chip">판매완료</span>
        )}
      </div>

      <div className="home-card-body">
        <div className="home-card-title">
          <h3>{book.title}</h3>
          <span className="chip subtle">{book.condition || '-'}</span>
        </div>

        <p className="muted">
          {book.author} · {book.publisher}
        </p>

        <div className="home-price-row">
          <div className="stack" style={{ gap: 6 }}>
            {book.listPrice && (
              <span
                className="muted"
                style={{ textDecoration: 'line-through' }}
              >
                {Number(book.listPrice).toLocaleString()}원
              </span>
            )}

            <div className="flex" style={{ alignItems: 'baseline', gap: 8 }}>
              <span
                className="price"
                style={{
                  textDecoration:
                    book.status !== 'ON' ? 'line-through' : 'none',
                  color:
                    book.status !== 'ON' ? 'var(--muted)' : undefined,
                }}
              >
                {Number(book.price).toLocaleString()}원
              </span>

              {book.listPrice && book.price && (
                <span className="chip highlight">
                  {Math.max(
                    0,
                    Math.round(
                      (1 - Number(book.price) / Number(book.listPrice)) * 100
                    )
                  )}
                  % 할인
                </span>
              )}
            </div>
          </div>

          <div className="home-meta">
            <span className="muted">출판 {book.publishedAt}</span>
            <span className="muted">
              등록 {formatDate(book.seller?.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  ))}

  {books.length === 0 && (
    <div className="card">아직 등록된 도서가 없습니다.</div>
  )}
</div>
