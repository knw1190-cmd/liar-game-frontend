import { useState } from 'react';

const WordConfirm = ({ playerName, isLiar, assignedWord, topic, onConfirmWord }) => {
  const [showWord, setShowWord] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed(true);
    onConfirmWord();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '20px' }}>
      <div className="fade-up" style={{ textAlign: 'center' }}>
        <div className="game-logo" style={{ fontSize: '18px' }}>단어 확인</div>
        <p style={{ color: 'var(--text2)', fontSize: '12px', marginTop: '4px'}}>옆 사람이 보지 않게 조심하세요</p>
      </div>

      {!showWord ? (
        /* 탭해서 확인 */
        <div className="fade-up delay-1" onClick={() => setShowWord(true)}
          style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'center', padding: '40px 20px', background: 'var(--card)', border: '2px dashed var(--border)', borderRadius: '16px', transition: 'all 0.2s' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>👆</div>
          <p style={{ fontFamily: 'Black Han Sans', fontSize: '18px', color: 'var(--text2)' }}>탭해서 단어 확인</p>
          <p style={{ color: 'var(--text3)', fontSize: '12px', marginTop: '8px' }}>화면을 누르면 단어가 나타납니다</p>
        </div>
      ) : (
        /* 단어 표시 */
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isLiar ? (
            <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
              <span className="badge badge-red" style={{ marginBottom: '16px', fontSize: '14px', padding: '6px 16px' }}>🎭 당신이 라이어입니다!</span>
              <p style={{ color: 'var(--text2)', fontSize: '13px', marginBottom: '8px' }}>주제</p>
              <span className="badge badge-gold" style={{ fontSize: '16px', padding: '8px 20px' }}>{topic || '???'}</span>
              <p style={{ color: 'var(--text3)', fontSize: '12px', marginTop: '16px' }}>주제만 알고 있어요. 단어를 유추하세요!</p>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
              <span className="badge badge-gold" style={{ marginBottom: '16px', fontSize: '14px', padding: '6px 16px' }}>{topic || '주제'}</span>
              <p style={{ fontFamily: 'Black Han Sans', fontSize: '36px', color: 'var(--red)', margin: '12px 0', letterSpacing: '0.05em' }}>{assignedWord || '???'}</p>
              <p style={{ color: 'var(--text3)', fontSize: '12px' }}>이 단어가 라이어에게 들키지 않게 설명하세요</p>
            </div>
          )}

          {!isConfirmed ? (
            <button onClick={handleConfirm} className="btn btn-primary fade-up delay-2">
              단어 확인 완료 ✅
            </button>
          ) : (
            <div className="fade-up delay-2" style={{ background: 'var(--teal-dim)', border: '1px solid rgba(45,212,191,0.2)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
              <p style={{ color: 'var(--teal)', fontWeight: 800, fontSize: '14px' }}>✅ 확인 완료!</p>
              <p style={{ color: 'var(--text2)', fontSize: '12px', marginTop: '4px' }}>모든 학생이 확인할 때까지 기다려주세요</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WordConfirm;
