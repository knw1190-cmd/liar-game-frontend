import { useState } from 'react';

const JoinRoom = ({ onJoin, onBack }) => {
  const [roomCode, setRoomCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomCode.trim() || !name.trim()) {
      setError('방 코드와 이름을 모두 입력해주세요');
      return;
    }
    setError('');
    onJoin({ roomCode: roomCode.toUpperCase(), name: name.trim() });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', paddingTop: '40px' }}>
      <div className="fade-up" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div className="game-logo" style={{ fontSize: '28px', marginBottom: '4px' }}>라이어게임</div>
        <p style={{ color: 'var(--text2)', fontSize: '13px' }}>방 코드와 이름을 입력하고 입장하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="fade-up delay-1">
        {error && (
          <div style={{ padding: '10px 14px', background: 'var(--red-dim)', border: '1px solid rgba(255,60,90,0.3)', borderRadius: '10px', marginBottom: '16px', textAlign: 'center' }}>
            <span style={{ color: 'var(--red)', fontSize: '13px', fontWeight: 700 }}>{error}</span>
          </div>
        )}

        <div className="card" style={{ borderTop: 'none', marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text2)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.03em' }}>방 코드</label>
          <input type="text" value={roomCode} onChange={e => setRoomCode(e.target.value.toUpperCase())} placeholder="선생님에게 받은 코드" className="input-field" style={{ fontFamily: 'monospace', fontSize: '18px', letterSpacing: '0.15em', textAlign: 'center' }} maxLength={8} autoFocus />
        </div>

        <div className="card" style={{ borderTop: 'none', marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text2)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.03em' }}>이름</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="이름 또는 닉네임" className="input-field" />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginBottom: '10px', padding: '16px', fontSize: '16px' }}>
          입장하기
        </button>
        <button type="button" onClick={onBack} className="btn btn-ghost">뒤로가기</button>
      </form>
    </div>
  );
};

export default JoinRoom;
