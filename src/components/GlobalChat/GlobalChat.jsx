import { useState, useEffect, useRef, useMemo } from 'react';
import { jwtDecode } from "jwt-decode";
import {useNavigate} from 'react-router-dom';
import {createSocketConnection} from '../../context/socketConnections';
export default function GlobalChat() {
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState([
    { id: 1, author: 'Ravi K.', text: 'Anyone tried the Ather hub near Kazipet today?', time: '14 min ago', isSystem: false },
    { id: 2, author: 'Priya M.', text: 'Yeah it was down this morning, back up now.', time: '11 min ago', isSystem: false },
    { id: 3, author: 'System', text: 'New report: Not charging @ NIT Warangal Campus Hub', time: '7 min ago', isSystem: true },
    { id: 4, author: 'Anon', text: 'Bay 3 at Riverside is blocked by an ICE vehicle again.', time: '3 min ago', isSystem: false },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatName, setChatName] = useState('');
  const socketRef = useRef(null);
  const chatLogRef = useRef(null);
  const user = useMemo(() => {
    const token = localStorage.getItem('voltfix_token');
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (err) {
      console.error('Error decoding token:', err);
      localStorage.removeItem('voltfix_token');
      return null;
    }
  }, []);
  const existingUserId = user?._id;
  const existingUserName = user?.name;
  const targetUserId = "global-chat"; 
  useEffect(() => {
    if (localStorage.getItem('voltfix_token') && !user) navigate('/auth');
  }, [user, navigate]);
  useEffect(()=>{
    socketRef.current = createSocketConnection();
    socketRef.current.emit("joinChat",{targetUserId,existingUserId});
    socketRef.current.on("receiveMessage",(data)=>{
        setChatMessages(prev => [...prev, {
            id: Date.now(),
            author: data.existingUserName || 'Anonymous',
            text: data.message,
            time: data.time,
            isSystem: false
        }]);
    })
    return () => {
      if(socketRef.current){
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }
    }
  },[existingUserId,targetUserId]);
  const handleChatSend = (e) => {
    e.preventDefault();
    const message = chatInput.trim();
    if (!message) return;
    const author = existingUserName || chatName.trim() || 'Anonymous';
    socketRef.current.emit("sendMessage", {
      targetUserId,
      existingUserId,
      existingUserName: author,
      message,
    });
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      author,
      text: message,
      time: new Date().toISOString(),
      isSystem: false,
    }]);
    setChatInput('');
  };
  useEffect(() => {
    const log = chatLogRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [chatMessages]);

  const chatCount = chatMessages.filter((m) => !m.isSystem).length;

  return (
    <div className="chat-panel">
      <div className="chat-panel-header">
        <h3>Global chat</h3>
        <span className="chat-count">
          {chatCount} message{chatCount === 1 ? '' : 's'}
        </span>
      </div>

      <div className="chat-messages" ref={chatLogRef} role="log" aria-live="polite">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`chat-msg${msg.isSystem ? ' chat-msg--system' : ''}`}>
            <div className="chat-msg-meta">
              <span className="chat-author">{msg.isSystem ? 'System notice' : msg.author}</span>
              <span className="chat-time">{msg.time}</span>
            </div>
            <p className="chat-text">{msg.text}</p>
          </div>
        ))}
      </div>

      <form className="chat-compose" onSubmit={handleChatSend}>
        <label className="sr-only" htmlFor="chat-name">Display name (optional)</label>
        <input
          id="chat-name"
          className="chat-name-input"
          type="text"
          placeholder="Display name (optional)"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          maxLength={32}
          autoComplete="off"
        />
        <div className="chat-input-row">
          <label className="sr-only" htmlFor="chat-message">Message</label>
          <input
            id="chat-message"
            className="chat-text-input"
            type="text"
            placeholder="Write a message to other drivers"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            maxLength={280}
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary chat-send-btn" disabled={!chatInput.trim()}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
}