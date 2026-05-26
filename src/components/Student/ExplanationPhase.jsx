import { useState, useEffect } from 'react';

const TimerCircle = ({ timeLeft, totalTime }) => {
  const radius = 20;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - timeLeft / (totalTime || 30));
  const critical = timeLeft <= 10;
  const color = critical ? 'var(--gold)' : 'var(--red)';

  return (
    <div className="timer-container">
      <svg className="timer-svg" viewBox="0 0 48 48">
        <circle className="timer-track" cx="24" cy="24" r={radius} />
        <circle className="timer-progress" cx="24" cy="24" r={radius}
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset} />
      </svg>
      <div className={`timer-number ${critical ? 'critical' : ''}`}>
        {timeLeft}
      </div>
    </div>
  );
};

const ExplanationPhase = ({ playerName, isMyTurn, timeLeft, totalTime = 30, isCriticalTime, onSubmitExplanation, explanations = [] }) => {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (text.length < 10) return;
    setSubmitted(true);
    onSubmitExplanation(playerName, text);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '16px' }}>
      {/* 헤더 + 타이머 */}
      <div className="status-bar fade-up">
        <div>
          <p style={{ fontFamily: 'Black Han Sans', fontSize: '14px', color: 'var(--text)' }}>설명 단계</p>
          <p style={{ color: 'var(--text2)', fontSize: '11px' }}>최소 10자</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isMyTurn && <span className="status-dot status-dot-red"></span>}
          <TimerCircle timeLeft={timeLeft} totalTime={totalTime} />
        </div>
      </div>

      {/* 순서 트랙 */}
      <div className="card fade-up delay-1" style={{ borderTop: 'none', padding: '14px 16px' }}>
        <p style={{ color: 'var(--text2)', fontSize: '11px', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.04em' }}>설명 순서</p>
        <div className="order-track">
          {explanations.length > 0 ? explanations.map((e, i) => (
            <div key={i}
              className={`order-item ${e.done ? 'order-done' : e.name === playerName && isMyTurn ? 'order-active' : 'order-pending'}`}
              title={e.name}>
              {e.done ? '✓' : e.name[0]}
            </div>
          )) : (
            <p style={{ color: 'var(--text3)', fontSize: '12px' }}>순서 배정 중...</p>
          )}
        </div>
      </div>

      {/* 본인 차례 — 입력창 */}
      {isMyTurn && !submitted && (
        <div className="card card-highlight fade-up delay-2">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="status-dot status-dot-red" style={{ width: 10, height: 10 }}></span>
            <span style={{ fontFamily: 'Black Han Sans', fontSize: '15px', color: 'var(--red)' }}>내 차례</span>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="주제에 대해 설명해보세요..."
            rows={4} maxLength={500}
            style={{ marginBottom: '8px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: text.length >= 10 ? 'var(--teal)' : 'var(--red)', fontSize: '12px', fontWeight: 700 }}>
              {text.length}/10자{text.length >= 10 ? ' ✅' : ''}
            </span>
            {timeLeft <= 10 && (
              <span style={{ color: 'var(--gold)', fontSize: '12px', fontWeight: 700 }}>⏰ 마감 임박!</span>
            )}
          </div>
          <button onClick={handleSubmit} className="btn btn-primary" disabled={text.length < 10} style={{ marginTop: '14px' }}>
            설명 제출하기
          </button>
        </div>
      )}

      {/* 제출 완료 */}
      {submitted && (
        <div className="fade-up" style={{ background: 'var(--teal-dim)', border: '1px solid rgba(45,212,191,0.2)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--teal)', fontFamily: 'Black Han Sans', fontSize: '16px' }}>✅ 설명 제출 완료!</p>
          <p style={{ color: 'var(--text2)', fontSize: '12px', marginTop: '4px' }}>모든 학생의 설명이 끝날 때까지 기다려주세요</p>
        </div>
      )}

      {/* 다른 사람 차례 */}
      {!isMyTurn && !submitted && (
        <div className="card fade-up delay-2" style={{ textAlign: 'center', borderTop: 'none', padding: '24px' }}>
          <div className="spinner" style={{ width: '28px', height: '28px', borderWidth: '2px', margin: '0 auto 12px' }}></div>
          <p style={{ fontFamily: 'Black Han Sans', fontSize: '15px', color: 'var(--gold)' }}>다른 학생 설명 중...</p>
          <p style={{ color: 'var(--text3)', fontSize: '12px', marginTop: '6px' }}>내 차례가 되면 입력창이 활성화됩니다</p>
        </div>
      )}

      {/* 제출된 설명들 */}
      {explanations.filter(e => e.done && e.text).map((e, i) => (
        <div key={i} className="bubble fade-up" style={{ animationDelay: `${0.1 * i}s` }}>
          <div className="bubble-name">{e.name}</div>
          <div className="bubble-text">{e.text}</div>
        </div>
      ))}
    </div>
  );
};

export default ExplanationPhase;
