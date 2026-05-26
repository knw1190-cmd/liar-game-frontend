import { useState, useEffect, useCallback } from 'react';
import socketService from './services/socketService.jsx';
import apiService from './services/apiService.jsx';
import JoinRoom from './components/Student/JoinRoom.jsx';
import WaitingRoom from './components/Student/WaitingRoom.jsx';
import WordConfirm from './components/Student/WordConfirm.jsx';
import ExplanationPhase from './components/Student/ExplanationPhase.jsx';
import DiscussionPhase from './components/Student/DiscussionPhase.jsx';
import VotingPhase from './components/Student/VotingPhase.jsx';
import WordGuessPhase from './components/Student/WordGuessPhase.jsx';
import ResultPhase from './components/Student/ResultPhase.jsx';
import TeacherDashboard from './components/Teacher/Dashboard.jsx';
import './styles.css';

const App = () => {
  const [screen, setScreen] = useState('modeSelect'); // modeSelect | teacherLogin | teacher | studentJoin | studentGame
  const [player, setPlayer] = useState({ name: '', roomCode: '' });
  const [phase, setPhase] = useState('join');
  const [gameState, setGameState] = useState(null);
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState([]);
  const [messages, setMessages] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalTime, setTotalTime] = useState(30);
  const [isCritical, setIsCritical] = useState(false);
  const [teams, setTeams] = useState([]);
  const [wordSets, setWordSets] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [teacherAuthed, setTeacherAuthed] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);

  // Socket.io 초기화
  useEffect(() => {
    socketService.connect();
    return () => socketService.disconnect();
  }, []);

  // Socket 이벤트 리스너
  useEffect(() => {
    if (!socketService.socket) return;

    const onJoined = (data) => {
      setPlayer(data);
      setScreen('studentGame');
      setPhase('waiting');
    };

    const onJoinError = (err) => alert(err);

    const onPlayerJoined = (data) => {
      setPlayers(prev => [...prev, data]);
    };

    const onGameStarted = (data) => {
      setCurrentRound(1);
      setPhase('wordConfirm');
      setPlayers(data.players || []);
      setGameState(data);
      setMessages([]);
      setScores([]);
    };

    const onNextRound = (data) => {
      setPhase('wordConfirm');
      setCurrentRound(prev => prev + 1);
      setMessages([]);
    };

    const onPhaseChanged = (data) => {
      setPhase(data.phase);
    };

    const onWordConfirmed = (data) => {
      setPlayers(prev => prev.map(p =>
        p.name === data.playerName ? { ...p, hasConfirmed: true } : p
      ));
    };

    const onExplanationSubmitted = (data) => {
      setMessages(prev => [...prev, { sender: data.playerName, text: data.explanation }]);
    };

    const onChatMessage = (data) => {
      setMessages(prev => [...prev, { sender: data.sender, text: data.text }]);
    };

    const onVoteSubmitted = (data) => {
      setPlayers(prev => prev.map(p =>
        p.name === data.voterName ? { ...p, hasVoted: true } : p
      ));
    };

    const onWordGuessResult = (data) => {
      setGameState(data.result);
      setPhase('result');
    };

    const onGameEnded = () => {
      setScreen('modeSelect');
      setPhase('join');
      setGameState(null);
      setPlayers([]);
    };

    socketService.on('joinedRoom', onJoined);
    socketService.on('joinError', onJoinError);
    socketService.on('playerJoined', onPlayerJoined);
    socketService.on('gameStarted', onGameStarted);
    socketService.on('nextRound', onNextRound);
    socketService.on('phaseChanged', onPhaseChanged);
    socketService.on('wordConfirmed', onWordConfirmed);
    socketService.on('explanationSubmitted', onExplanationSubmitted);
    socketService.on('chatMessage', onChatMessage);
    socketService.on('voteSubmitted', onVoteSubmitted);
    socketService.on('wordGuessResult', onWordGuessResult);
    socketService.on('gameEnded', onGameEnded);

    return () => {
      ['joinedRoom','joinError','playerJoined','gameStarted','nextRound','phaseChanged',
       'wordConfirmed','explanationSubmitted','chatMessage','voteSubmitted','wordGuessResult','gameEnded']
        .forEach(ev => socketService.off(ev));
    };
  }, [socketService.socket]);

  // --- 학생 ---
  const handleJoin = useCallback(({ roomCode, name }) => {
    socketService.joinRoom(roomCode, name);
  }, []);

  const handleConfirmWord = useCallback(() => {
    socketService.confirmWord(player.roomCode, player.name);
  }, [player]);

  const handleSubmitExplanation = useCallback((name, text) => {
    socketService.submitExplanation(player.roomCode, name, text);
  }, [player]);

  const handleSendMessage = useCallback((sender, text) => {
    socketService.sendChat(player.roomCode, sender, text);
  }, [player]);

  const handleSubmitVote = useCallback((voter, target) => {
    socketService.submitVote(player.roomCode, voter, target);
  }, [player]);

  const handleSubmitGuess = useCallback((name, word) => {
    socketService.submitGuess(player.roomCode, name, word);
  }, [player]);

  // --- 교사 ---
  const handleTeacherLogin = async (password) => {
    try {
      const res = await apiService.teacherLogin(password);
      if (res.success) {
        setTeacherAuthed(true);
        setScreen('teacher');
        // 초기 데이터 로드
        loadTeacherData();
      }
    } catch (e) {
      throw new Error('비밀번호가 틀렸습니다.');
    }
  };

  const loadTeacherData = async () => {
    try {
      const [roomList, wsList] = await Promise.all([
        apiService.getRooms(),
        apiService.getWordSets()
      ]);
      setRooms(roomList || []);
      setWordSets(wsList || []);
    } catch (e) {
      console.error('Failed to load teacher data:', e);
    }
  };

  const handleCreateRoom = async (teamName) => {
    try {
      const room = await apiService.createRoom(teamName);
      setRooms(prev => [{ ...room, status: 'waiting' }, ...prev]);
      return room;
    } catch (e) {
      console.error('Failed to create room:', e);
    }
  };

  const handleStartGame = (roomCode) => {
    socketService.startGame(roomCode);
    setRooms(prev => prev.map(r => r.roomCode === roomCode ? { ...r, status: 'playing' } : r));
  };

  const handleNextRound = (roomCode) => {
    socketService.nextRound(roomCode);
  };

  const handleEndGame = (roomCode) => {
    socketService.endGame(roomCode);
    setRooms(prev => prev.map(r => r.roomCode === roomCode ? { ...r, status: 'ended' } : r));
  };

  const handleAddWordSet = async (topic, words) => {
    const ws = await apiService.addWordSet(topic, words);
    setWordSets(prev => [...prev, ws]);
  };

  const handleDeleteWordSet = async (id) => {
    await apiService.deleteWordSet(id);
    setWordSets(prev => prev.filter(ws => ws.id !== id));
  };

  // --- 모드 선택 화면 ---
  if (screen === 'modeSelect') {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div className="fade-up">
          <div className="game-logo" style={{ fontSize: '36px', marginBottom: '8px' }}>라이어게임</div>
          <p style={{ color: 'var(--text2)', marginBottom: '40px', fontSize: '14px' }}>거짓말을 찾아라, 의심을 즐겨라</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }} className="fade-up delay-1">
          <button onClick={() => setScreen('studentJoin')} className="btn btn-primary" style={{ padding: '18px', fontSize: '17px' }}>
            🧑‍🎓 학생으로 입장
          </button>
          <button onClick={() => setScreen('teacherLogin')} className="btn btn-secondary" style={{ padding: '18px', fontSize: '17px' }}>
            👩‍🏫 선생님으로 입장
          </button>
        </div>
      </div>
    );
  }

  // --- 교사 로그인 화면 ---
  if (screen === 'teacherLogin') {
    return <TeacherLogin onLogin={handleTeacherLogin} onBack={() => setScreen('modeSelect')} />;
  }

  // --- 교사 대시보드 화면 ---
  if (screen === 'teacher') {
    return (
      <TeacherDashboard
        rooms={rooms}
        wordSets={wordSets}
        onCreateRoom={handleCreateRoom}
        onStartGame={handleStartGame}
        onNextRound={handleNextRound}
        onEndGame={handleEndGame}
        onRefreshData={loadTeacherData}
        onAddWordSet={handleAddWordSet}
        onDeleteWordSet={handleDeleteWordSet}
        onBack={() => { setTeacherAuthed(false); setScreen('modeSelect'); }}
      />
    );
  }

  // --- 학생 입장 화면 ---
  if (screen === 'studentJoin') {
    return (
      <div className="app-container">
        <JoinRoom onJoin={handleJoin} onBack={() => setScreen('modeSelect')} />
      </div>
    );
  }

  // --- 학생 게임 화면 ---
  return (
    <div className="app-container">
      <div className="game-logo" style={{ fontSize: '16px', marginBottom: '4px' }}>라이어게임</div>

      {phase === 'waiting' && (
        <WaitingRoom roomCode={player.roomCode} name={player.name} players={players} />
      )}
      {phase === 'wordConfirm' && (
        <WordConfirm playerName={player.name} isLiar={gameState?.isLiar} assignedWord={gameState?.assignedWord} topic={gameState?.topic} onConfirmWord={handleConfirmWord} />
      )}
      {phase === 'explanation' && (
        <ExplanationPhase playerName={player.name} isMyTurn={gameState?.currentSpeaker === player.name} timeLeft={timeLeft} isCriticalTime={isCritical} onSubmitExplanation={handleSubmitExplanation} />
      )}
      {phase === 'discussion' && (
        <DiscussionPhase playerName={player.name} messages={messages} onSendMessage={handleSendMessage} />
      )}
      {phase === 'voting' && (
        <VotingPhase playerName={player.name} players={players} onSubmitVote={handleSubmitVote} />
      )}
      {phase === 'wordGuess' && (
        <WordGuessPhase playerName={player.name} isLiar={gameState?.isLiar} onSubmitGuess={handleSubmitGuess} />
      )}
      {phase === 'result' && (
        <ResultPhase playerName={player.name} isLiar={gameState?.isLiar} result={gameState} scores={scores} messages={messages} onSendMessage={handleSendMessage} onNextRound={() => {}} />
      )}
    </div>
  );
};

// --- 교사 로그인 모달 ---
const TeacherLogin = ({ onLogin, onBack }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) { setError('비밀번호를 입력해주세요!'); return; }
    setLoading(true);
    setError('');
    try {
      await onLogin(password);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ justifyContent: 'center' }}>
      <div className="fade-up" style={{ textAlign: 'center' }}>
        <div className="game-logo" style={{ fontSize: '22px', marginBottom: '24px' }}>👩‍🏫 선생님 전용</div>
      </div>
      <form onSubmit={handleSubmit} className="fade-up delay-1">
        <div className="card" style={{ borderTop: 'none', marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text2)', fontSize: '13px', fontWeight: 700 }}>비밀번호 입력</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="교사용 비밀번호" className="input-field" autoFocus />
        </div>
        {error && <p style={{ color: 'var(--red)', fontSize: '13px', textAlign: 'center', marginBottom: '12px' }}>{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginBottom: '10px' }}>
          {loading ? '확인 중...' : '입장하기'}
        </button>
        <button type="button" onClick={onBack} className="btn btn-ghost">뒤로가기</button>
      </form>
    </div>
  );
};

export default App;
