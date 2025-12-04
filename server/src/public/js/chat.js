(() => {
  const roomListEl = document.getElementById('room-list');
  const roomCountEl = document.getElementById('room-count');
  const roomTitleEl = document.getElementById('room-title');
  const roomMetaEl = document.getElementById('room-meta');
  const roomActionsEl = document.getElementById('room-actions');
  const messageListEl = document.getElementById('message-list');
  const messageInput = document.getElementById('message-text');
  const sendBtn = document.getElementById('message-send');
  const appointmentContainer = document.getElementById('appointment-container');

  let rooms = [];
  let selectedRoom = null;
  let pollTimer = null;

  const params = new URLSearchParams(window.location.search);
  const targetRoomId = params.get('roomId');

  const avatarLetter = (text = '') => (text.trim()[0] || '?').toUpperCase();
  const formatTime = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };
  const toInputDateTime = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };
  const formatAppointment = (value, place) => {
    if (!value && !place) return '아직 약속이 없습니다.';
    const date = value ? new Date(value) : null;
    const dateText = date && !Number.isNaN(date.getTime())
      ? date.toLocaleString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit' })
      : '시간 미정';
    const placeText = place || '장소 미정';
    return `${dateText} · ${placeText}`;
  };

  const renderRooms = () => {
    roomListEl.innerHTML = '';
    roomCountEl.textContent = `${rooms.length}개`;
    if (!rooms.length) {
      roomListEl.innerHTML = '<p class="muted">아직 참여 중인 채팅방이 없습니다.</p>';
      return;
    }
    rooms.forEach((room) => {
      const div = document.createElement('div');
      div.className = `chat-room-card ${selectedRoom?.id === room.id ? 'active' : ''}`;
      div.innerHTML = `
        <div class="avatar">${avatarLetter(room.book?.title || '')}</div>
        <div class="chat-room-meta">
          <div class="chat-room-title">
            <h4>${room.book?.title || '도서'}</h4>
            <span class="chip subtle">${room.status}</span>
          </div>
          <p class="muted">판매자 ${room.seller?.name} · 구매자 ${room.buyer?.name}</p>
        </div>
      `;
      div.onclick = () => selectRoom(room.id);
      roomListEl.appendChild(div);
    });
  };

  const renderHeader = () => {
    if (!selectedRoom) {
      roomTitleEl.textContent = '채팅방을 선택하세요';
      roomMetaEl.textContent = '';
      roomActionsEl.innerHTML = '';
      return;
    }
    roomTitleEl.textContent = selectedRoom.book?.title || '채팅방';
    roomMetaEl.textContent = `판매자 ${selectedRoom.seller?.name} · 구매자 ${selectedRoom.buyer?.name}`;
    roomActionsEl.innerHTML = `<span class="chip">${selectedRoom.status}</span>`;
  };

  const renderMessages = (messages) => {
    messageListEl.innerHTML = '';
    if (!messages.length) {
      messageListEl.innerHTML = '<p class="muted">메시지가 없습니다. 인사를 남겨보세요!</p>';
      return;
    }
    messages.forEach((m) => {
      const mine = window.currentUser?.id === m.sender?.id;
      const row = document.createElement('div');
      row.className = `message-row ${mine ? 'mine' : ''}`;
      row.innerHTML = `
        <div class="avatar small">${avatarLetter(m.sender?.name || '')}</div>
        <div class="bubble ${mine ? 'me' : ''}">
          <div class="bubble-meta">
            <strong>${m.sender?.name || '-'}</strong>
            <span class="muted">${formatTime(m.createdAt)}</span>
          </div>
          <p style="margin:0;">${m.message}</p>
        </div>
      `;
      messageListEl.appendChild(row);
    });
    messageListEl.scrollTop = messageListEl.scrollHeight;
  };

  const renderAppointment = () => {
    appointmentContainer.innerHTML = '';
    if (!selectedRoom) return;
    const isSeller = window.currentUser?.id === selectedRoom.seller?.id;
    const hasAppointment = !!(selectedRoom.appointmentAt || selectedRoom.appointmentPlace);
    const wrapper = document.createElement('div');
    wrapper.className = 'appointment-card';
    const dateValue = toInputDateTime(selectedRoom.appointmentAt);
    wrapper.innerHTML = `
      <div class="appointment-header">
        <div>
          <div class="flex" style="gap:8px;">
            <h4 style="margin:0;">약속</h4>
            <span class="chip">${hasAppointment ? '예약됨' : '작성 중'}</span>
          </div>
          <p class="muted" style="margin:4px 0 0">${formatAppointment(selectedRoom.appointmentAt, selectedRoom.appointmentPlace)}</p>
        </div>
        ${
          isSeller
            ? `<button class="ghost" id="appointment-toggle" style="padding:6px 10px">${hasAppointment ? '수정' : '작성'}</button>`
            : ''
        }
      </div>
      <div class="appointment-body" id="appointment-body" style="display:${isSeller ? 'grid' : 'none'};">
        <div class="form-grid">
          <input id="appointment-at" type="datetime-local" step="900" value="${dateValue || ''}">
          <input id="appointment-place" placeholder="장소 또는 링크" value="${selectedRoom.appointmentPlace || ''}">
        </div>
        ${isSeller ? '<div class="flex" style="margin-top:10px;"><button id="appointment-save">약속 저장</button><button class="ghost" id="appointment-clear">약속 비우기</button></div>' : ''}
      </div>
    `;
    appointmentContainer.appendChild(wrapper);

    if (isSeller) {
      const body = wrapper.querySelector('#appointment-body');
      const toggleBtn = wrapper.querySelector('#appointment-toggle');
      toggleBtn.onclick = () => {
        body.style.display = body.style.display === 'none' ? 'grid' : 'none';
      };
      wrapper.querySelector('#appointment-save').onclick = async () => {
        const nextAt = wrapper.querySelector('#appointment-at').value;
        const nextPlace = wrapper.querySelector('#appointment-place').value;
        await saveAppointment(nextAt, nextPlace);
      };
      wrapper.querySelector('#appointment-clear').onclick = async () => {
        await saveAppointment(null, null);
        wrapper.querySelector('#appointment-at').value = '';
        wrapper.querySelector('#appointment-place').value = '';
      };
    }
  };

  const saveAppointment = async (appointmentAt, appointmentPlace) => {
    if (!selectedRoom) return;
    const isSeller = window.currentUser?.id === selectedRoom.seller?.id;
    if (!isSeller) {
      alert('판매자만 약속을 관리할 수 있습니다.');
      return;
    }
    try {
      const payloadAt = appointmentAt ? new Date(appointmentAt).toISOString() : null;
      const res = await window.api.post(`/chat/rooms/${selectedRoom.id}/appointment`, {
        roomId: selectedRoom.id,
        appointmentAt: payloadAt,
        appointmentPlace: appointmentPlace || null,
      });
      selectedRoom = res;
      rooms = rooms.map((r) => (r.id === res.id ? res : r));
      renderRooms();
      renderHeader();
      renderAppointment();
    } catch {
      alert('약속을 저장할 수 없습니다.');
    }
  };

  const selectRoom = async (id) => {
    const next = rooms.find((r) => String(r.id) === String(id));
    selectedRoom = next || null;
    renderRooms();
    renderHeader();
    renderAppointment();
    sendBtn.disabled = !selectedRoom;
    if (pollTimer) clearInterval(pollTimer);
    if (selectedRoom) {
      await fetchMessages();
      pollTimer = setInterval(fetchMessages, 4000);
    } else {
      messageListEl.innerHTML = '<p class="muted">채팅방을 선택하세요.</p>';
    }
  };

  const fetchMessages = async () => {
    if (!selectedRoom) return;
    try {
      const data = await window.api.get('/chat/messages', { roomId: selectedRoom.id });
      renderMessages(data);
    } catch {
      // ignore
    }
  };

  const fetchRooms = async () => {
    try {
      rooms = await window.api.get('/chat/rooms');
      renderRooms();
      if (rooms.length) {
        const target = targetRoomId
          ? rooms.find((r) => String(r.id) === String(targetRoomId))
          : rooms[0];
        if (target) await selectRoom(target.id);
      }
    } catch {
      roomListEl.innerHTML = '<p class="muted">채팅방을 불러올 수 없습니다.</p>';
    }
  };

  const sendMessage = async () => {
    if (!selectedRoom) return;
    const text = messageInput.value.trim();
    if (!text) return;
    sendBtn.disabled = true;
    try {
      await window.api.post('/chat/messages', { roomId: selectedRoom.id, message: text });
      messageInput.value = '';
      await fetchMessages();
    } finally {
      sendBtn.disabled = false;
    }
  };

  messageInput.addEventListener('input', () => {
    sendBtn.disabled = !messageInput.value.trim();
  });
  sendBtn.addEventListener('click', sendMessage);
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  fetchRooms();
})();
