import React, { useState } from 'react';
import { createTicket } from '../services/api';
import { Send, Bot, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function CreateTicket() {
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    title: '',
    description: '',
    priority: 'media'
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const res = await createTicket(formData);
      setResponse(res.data);
      setFormData({
        client_name: '',
        client_email: '',
        client_phone: '',
        title: '',
        description: '',
        priority: 'media'
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        <Send className="text-blue-600" /> Crear Solicitud de Soporte
      </h2>
      <p className="text-gray-500 mb-6 text-sm">
        Describe tu inconveniente técnico. Nuestro sistema asistido por IA analizará tu caso inmediatamente.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
            <input
              type="text"
              name="client_name"
              required
              value={formData.client_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ej: Juan Pérez"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico *</label>
            <input
              type="email"
              name="client_email"
              required
              value={formData.client_email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="juan@empresa.cl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              type="text"
              name="client_phone"
              value={formData.client_phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="+56912345678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título del Requerimiento *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Ej: Impresora de bodega no responde"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Detallada *</label>
          <textarea
            name="description"
            rows="4"
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Explica detalladamente el problema que estás experimentando..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-blue-300"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Generando ticket y analizando con IA...
            </>
          ) : (
            'Enviar Ticket'
          )}
        </button>
      </form>

      {/* Tarjeta de Confirmación y Sugerencia de la IA */}
      {response && (
        <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-green-800 font-semibold text-lg">
            <CheckCircle className="text-green-600" /> ¡Ticket Creado Exitosamente!
          </div>
          <p className="text-sm text-green-700">
            Guarda tu código de seguimiento: <span className="font-bold bg-green-200 px-2 py-0.5 rounded text-green-900">{response.tracking_code}</span>
          </p>

          {response.ai_analysis && (
            <div className="mt-4 p-4 bg-white border border-blue-100 rounded-lg shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-blue-700 font-medium text-sm">
                <Bot size={18} /> Sugerencia Automática de Asistencia (IA)
              </div>
              <p className="text-xs text-gray-500">
                Categoría Inferred: <strong className="text-gray-700">{response.ai_analysis.suggested_category}</strong>
              </p>
              <p className="text-sm text-gray-700 italic bg-blue-50/50 p-2.5 rounded border border-blue-50">
                "{response.ai_analysis.auto_reply}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}