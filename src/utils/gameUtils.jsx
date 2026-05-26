export function generateRoomCode() {
  return Array.from({ length: 6 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('');
}

export function selectLiar(players) {
  const candidates = players.filter(p => !p.isSpectator);
  return candidates.length ? candidates[Math.floor(Math.random() * candidates.length)].name : null;
}

export function shuffleOrder(players) {
  return [...players].sort(() => Math.random() - 0.5).map((p, i) => ({ ...p, order: i + 1 }));
}

export function calcScore(name, result) {
  if (name === result.liarName) {
    if (result.liarGuessed) return 80;
    return 0;
  }
  if (result.liarCaught) return 100;
  return 150;
}

export function tallyVotes(votes) {
  const tally = {};
  Object.values(votes).forEach(t => { tally[t] = (tally[t] || 0) + 1; });
  let max = 0, top = [];
  Object.entries(tally).forEach(([n, c]) => {
    if (c > max) { max = c; top = [n]; }
    else if (c === max) top.push(n);
  });
  return { tally, top, maxVotes: max, isTie: top.length > 1 };
}

export function getPhaseText(phase) {
  const m = { waiting: '대기 중', wordConfirm: '단어 확인', explanation: '설명 단계', discussion: '자유 토론', voting: '투표 단계', wordGuess: '단어 맞히기', result: '결과 공개' };
  return m[phase] || phase;
}