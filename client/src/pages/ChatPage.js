import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/apiClient';

const ChatPage = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [appointmentAt, setAppointmentAt] = useState('');
  const [appointmentPlace, setAppointmentPlace] = useState('');
  const [savingAppointment, setSavingAppointment] = useState(false);
  const [searchParams] = useSearchParams();
  const targetRoomId = searchParams.get('roomId');

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
    const dateText =
      date && !Number.isNaN(date.getTime())
        ? date.toLocaleString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit' })
        : '시간 미정';
    const placeText = place || '장소 미정';
    return `${dateText} · ${placeText}`;
  };

  useEffect(() => {
    api.get('/chat/rooms').then((res) => setRooms(res.data));
  }, []);

  useEffect(() => {
    if (!rooms.length) return;
    if (targetRoomId) {
      const room = rooms.find((r) => String(r.id) === String(targetRoomId));
      if (room && (!selectedRoom || selectedRoom.id !== room.id)) {
        setSelectedRoom(room);
        return;
      }
    }
    if (!selectedRoom) {
      setSelectedRoom(rooms[0]);
    }
  }, [rooms, targetRoomId, selectedRoom]);

  useEffect(() => {
    let timer;
    if (selectedRoom) {
      const fetchMessages = () => {
        api.get('/chat/messages', { params: { roomId: selectedRoom.id } }).then((res) => setMessages(res.data));
      };
      fetchMessages();
      timer = setInterval(fetchMessages, 4000);
    }
    return () => timer && clearInterval(timer);
  }, [selectedRoom]);

  useEffect(() => {
    if (!selectedRoom) {
      setAppointmentAt('');
      setAppointmentPlace('');
      return;
    }
    setAppointmentAt(toInputDateTime(selectedRoom.appointmentAt));
    setAppointmentPlace(selectedRoom.appointmentPlace || '');
  }, [selectedRoom]);

  const sendMessage = async () => {
    await api.post('/chat/messages', { roomId: selectedRoom.id, message: text });
    setText('');
    const res = await api.get('/chat/messages', { params: { roomId: selectedRoom.id } });
    setMessages(res.data);
  };

  const saveAppointment = async (nextAt, nextPlace) => {
    if (!selectedRoom) return;
    setSavingAppointment(true);
    try {
      const res = await api.post(`/chat/rooms/${selectedRoom.id}/appointment`, {
        roomId: selectedRoom.id,
        appointmentAt: nextAt,
        appointmentPlace: nextPlace,
      });
      setSelectedRoom(res.data);
      setRooms((prev) => prev.map((room) => (room.id === res.data.id ? res.data : room)));
    } finally {
      setSavingAppointment(false);
    }
  };

  const handleSaveAppointment = () => {
    const payloadAt = appointmentAt ? new Date(appointmentAt).toISOString() : null;
    if (appointmentAt && Number.isNaN(new Date(appointmentAt).getTime())) {
      alert('약속 시간을 다시 확인해주세요.');
      return;
    }
    const payloadPlace = appointmentPlace.trim() || null;
    saveAppointment(payloadAt, payloadPlace);
  };

  const clearAppointment = () => {
    setAppointmentAt('');
    setAppointmentPlace('');
    saveAppointment(null, null);
  };

  return (
    <div className="container">
      <div className="chat-layout">
        <div className="card chat-list">
          <div className="section-heading">
            <h3>채팅방</h3>
            <span className="muted">{rooms.length}개</span>
          </div>
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`card chat-room-card ${selectedRoom?.id === room.id ? 'active' : ''}`}
              onClick={() => setSelectedRoom(room)}
            >
              <div className="section-heading">
                <div>
                  <p className="muted">#{room.id}</p>
                  <h4>{room.book?.title}</h4>
                </div>
                <span className="chip">{room.status}</span>
              </div>
              <p className="muted">판매자 {room.seller?.name} · 구매자 {room.buyer?.name}</p>
            </div>
          ))}
          {!rooms.length && <p className="muted">아직 참여 중인 채팅방이 없습니다.</p>}
        </div>

        <div className="card stack">
          <div className="section-heading">
            <h3>메시지</h3>
            <span className="muted">{selectedRoom ? selectedRoom.book?.title : '채팅방을 선택하세요'}</span>
          </div>
          {selectedRoom ? (
            <>
              <div className="card" style={{ marginBottom: 12 }}>
                <div className="section-heading">
                  <h4>약속 잡기</h4>
                  <span className="chip">{selectedRoom.appointmentAt || selectedRoom.appointmentPlace ? '약속 있음' : '미정'}</span>
                </div>
                <p className="muted">{formatAppointment(selectedRoom.appointmentAt, selectedRoom.appointmentPlace)}</p>
                <div className="form-grid" style={{ marginTop: 10 }}>
                  <input
                    type="datetime-local"
                    value={appointmentAt}
                    onChange={(e) => setAppointmentAt(e.target.value)}
                    placeholder="약속 시간"
                  />
                  <input
                    value={appointmentPlace}
                    onChange={(e) => setAppointmentPlace(e.target.value)}
                    placeholder="장소 또는 링크"
                  />
                </div>
                <div className="flex" style={{ marginTop: 10 }}>
                  <button onClick={handleSaveAppointment} disabled={savingAppointment}>
                    {savingAppointment ? '저장 중...' : '약속 저장'}
                  </button>
                  <button
                    className="ghost"
                    onClick={clearAppointment}
                    disabled={savingAppointment || (!selectedRoom.appointmentAt && !selectedRoom.appointmentPlace)}
                  >
                    약속 비우기
                  </button>
                </div>
              </div>
              <div className="message-list">
                {messages.map((m) => (
                  <div key={m.id} className="message">
                    <strong>{m.sender?.name}</strong>
                    <p style={{ margin: 0 }}>{m.message}</p>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="메시지 입력" />
                <button onClick={sendMessage} disabled={!text}>보내기</button>
              </div>
            </>
          ) : (
            <p className="muted">왼쪽에서 채팅방을 선택하거나 도서 상세 페이지에서 새 채팅방을 만드세요.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
