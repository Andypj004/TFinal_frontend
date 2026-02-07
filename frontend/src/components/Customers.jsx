import React, { useState } from 'react';
import { UserPlus, Users } from 'lucide-react';
import { useApi, useApiMutation } from '../hooks/useApi';
import apiService from '../services/api';

const Customers = () => {
  const [newCustomer, setNewCustomer] = useState({
    id: '',
    nombre: '',
    email: ''
  });

  const { data: customers, loading, refetch } = useApi('/clientes/lista');
  const { mutate, loading: creating } = useApiMutation();

  const handleCreate = async () => {
    if (!newCustomer.id || !newCustomer.nombre || !newCustomer.email) {
      return;
    }

    try {
      await mutate(() => apiService.createClient({
        id: newCustomer.id.trim(),
        nombre: newCustomer.nombre.trim(),
        email: newCustomer.email.trim()
      }));
      setNewCustomer({ id: '', nombre: '', email: '' });
      refetch();
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Cargando clientes...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="text-slate-700" size={22} />
              <h2 className="text-xl font-bold text-gray-900">Clientes</h2>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Nombre</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Puntos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers?.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.puntosFidelidad ?? 0}</td>
                  </tr>
                ))}
                {(!customers || customers.length === 0) && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No hay clientes registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="w-80 bg-white shadow-lg border-l border-gray-200">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center space-x-2 mb-6">
            <UserPlus className="text-slate-700" size={20} />
            <h3 className="text-xl font-bold text-gray-900">Nuevo cliente</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ID / Cedula</label>
              <input
                type="text"
                value={newCustomer.id}
                onChange={(e) => setNewCustomer({ ...newCustomer, id: e.target.value })}
                placeholder="0102030405"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value={newCustomer.nombre}
                onChange={(e) => setNewCustomer({ ...newCustomer, nombre: e.target.value })}
                placeholder="Maria Torres"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                placeholder="maria@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="w-full bg-slate-700 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {creating ? 'Guardando...' : 'Registrar cliente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
