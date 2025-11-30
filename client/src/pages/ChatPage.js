import React, { useEffect, useState } from 'react';
import api from '../api/apiClient';

const ChatPage = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    api.get('/chat/rooms').then((res) => setRooms(res.data));
  }, []);

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

  const sendMessage = async () => {
    await api.post('/chat/messages', { roomId: selectedRoom.id, message: text });
    setText('');
    const res = await api.get('/chat/messages', { params: { roomId: selectedRoom.id } });
    setMessages(res.data);
  };

  return (
    <div className="container" style={{ display: 'flex', gap: '16px' }}>
      <div style={{ flex: 1 }}>
        <h3>채팅방</h3>
        {rooms.map((room) => (
          <div key={room.id} className="card" onClick={() => setSelectedRoom(room)} style={{ cursor: 'pointer' }}>
            <p>{room.book?.title}</p>
            <small>{room.status}</small>
          </div>
        ))}
      </div>
      <div style={{ flex: 2 }}>
        <h3>메시지</h3>
        {selectedRoom ? (
          <>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {messages.map((m) => (
                <div key={m.id} className="card">
                  <strong>{m.sender?.name}</strong>
                  <p>{m.message}</p>
                </div>
              ))}
            </div>
            <div>
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="메시지 입력" />
              <button onClick={sendMessage} disabled={!text}>보내기</button>
            </div>
          </>
        ) : (
          <p>채팅방을 선택하세요.</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
