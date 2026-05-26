const TeamManager = ({ teams, onAddTeam, onDeleteTeam, onClose }) => {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-end', zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'var(--bg)', width: '100%', maxHeight: '85vh', overflowY: 'auto',
        borderRadius: '20px 20px 0 0', padding: '24px 20px 30px',
        borderTop: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'Black Han Sans', fontSize: '16px', color: 'var(--text)' }}>👥 모둠 명단</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ color: 'var(--text2)' }}>✕ 닫기</button>
        </div>
        {(!teams || teams.length === 0) ? (
          <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '30px', fontSize: '13px' }}>등록된 모둠이 없습니다</p>
        ) : teams.map((t, i) => (
          <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 14px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>{t.teamName}</span>
              <button onClick={() => onDeleteTeam(t.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', padding: '4px 8px', fontSize: '11px' }}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManager;
