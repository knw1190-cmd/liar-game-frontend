import { useState } from 'react';

const WordSetManager = ({ wordSets, onAddWordSet, onDeleteWordSet, onClose }) => {
  const [topic, setTopic] = useState('');
  const [words, setWords] = useState('');

  const handleAdd = () => {
    if (!topic.trim() || !words.trim()) return;
    onAddWordSet(topic.trim(), words.trim());
    setTopic('');
    setWords('');
  };

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
        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'Black Han Sans', fontSize: '16px', color: 'var(--text)' }}>📚 단어세트 관리</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ color: 'var(--text2)' }}>✕ 닫기</button>
        </div>

        {/* 새 단어세트 추가 */}
        <div className="card" style={{ borderTop: 'none', padding: '16px', marginBottom: '16px' }}>
          <p style={{ color: 'var(--text2)', fontSize: '11px', fontWeight: 700, marginBottom: '10px', letterSpacing: '0.04em' }}>새 단어세트 추가</p>
          <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
            placeholder="주제 (예: 동물)" className="input-field" style={{ marginBottom: '8px', fontSize: '13px', padding: '10px 12px' }} />
          <input type="text" value={words} onChange={e => setWords(e.target.value)}
            placeholder="단어들 (예: 사자,호랑이,곰)" className="input-field" style={{ marginBottom: '10px', fontSize: '13px', padding: '10px 12px' }} />
          <button onClick={handleAdd} className="btn btn-primary btn-sm" disabled={!topic.trim() || !words.trim()}>
            추가하기
          </button>
        </div>

        {/* 목록 */}
        {(!wordSets || wordSets.length === 0) ? (
          <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '20px', fontSize: '13px' }}>등록된 단어세트가 없습니다</p>
        ) : wordSets.map((ws, i) => (
          <div key={i} className="fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 14px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="badge badge-gold">{ws.topic}</span>
                <button onClick={() => onDeleteWordSet(ws.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', padding: '4px 8px', fontSize: '11px' }}>
                  삭제
                </button>
              </div>
              <p style={{ color: 'var(--text2)', fontSize: '12px' }}>{ws.words}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordSetManager;
