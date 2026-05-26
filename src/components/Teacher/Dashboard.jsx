import { useState, useEffect } from 'react';
import WordSetManager from './WordSetManager.jsx';
import TeamManager from './TeamManager.jsx';

const STATUS_MAP = {
  waiting: { label: '대기중', color: 'var(--text3)' },
  playing: { label: '게임중', color: 'var(--red)' },
  ended: { label: '종료', color: 'var(--text2)' }
};

const Dashboard = ({ rooms, wordSets, onCreateRoom, onStartGame, onNextRound, onEndGame, onRefreshData, onAddWordSet, onDeleteWordSet, onBack }) => {
  const [showWordSets, setShowWordSets] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState(null);
  const [timer, setTimer] = useState(30);
  const [rounds, setRounds] = useState(5);

  useEffect(() => {
    onRefreshData();
  }, []);

  const handleCreateRoom = async () => {
    if (!newTeamName.trim()) return;
    setCreating(true);
    await onCreateRoom(newTeamName.trim());
    setNewTeamName('');
    setCreating(false);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', minHeight: '100vh' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }} className="fade-up">
        <div>
          <div className="game-logo" style={{ fontSize: '18px', textAlign: 'left' }}>교사 대시보드</div>
          <p style={{ color: 'var(--text2)', fontSize: '11px' }}>{rooms.length}개 방 운영 중</p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => setShowWordSets(true)} className="btn btn-ghost btn-sm">📚 단어</button>
          <button onClick={onBack} className="btn btn-ghost btn-sm">← 나가기</button>
        </div>
      </div>

      {/* 방 생성 */}
      <div className="card fade-up delay-1" style={{ borderTop: 'none', padding: '16px' }}>
        <p style={{ color: 'var(--text2)', fontSize: '11px', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.04em' }}>➕ 새 방 만들기</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="text" value={newTeamName} onChange={e => setNewTeamName(e.target.value)}
            placeholder="모둠 이름 (예: 1모둠)" className="input-field"
            style={{ flex: 1, fontSize: '13px', padding: '10px 12px' }}
            onKeyDown={e => e.key === 'Enter' && handleCreateRoom()} />
          <button onClick={handleCreateRoom} className="btn btn-primary btn-sm" disabled={!newTeamName.trim() || creating}
            style={{ width: 'auto', padding: '10px 16px' }}>
            {creating ? '...' : '생성'}
          </button>
        </div>
      </div>

      {/* 방 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} className="fade-up delay-2">
        {rooms.length === 0 ? (
          <div style={{ background: 'var(--bg2)', border: '1px dashed var(--border)', borderRadius: '12px', padding: '30px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text3)', fontSize: '13px' }}>아직 방이 없습니다</p>
            <p style={{ color: 'var(--text3)', fontSize: '11px', marginTop: '4px' }}>위에서 방을 생성하세요</p>
          </div>
        ) : rooms.map((r, i) => (
          <div key={i} onClick={() => setSelected(r)}
            style={{
              background: 'var(--card)', border: `1px solid ${selected?.id === r.id ? 'rgba(255,60,90,0.3)' : 'var(--border)'}`,
              borderRadius: '12px', padding: '14px', cursor: 'pointer', transition: 'all 0.2s',
              borderLeft: `3px solid ${r.status === 'playing' ? 'var(--red)' : r.status === 'waiting' ? 'var(--gold)' : 'var(--text3)'}`
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 800, fontSize: '14px' }}>{r.teamName || r.team_name}</span>
                <p style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--gold)', marginTop: '2px', letterSpacing: '0.1em' }}>
                  {r.roomCode}
                </p>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: STATUS_MAP[r.status]?.color || 'var(--text3)' }}>
                {STATUS_MAP[r.status]?.label || r.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 선택된 방 설정 */}
      {selected && (
        <div className="card fade-up" style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontFamily: 'Black Han Sans', fontSize: '15px' }}>{selected.teamName || selected.team_name}</h3>
            <span className="badge badge-red" style={{ fontFamily: 'monospace', fontSize: '13px' }}>{selected.roomCode}</span>
          </div>

          {selected.status === 'waiting' && (
            <button onClick={() => onStartGame(selected.roomCode)} className="btn btn-primary">
              게임 시작 🎮
            </button>
          )}
          {selected.status === 'playing' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => onNextRound(selected.roomCode)} className="btn btn-primary" style={{ flex: 1 }}>
                다음 라운드
              </button>
              <button onClick={() => onEndGame(selected.roomCode)} className="btn btn-secondary" style={{ flex: 1, color: 'var(--red)', borderColor: 'rgba(255,60,90,0.3)' }}>
                게임 종료
              </button>
            </div>
          )}
          {selected.status === 'ended' && (
            <p style={{ color: 'var(--text3)', textAlign: 'center', fontSize: '13px' }}>종료된 게임입니다</p>
          )}
        </div>
      )}

      {/* 단어세트 모달 */}
      {showWordSets && (
        <WordSetManager wordSets={wordSets} onAddWordSet={onAddWordSet} onDeleteWordSet={onDeleteWordSet} onClose={() => setShowWordSets(false)} />
      )}
      {showTeams && (
        <TeamManager onClose={() => setShowTeams(false)} />
      )}
    </div>
  );
};

export default Dashboard;
