import { useState } from 'react';

const VotingPhase = ({ playerName, players, onSubmitVote }) => {
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);

  const others = players.filter(p => p.name !== playerName);

  const handleVote = () => {
    if (!selected) return;
    onSubmitVote(playerName, selected);
    setDone(true);
  };

  if (done) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '40px' }} className="fade-up">
        <div style={{ background: 'var(--teal-dim)', border: '1px solid rgba(45,212,191,0.2)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '32px', marginBottom: '12px' }}>🗳️</p>
          <p style={{ color: 'var(--teal)', fontFamily: 'Black Han Sans', fontSize: '18px' }}>투표 완료!</p>
          <p style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '8px' }}>모든 학생이 투표할 때까지 기다려주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px' }}>
      <div className="fade-up" style={{ textAlign: 'center' }}>
        <div className="game-logo" style={{ fontSize: '18px' }}>🗳️ 투표</div>
        <p style={{ color: 'var(--text2)', fontSize: '12px', marginTop: '4px' }}>라이어라고 생각되는 학생을 선택하세요</p>
      </div>

      <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {others.map((p, i) => (
          <div key={i} className={`vote-item fade-up ${selected === p.name ? 'selected' : ''}`}
            style={{ animationDelay: `${i * 0.08}s` }}
            onClick={() => setSelected(p.name)}>
            <div className="vote-check">
              {selected === p.name ? '✓' : ''}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
              <div className="avatar" style={{ background: selected === p.name ? 'var(--red-dim)' : 'var(--bg3)', color: selected === p.name ? 'var(--red)' : 'var(--text2)', width: '36px', height: '36px', fontSize: '14px' }}>
                {p.name[0]}
              </div>
              <span style={{ fontWeight: 700, fontSize: '14px', color: selected === p.name ? 'var(--red)' : 'var(--text)' }}>
                {p.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <button onClick={handleVote} className="btn btn-primary fade-up delay-2">
          {selected}님에게 투표하기 🎯
        </button>
      )}
    </div>
  );
};

export default VotingPhase;
