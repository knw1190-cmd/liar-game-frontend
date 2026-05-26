import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(url = window.location.origin) {
    if (this.socket?.connected) return;
    this.socket = io(url, {
      path: '/liar/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000
    });
    this.socket.on('connect', () => console.log('Socket connected:', this.socket.id));
    this.socket.on('disconnect', (r) => console.log('Socket disconnected:', r));
    this.socket.on('connect_error', (e) => console.error('Socket error:', e.message));
  }

  joinRoom(code, name) { this.emit('joinRoom', { roomCode: code, name }); }
  startGame(code) { this.emit('startGame', code); }
  nextRound(code) { this.emit('nextRound', code); }
  confirmWord(code, name) { this.emit('confirmWord', { roomCode: code, playerName: name }); }
  submitExplanation(code, name, text) { this.emit('submitExplanation', { roomCode: code, playerName: name, explanation: text }); }
  sendChat(code, sender, text) { this.emit('chatMessage', { roomCode: code, sender, text }); }
  submitVote(code, voter, target) { this.emit('submitVote', { roomCode: code, voterName: voter, targetName: target }); }
  submitGuess(code, name, word) { this.emit('submitWordGuess', { roomCode: code, playerName: name, guessedWord: word }); }
  endGame(code) { this.emit('endGame', code); }

  on(event, cb) { this.socket?.on(event, cb); }
  off(event, cb) { this.socket?.off(event, cb); }
  emit(event, data) { if (this.socket?.connected) this.socket.emit(event, data); }
  disconnect() { this.socket?.disconnect(); this.socket = null; }
  isConnected() { return this.socket?.connected || false; }
}

const socketService = new SocketService();
export default socketService;