import React, { useState } from 'react';
import { getTicketByCode } from '../services/api';
import { Search, Clock, CheckCircle2, AlertTriangle, User, MessageSquare, Loader2 } from 'lucide-react';

export default function TrackTicket() {
  const [code, setCode] = useState('');
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');
    setTicket(null);

    try {
      const res = await getTicketByCode(code.trim().toUpperCase());
      setTicket(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'No se encontró un ticket registrado con ese código.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      en_proceso: 'bg-blue-100 text-blue-800 border-blue-200',
      resuelto: 'bg-green-100 text-green-800 border-green-200',
      cerrado: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pendiente}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 border border-gray-100 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        <Search className="text-blue-600" /> Consultar Estado de Ticket
      </h2>
      <p className="text-gray-500 mb-6 text-sm">
        Ingresa tu código de seguimiento (ej: TCK-Q9CZR) para verificar el progreso de tu requerimiento.
      </p>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código TCK-XXXXX"
          className="flex-1 border border-gray-300 rounded-lg p-2.5 uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors disabled:bg-blue-300"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          Buscar
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {ticket && (
        <div className="border border-gray-200 rounded-lg p-5 bg-gray-50/50 space-y-4">
          <div className="flex justify-between items-start border-b border-gray-200 pb-3">
            <div>
              <span className="text-xs font-semibold text-gray-400">CÓDIGO: {ticket.tracking_code}</span>
              <h3 className="text-lg font-bold text-gray-800">{ticket.title}</h3>
            </div>
            {getStatusBadge(ticket.status)}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-semibold text-gray-700">Cliente:</span> {ticket.client_name}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Prioridad:</span> <span className="capitalize">{ticket.priority}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Categoría Sugerida IA:</span> {ticket.ai_category_suggestion || 'Hardware'}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Fecha:</span> {new Date(ticket.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="bg-white p-3 rounded border border-gray-200 text-sm text-gray-700">
            <span className="font-semibold block mb-1 text-gray-800">Descripción:</span>
            {ticket.description}
          </div>
        </div>
      )}
    </div>
  );
}