import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// Endpoints de Tickets
export const createTicket = (data) => API.post('/tickets', data);
export const getTicketByCode = (code) => API.get(`/tickets/track/${code}`);
export const getAllTickets = () => API.get('/tickets');
export const updateTicketStatus = (id, data) => API.put(`/tickets/${id}`, data);

export default API;