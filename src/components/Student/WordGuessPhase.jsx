import { useState } from 'react';

const WordGuessPhase = ({ playerName, isLiar, onSubmitGuess }) => {
  const [word, setWord] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = () => {
    if (!word.trim()) return;
    onSubmitGuess(playerName, word);
    setDone(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '20px' }}>
      {isLiar ? (
        <>
          <div className="fade-up" style={{ textAlign: 'center' }}>
            <div className="game-logo" style={{ fontSize: '18px' }}>🔍 단어 맞히기</div>
            <p style={{ color: 'var(--text2)', fontSize: '12px', marginTop: '4px' }}>설명을 듣고 단어를 유추하세요</p>
          </div>
          {!done ? (
            <>
              <div className="card card-highlight fade-up delay-1" style={{ textAlign: 'center', padding: '24px' }}>
                <p style={{ color: 'var(--red)', fontFamily: 'Black Han Sans', fontSize: '16px', marginBottom: '16px' }}>🎭 당신이 라이어입니다!</p>
                <input type="text" value={word} onChange={e => setWord(e.target.value)}
                  placeholder="정답 단어 입력" className="input-field"
                  style={{ fontFamily: 'Black Han Sans', fontSize: '20px', textAlign: 'center' }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()} autoFocus />
              </div>
              <button onClick={handleSubmit} className="btn btn-primary fade-up delay-2" disabled={!word.trim()}>
                단어 맞히기 🎯
              </button>
            </>
          ) : (
            <div className="fade-up" style={{ background: 'var(--teal-dim)', border: '1px solid rgba(45,212,191,0.2)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
              <p style={{ color: 'var(--teal)', fontFamily: 'Black Han Sans', fontSize: '18px' }}>✅ 제출 완료!</p>
              <p style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '8px' }}>결과를 기다려주세요</p>
            </div>
          )}
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '40px', textAlign: 'center' }}>
          <div className="card fade-up" style={{ padding: '40px 20px' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
            <p style={{ fontFamily: 'Black Han Sans', fontSize: '16px', color: 'var(--gold)' }}>라이어가 단어를 맞히는 중...</p>
            <p style={{ color: 'var(--text3)', fontSize: '13px', marginTop: '8px' }}>잠시만 기다려주세요</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordGuessPhase;
