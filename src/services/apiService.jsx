const API_BASE = window.location.origin + '/liar' || 'http://localhost:3001';

class ApiService {
  async req(endpoint, opts = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      ...opts
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    return res.json();
  }

  getWordSets() { return this.req('/api/word-sets'); }
  addWordSet(topic, words) { return this.req('/api/word-sets', { method: 'POST', body: JSON.stringify({ topic, words }) }); }
  updateWordSet(id, topic, words) { return this.req(`/api/word-sets/${id}`, { method: 'PUT', body: JSON.stringify({ topic, words }) }); }
  deleteWordSet(id) { return this.req(`/api/word-sets/${id}`, { method: 'DELETE' }); }
  createRoom(teamName) { return this.req('/api/rooms', { method: 'POST', body: JSON.stringify({ teamName }) }); }
  getRoom(code) { return this.req(`/api/rooms/${code}`); }
  deleteRoom(code) { return this.req(`/api/rooms/${code}`, { method: 'DELETE' }); }
  getTeams() { return this.req('/api/teams'); }
  addTeam(teamName, members) { return this.req('/api/teams', { method: 'POST', body: JSON.stringify({ teamName, members }) }); }
  deleteTeam(id) { return this.req(`/api/teams/${id}`, { method: 'DELETE' }); }
  getRooms() { return this.req('/api/rooms'); }
  teacherLogin(password) { return this.req('/api/teacher/login', { method: 'POST', body: JSON.stringify({ password }) }); }
}

const apiService = new ApiService();
export default apiService;