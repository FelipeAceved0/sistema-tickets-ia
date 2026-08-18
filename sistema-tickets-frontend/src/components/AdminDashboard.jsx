import React, { useState, useEffect } from 'react';
import { getAllTickets, updateTicketStatus } from '../services/api';
import { ShieldCheck, Filter, RefreshCw, AlertCircle, Eye, X, Bot, Calendar, Mail, User, Phone } from 'lucide-react';

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllTickets();
      setTickets(res.data);
    } catch (err) {
      setError('Error al cargar la lista de tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTicketStatus(id, { status: newStatus });
      setTickets(prev =>
        prev.map(t => (t.id === id ? { ...t, status: newStatus } : t))
      );
      if (selectedTicket && selectedTicket.id === id) {
        setSelectedTicket(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert('No se pudo actualizar el estado del ticket.');
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (filterStatus === 'todos') return true;
    return t.status === filterStatus;
  });

  const getPriorityBadge = (priority) => {
    const styles = {
      baja: 'bg-gray-100 text-gray-700',
      media: 'bg-blue-100 text-blue-700',
      alta: 'bg-orange-100 text-orange-700',
      critica: 'bg-red-100 text-red-700 font-bold',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs capitalize ${styles[priority] || styles.media}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" /> Panel Técnico de Gestión
          </h2>
          <p className="text-gray-500 text-sm">Monitorea y actualiza la resolución de incidencias en tiempo real.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-sm">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent focus:outline-none text-gray-700 font-medium"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="en_proceso">En Proceso</option>
              <option value="resuelto">Resueltos</option>
              <option value="cerrado">Cerrados</option>
            </select>
          </div>

          <button
            onClick={fetchTickets}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            title="Recargar tickets"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-400">Cargando tickets...</div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No hay tickets registrados en esta categoría.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Asunto</th>
                <th className="px-4 py-3">Categoría Sugerida</th>
                <th className="px-4 py-3">Prioridad</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-mono font-semibold text-blue-600">{t.tracking_code}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{t.client_name}</div>
                    <div className="text-xs text-gray-400">{t.client_email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800 max-w-xs truncate">{t.title}</div>
                    <div className="text-xs text-gray-500 max-w-xs truncate">{t.description}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-100 font-medium">
                      {t.ai_category_suggestion || t.category || 'General'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{getPriorityBadge(t.priority)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={t.status}
                      onChange={(e) => handleStatusChange(t.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_proceso">En Proceso</option>
                      <option value="resuelto">Resuelto</option>
                      <option value="cerrado">Cerrado</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedTicket(t)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver Detalles"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Detalles */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedTicket.tracking_code}
                </span>
                <h3 className="text-xl font-bold text-gray-800 mt-1">{selectedTicket.title}</h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                <span className="font-semibold text-gray-700">{selectedTicket.client_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <span className="truncate">{selectedTicket.client_email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <span>{selectedTicket.client_phone || 'No registrado'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <span>{new Date(selectedTicket.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase text-gray-400 mb-1">Descripción del Problema</h4>
              <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200 min-h-[60px] whitespace-pre-wrap">
                {selectedTicket.description || 'Sin descripción disponible.'}
              </p>
            </div>

            {selectedTicket.ai_category_suggestion && (
              <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs uppercase tracking-wider">
                  <Bot size={16} /> Análisis Inteligente (IA)
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  Categoría Inferida por Gemini: <span className="text-blue-600 font-bold">{selectedTicket.ai_category_suggestion}</span>
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Estado:</span>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                  className="border border-gray-300 rounded px-2.5 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="resuelto">Resuelto</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}