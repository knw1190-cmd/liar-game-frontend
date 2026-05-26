import { useState, useEffect, useRef } from 'react';

const ResultPhase = ({ playerName, isLiar, result, scores, messages, onSendMessage, onNextRound }) => {
  const [chatText, setChatText] = useState('');
  const [chatMsgs, setChatMsgs] = useState(messages || []);
  const chatEnd = useRef(null);

  useEffect(() => {
    setChatMsgs(messages || []);
  }, [messages]);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMsgs]);

  const liarName = result?.liarName || '???';
  const correctWord = result?.correctWord || '???';
  const liarCaught = result?.liarCaught;

  const handleSend = () => {
    if (!chatText.trim()) return;
    onSendMessage(playerName, chatText);
    setChatMsgs(prev => [...prev, { sender: playerName, text: chatText }]);
    setChatText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '16px' }}>
      {/* 결과 헤더 */}
      <div className="fade-up" style={{ textAlign: 'center' }}>
        <div className="game-logo" style={{ fontSize: '18px' }}>🏆 결과 공개</div>
      </div>

      {/* 라이어 공개 */}
      <div className="card fade-up delay-1" style={{ textAlign: 'center', padding: '28px 20px' }}>
        <span className={`badge ${liarCaught ? 'badge-teal' : 'badge-red'}`} style={{ fontSize: '16px', padding: '8px 20px', marginBottom: '14px' }}>
          {liarCaught ? '✅ 시민 승리!' : '🎭 라이어 승리!'}
        </span>
        <p style={{ color: 'var(--text2)', fontSize: '12px', marginBottom: '4px', letterSpacing: '0.04em' }}>라이어</p>
        <p style={{ fontFamily: 'Black Han Sans', fontSize: '28px', color: 'var(--red)', marginBottom: '12px' }}>
          {liarName === playerName ? `${liarName} (나야! 😱)` : liarName}
        </p>
        <div style={{ height: '1px', background: 'var(--border)', margin: '12px 0' }} />
        <p style={{ color: 'var(--text2)', fontSize: '12px', marginBottom: '4px' }}>정답 단어</p>
        <span className="badge badge-gold" style={{ fontSize: '18px', padding: '6px 16px' }}>{correctWord}</span>
      </div>

      {/* 점수 */}
      <div className="card fade-up delay-2" style={{ borderTop: 'none' }}>
        <p style={{ color: 'var(--text2)', fontSize: '11px', fontWeight: 700, marginBottom: '10px', letterSpacing: '0.04em' }}>📊 점수</p>
        {(!scores || scores.length === 0) ? (
          <p style={{ color: 'var(--text3)', fontSize: '13px', textAlign: 'center', padding: '12px' }}>점수 정보가 없습니다</p>
        ) : scores.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < scores.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px', background: p.isLiar ? 'var(--red-dim)' : 'var(--bg3)', color: p.isLiar ? 'var(--red)' : 'var(--text2)' }}>
              {p.name[0]}
            </div>
            <span style={{ flex: 1, fontWeight: p.name === playerName ? 800 : 400, fontSize: '13px' }}>
              {p.name} {p.isLiar ? '🎭' : ''} {p.name === playerName ? '(나)' : ''}
            </span>
            <span style={{ fontFamily: 'Black Han Sans', fontSize: '15px', color: 'var(--teal)' }}>{p.score}점</span>
          </div>
        ))}
      </div>

      {/* 자유 발언 채팅 */}
      <div className="card fade-up delay-3" style={{ borderTop: 'none', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ color: 'var(--text2)', fontSize: '11px', fontWeight: 700, marginBottom: '10px', letterSpacing: '0.04em' }}>💬 자유 발언</p>
        <div style={{ flex: 1, maxHeight: '160px', overflowY: 'auto', marginBottom: '10px' }}>
          {chatMsgs.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontSize: '12px', textAlign: 'center', padding: '16px' }}>아직 발언이 없습니다</p>
          ) : chatMsgs.map((m, i) => (
            <div key={i} className="bubble" style={{ padding: '8px 12px', marginBottom: '6px', borderColor: m.sender === playerName ? 'rgba(255,60,90,0.15)' : 'var(--border)', background: m.sender === playerName ? 'var(--red-dim)' : 'var(--bg2)' }}>
              <div className="bubble-name" style={{ color: m.sender === playerName ? 'var(--red)' : 'var(--teal)' }}>
                {m.sender} {m.sender === playerName ? '(나)' : ''}
              </div>
              <div className="bubble-text" style={{ fontSize: '13px' }}>{m.text}</div>
            </div>
          ))}
          <div ref={chatEnd} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="text" value={chatText} onChange={e => setChatText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="소감을 남겨보세요..." className="input-field" style={{ flex: 1, fontSize: '13px', padding: '10px 12px' }} />
          <button onClick={handleSend} className="btn btn-primary btn-sm"
            disabled={!chatText.trim()} style={{ width: 'auto', padding: '10px 14px' }}>
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPhase;
