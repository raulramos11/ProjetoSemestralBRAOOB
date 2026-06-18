const API_BASE_URL = 'http://localhost:8080';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  setAuthToken(token) {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getAuthHeaders() {
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      let data;
      if (isJson) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const error = new Error(data?.erro || data?.message || `HTTP ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      if (error.status === 401) {
        this.setAuthToken(null);
        window.location.href = '/login';
      }
      throw error;
    }
  }

  // Auth
  async login(email, senha) {
    const data = await this.request('/api/usuarios/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
    if (typeof data === 'string') {
      this.setAuthToken(data);
      return { token: data };
    }
    return data;
  }

  async register(userData) {
    return this.request('/api/usuarios/cadastro', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Users
  async getUsers() {
    return this.request('/api/usuarios');
  }

  async getUser(id) {
    return this.request(`/api/usuarios/${id}`);
  }

  async updateUser(id, userData) {
    return this.request(`/api/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/api/usuarios/${id}`, {
      method: 'DELETE',
    });
  }

  // Games
  async getGames() {
    return this.request('/api/jogos');
  }

  async createGame(gameData) {
    return this.request('/api/jogos', {
      method: 'POST',
      body: JSON.stringify(gameData),
    });
  }

  async updateGame(id, gameData) {
    return this.request(`/api/jogos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(gameData),
    });
  }

  async deleteGame(id) {
    return this.request(`/api/jogos/${id}`, {
      method: 'DELETE',
    });
  }

  // Tournaments
  async getTournaments() {
    return this.request('/api/torneios');
  }

  async getTournament(id) {
    return this.request(`/api/torneios/${id}`);
  }

  async createTournament(tournamentData) {
    return this.request('/api/torneios', {
      method: 'POST',
      body: JSON.stringify(tournamentData),
    });
  }

  // Inscriptions
  async getInscriptions() {
    return this.request('/api/inscricoes');
  }

  async getInscriptionsByTournament(tournamentId, status = 'APROVADO') {
    return this.request(`/api/inscricoes/torneio/${tournamentId}?status=${status}`);
  }

  async createInscription(inscriptionData) {
    return this.request('/api/inscricoes', {
      method: 'POST',
      body: JSON.stringify(inscriptionData),
    });
  }

  async updateInscriptionStatus(inscriptionId, status) {
    return this.request(`/api/inscricoes/${inscriptionId}/status?status=${status}`, {
      method: 'PATCH',
    });
  }

  // Teams
  async getTeams() {
    return this.request('/api/equipes');
  }

  async createTeam(teamData) {
    return this.request('/api/equipes', {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
  }

  // Matches
  async getMatches() {
    return this.request('/api/partidas');
  }

  async createMatch(matchData) {
    return this.request('/api/partidas', {
      method: 'POST',
      body: JSON.stringify(matchData),
    });
  }

  async updateMatchResult(matchId, resultData) {
    return this.request(`/api/partidas/${matchId}/resultado`, {
      method: 'POST',
      body: JSON.stringify(resultData),
    });
  }

  async updateMatchPhase(matchId, phaseData) {
    return this.request(`/api/partidas/${matchId}`, {
      method: 'PUT',
      body: JSON.stringify(phaseData),
    });
  }

  async deleteMatch(matchId, resultData) {
    return this.request(`/api/partidas/${matchId}`, {
      method: 'DELETE',
      body: JSON.stringify(resultData),
    });
  }
}

export const api = new ApiService();
export default api;