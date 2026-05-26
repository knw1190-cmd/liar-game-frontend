import { useEffect } from 'react';

const WaitingRoom = ({ roomCode, name, players }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '20px' }}>
      <div className="fade-up" style={{ textAlign: 'center' }}>
        <div className="game-logo" style={{ fontSize: '18px' }}>대기실</div>
      </div>

      {/* 방 코드 표시 */}
      <div className="card fade-up delay-1" style={{ textAlign: 'center', padding: '24px 20px' }}>
        <p style={{ color: 'var(--text2)', fontSize: '12px', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.04em' }}>방 코드</p>
        <p style={{ fontFamily: 'monospace', fontSize: '28px', fontWeight: 'bold', color: 'var(--gold)', letterSpacing: '0.2em' }}>{roomCode}</p>
      </div>

      {/* 참가자 목록 */}
      <div className="card fade-up delay-2" style={{ borderTop: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontFamily: 'Black Han Sans', fontSize: '15px', color: 'var(--text)' }}>참가자</h3>
          <span className="badge badge-red">{players.length}명</span>
        </div>
        <div className="player-list">
          {players.length === 0 ? (
            <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '20px', fontSize: '13px' }}>아직 참가자가 없습니다</p>
          ) : players.map((p, i) => (
            <div key={i} className="player-chip fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="avatar" style={{ background: 'var(--bg3)', color: 'var(--text2)' }}>{p.name[0]}</div>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>{p.name}</span>
              </div>
              <span style={{ color: 'var(--text3)', fontSize: '11px' }}>
                {p.hasConfirmed ? '✅ 확인' : '⏳ 대기'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 대기 메시지 */}
      <div className="fade-up delay-3" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
        <div className="spinner" style={{ width: '28px', height: '28px', borderWidth: '2px', margin: '0 auto 12px' }}></div>
        <p style={{ color: 'var(--text2)', fontSize: '13px' }}>선생님이 게임을 시작할 때까지 기다려주세요</p>
      </div>
    </div>
  );
};

export default WaitingRoom;
