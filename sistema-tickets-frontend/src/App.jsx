import React, { useState } from 'react';
import CreateTicket from './components/CreateTicket';
import TrackTicket from './components/TrackTicket';
import AdminDashboard from './components/AdminDashboard';
import { Send, Search, ShieldCheck } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <header className="max-w-5xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Sistema de Gestión de Tickets & Soporte TI
        </h1>
        <p className="text-gray-600 mt-2">Plataforma de atención técnica asistida por Inteligencia Artificial</p>

        {/* Navegación de Pestañas */}
        <div className="flex justify-center flex-wrap gap-3 mt-6">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'create'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Send size={16} /> Crear Ticket
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'track'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Search size={16} /> Consultar Estado
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'admin'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <ShieldCheck size={16} /> Panel Técnico
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        {activeTab === 'create' && <CreateTicket />}
        {activeTab === 'track' && <TrackTicket />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
}

export default App;