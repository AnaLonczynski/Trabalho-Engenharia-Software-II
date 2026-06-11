import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_URL });

// ========== ATENDIMENTOS ==========
export const atendimentoService = {
  listar:    ()          => api.get('/atendimentos'),
  buscar:    (id)        => api.get(`/atendimentos/${id}`),
  criar:     (atendimento)   => api.post('/atendimentos', atendimento),
  atualizar: (id, dados) => api.put(`/atendimentos/${id}`, dados),
  deletar:   (id)        => api.delete(`/atendimentos/${id}`)
};

// ========== EXAME LABORATORIAL ==========
export const exameLaboratorialService = {
    listar:    ()          => api.get('/exame_lab'),
    buscar:    (id)        => api.get(`/exame_lab/${id}`),   
    criar:     (exame)     => api.post('/exame_lab', exame),
    atualizar: (id, dados) => api.put(`/exame_lab/${id}`, dados),
    deletar:   (id)        => api.delete(`/exame_lab/${id}`)
};