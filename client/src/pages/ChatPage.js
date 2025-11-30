import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const ChatPage = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [appointmentAt, setAppointmentAt] = useState('');
  const [appointmentPlace, setAppointmentPlace] = useState('');
  const [savingAppointment, setSavingAppointment] = useState(false);
  const [appointmentPanelOpen, setAppointmentPanelOpen] = useState({});
  const [searchParams] = useSearchParams();
  const targetRoomId = searchParams.get('roomId');
  const isSeller = selectedRoom && user?.id === selectedRoom.seller?.id;

  const toInputDateTime = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  const getDefaultAppointmentDate = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);
    const remainder = date.getMinutes() % 15;
    if (remainder) {
      date.setMinutes(date.getMinutes() + (15 - remainder));
    }
    date.setSeconds(0, 0);
    return date;
  };

  const getDefaultAppointmentValue = () => toInputDateTime(getDefaultAppointmentDate());

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

  const formatTime = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const avatarLetter = (name = '') => (name.trim()[0] || '?').toUpperCase();

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
      setAppointmentAt(getDefaultAppointmentValue());
      setAppointmentPlace('');
      return;
    }
    const hasAppointment = !!(selectedRoom.appointmentAt || selectedRoom.appointmentPlace);
    setAppointmentAt(hasAppointment ? toInputDateTime(selectedRoom.appointmentAt) : getDefaultAppointmentValue());
    setAppointmentPlace(selectedRoom.appointmentPlace || '');
    setAppointmentPanelOpen((prev) => ({
      ...prev,
      [selectedRoom.id]: isSeller && hasAppointment ? prev[selectedRoom.id] ?? true : false,
    }));
  }, [selectedRoom, isSeller]);

  const sendMessage = async () => {
    await api.post('/chat/messages', { roomId: selectedRoom.id, message: text });
    setText('');
    const res = await api.get('/chat/messages', { params: { roomId: selectedRoom.id } });
    setMessages(res.data);
  };

  const saveAppointment = async (nextAt, nextPlace) => {
    if (!selectedRoom) return;
    if (!isSeller) {
      alert('판매자만 약속을 생성하거나 변경할 수 있습니다.');
      return;
    }
    setSavingAppointment(true);
    try {
      const res = await api.post(`/chat/rooms/${selectedRoom.id}/appointment`, {
        roomId: selectedRoom.id,
        appointmentAt: nextAt,
        appointmentPlace: nextPlace,
      });
      setSelectedRoom(res.data);
      setRooms((prev) => prev.map((room) => (room.id === res.data.id ? res.data : room)));
      setAppointmentPanelOpen((prev) => ({ ...prev, [res.data.id]: true }));
    } finally {
      setSavingAppointment(false);
    }
  };

  const handleSaveAppointment = () => {
    const parsedDate = appointmentAt ? new Date(appointmentAt) : null;
    if (parsedDate) {
      if (Number.isNaN(parsedDate.getTime())) {
        alert('약속 시간을 다시 확인해주세요.');
        return;
      }
      if (parsedDate.getMinutes() % 15 !== 0) {
        alert('약속 시간은 15분 단위로 설정해주세요.');
        return;
      }
    }
    const payloadAt = parsedDate ? parsedDate.toISOString() : null;
    const payloadPlace = appointmentPlace.trim() || null;
    saveAppointment(payloadAt, payloadPlace);
  };

  const clearAppointment = () => {
    setAppointmentAt(getDefaultAppointmentValue());
    setAppointmentPlace('');
    saveAppointment(null, null);
    if (selectedRoom) {
      setAppointmentPanelOpen((prev) => ({ ...prev, [selectedRoom.id]: false }));
    }
  };

  const openAppointmentPanel = () => {
    if (!selectedRoom) return;
    const hasAppointmentNow = !!(selectedRoom.appointmentAt || selectedRoom.appointmentPlace);
    if (!hasAppointmentNow) {
      const nextDefault = getDefaultAppointmentValue();
      setAppointmentAt((prev) => {
        if (!prev) return nextDefault;
        const prevDate = new Date(prev);
        const nextDate = new Date(nextDefault);
        if (Number.isNaN(prevDate.getTime()) || prevDate < nextDate) {
          return nextDefault;
        }
        return prev;
      });
    }
    setAppointmentPanelOpen((prev) => ({ ...prev, [selectedRoom.id]: true }));
  };

  const currentPanelOpen = isSeller && selectedRoom ? appointmentPanelOpen[selectedRoom.id] : false;
  const hasAppointment = !!(selectedRoom?.appointmentAt || selectedRoom?.appointmentPlace);
  const shouldShowAppointment = hasAppointment || isSeller;
  const closeAppointmentPanel = () => {
    if (selectedRoom) {
      setAppointmentPanelOpen((prev) => ({ ...prev, [selectedRoom.id]: false }));
    }
  };

  return (
    <div className="container">
      <div className="chat-shell">
        <div className="chat-sidebar card">
          <div className="chat-sidebar-header">
            <h3>채팅</h3>
            <span className="muted">{rooms.length}개</span>
          </div>
          <div className="chat-sidebar-list">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`chat-room-card ${selectedRoom?.id === room.id ? 'active' : ''}`}
                onClick={() => setSelectedRoom(room)}
              >
                <div className="avatar">{avatarLetter(room.book?.title)}</div>
                <div className="chat-room-meta">
                  <div className="chat-room-title">
                    <h4>{room.book?.title}</h4>
                    <span className="chip subtle">{room.status}</span>
                  </div>
                  <p className="muted">판매자 {room.seller?.name} · 구매자 {room.buyer?.name}</p>
                </div>
              </div>
            ))}
            {!rooms.length && <p className="muted">아직 참여 중인 채팅방이 없습니다.</p>}
          </div>
        </div>

        <div className="chat-feed card stack">
          <div className="chat-feed-header">
            <div>
              <h3>{selectedRoom ? selectedRoom.book?.title : '채팅방을 선택하세요'}</h3>
              {selectedRoom && <p className="muted">판매자 {selectedRoom.seller?.name} · 구매자 {selectedRoom.buyer?.name}</p>}
            </div>
            {selectedRoom && (
              <div className="flex" style={{ gap: 8 }}>
                {!hasAppointment && !currentPanelOpen && isSeller && (
                  <button className="ghost" onClick={openAppointmentPanel}>
                    약속 만들기
                  </button>
                )}
                <span className="chip">{selectedRoom.status}</span>
              </div>
            )}
          </div>

          {selectedRoom ? (
            <>
              {shouldShowAppointment && (hasAppointment || currentPanelOpen || isSeller) && (
                <div className="appointment-card">
                  <div
                    className="appointment-header"
                    onClick={() =>
                      isSeller && hasAppointment
                        ? setAppointmentPanelOpen((prev) => ({ ...prev, [selectedRoom.id]: !currentPanelOpen }))
                        : undefined
                    }
                  >
                    <div>
                      <div className="flex" style={{ gap: 8 }}>
                        <h4 style={{ margin: 0 }}>약속</h4>
                        <span className="chip">{hasAppointment ? '예약됨' : '작성 중'}</span>
                      </div>
                      <p className="muted" style={{ margin: '4px 0 0' }}>{formatAppointment(selectedRoom.appointmentAt, selectedRoom.appointmentPlace)}</p>
                    </div>
                    {isSeller && (
                      hasAppointment ? (
                        <button
                          className="ghost"
                          style={{ padding: '6px 10px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setAppointmentPanelOpen((prev) => ({ ...prev, [selectedRoom.id]: !currentPanelOpen }));
                          }}
                        >
                          {currentPanelOpen ? '접기' : '펼치기'}
                        </button>
                      ) : (
                        <button
                          className="ghost"
                          style={{ padding: '6px 10px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            closeAppointmentPanel();
                          }}
                        >
                          닫기
                        </button>
                      )
                    )}
                  </div>
                  {currentPanelOpen && isSeller && (
                    <div className="appointment-body">
                      <div className="form-grid">
                        <input
                          type="datetime-local"
                          step={900}
                          value={appointmentAt}
                          onChange={(e) => setAppointmentAt(e.target.value)}
                          disabled={!isSeller}
                          placeholder="약속 시간"
                        />
                        <input
                          value={appointmentPlace}
                          onChange={(e) => setAppointmentPlace(e.target.value)}
                          disabled={!isSeller}
                          placeholder="장소 또는 링크"
                        />
                      </div>
                      {isSeller && (
                        <div className="flex" style={{ marginTop: 10 }}>
                          <button onClick={handleSaveAppointment} disabled={savingAppointment}>
                            {savingAppointment ? '저장 중...' : '약속 저장'}
                          </button>
                          {hasAppointment && (
                            <button
                              className="ghost"
                              onClick={clearAppointment}
                              disabled={savingAppointment || (!selectedRoom.appointmentAt && !selectedRoom.appointmentPlace)}
                            >
                              약속 비우기
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="message-list">
                {messages.map((m) => {
                  const mine = user?.id === m.sender?.id;
                  return (
                    <div key={m.id} className={`message-row ${mine ? 'mine' : ''}`}>
                      <div className="avatar small">{avatarLetter(m.sender?.name)}</div>
                      <div className={`bubble ${mine ? 'me' : ''}`}>
                        <div className="bubble-meta">
                          <strong>{m.sender?.name}</strong>
                          <span className="muted">{formatTime(m.createdAt)}</span>
                        </div>
                        <p style={{ margin: 0 }}>{m.message}</p>
                      </div>
                    </div>
                  );
                })}
                {!messages.length && <p className="muted">메시지가 없습니다. 인사를 남겨보세요!</p>}
              </div>
              <div className="message-input">
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="메시지를 입력하세요" />
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
