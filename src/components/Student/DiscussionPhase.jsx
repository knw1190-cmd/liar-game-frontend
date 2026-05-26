import { useState, useEffect, useRef } from 'react';

const DiscussionPhase = ({ playerName, messages, onSendMessage }) => {
  const [text, setText] = useState('');
  const chatEnd = useRef(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(playerName, text);
    setText('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '16px', height: '100vh', justifyContent: 'space-between' }}>
      <div className="fade-up">
        <div className="game-logo" style={{ fontSize: '16px', marginBottom: '4px' }}>💬 자유 토론</div>
        <p style={{ color: 'var(--text2)', fontSize: '11px', textAlign: 'center' }}>자유롭게 토론하며 라이어를 찾아내세요</p>
      </div>

      {/* 채팅 영역 */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px 0' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)', fontSize: '13px' }}>
            <p style={{ fontSize: '28px', marginBottom: '8px' }}>💭</p>
            <p>아직 채팅이 없습니다</p>
            <p style={{ marginTop: '4px' }}>첫 메시지를 보내보세요!</p>
          </div>
        ) : messages.map((m, i) => (
          <div key={i} className={`bubble fade-up ${m.sender === playerName ? '' : ''}`}
            style={{
              animationDelay: '0s',
              alignSelf: m.sender === playerName ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              background: m.sender === playerName ? 'var(--red-dim)' : 'var(--bg2)',
              borderColor: m.sender === playerName ? 'rgba(255,60,90,0.15)' : 'var(--border)'
            }}>
            <div className="bubble-name" style={{ color: m.sender === playerName ? 'var(--red)' : 'var(--teal)' }}>
              {m.sender} {m.sender === playerName ? '(나)' : ''}
            </div>
            <div className="bubble-text" style={{ fontSize: '14px' }}>{m.text}</div>
          </div>
        ))}
        <div ref={chatEnd} />
      </div>

      {/* 입력 영역 */}
      <div className="card fade-up delay-1" style={{ borderTop: 'none', padding: '12px', margin: 0, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <textarea value={text} onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="메시지를 입력하세요..."
            rows={1}
            style={{ flex: 1, padding: '10px 12px', fontSize: '13px', minHeight: '40px', maxHeight: '80px' }} />
          <button onClick={handleSend} className="btn btn-primary btn-sm"
            disabled={!text.trim()}
            style={{ width: 'auto', padding: '10px 16px', flexShrink: 0, borderRadius: '10px' }}>
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscussionPhase;
