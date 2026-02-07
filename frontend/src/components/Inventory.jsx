import React, { useState } from 'react';
import { Search, AlertTriangle, Package, Truck } from 'lucide-react';
import { useApi, useApiMutation } from '../hooks/useApi';
import apiService from '../services/api';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(5);
  const [restockId, setRestockId] = useState('');
  const [restockQty, setRestockQty] = useState(1);

  const { data: products, loading, refetch } = useApi('/catalogo');
  const { mutate, loading: processing } = useApiMutation();

  const filteredProducts = products?.filter(item =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const lowStockCount = filteredProducts.filter(item => item.stock <= limit).length;

  const handleRestock = async (productId, quantity) => {
    if (!productId || !quantity) {
      return;
    }
    try {
      await mutate(() => apiService.receiveStock(productId, quantity));
      setRestockId('');
      setRestockQty(1);
      refetch();
      alert('Recepcion registrada exitosamente');
    } catch (error) {
      console.error('Error restocking:', error);
      alert('Error al registrar recepcion: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Cargando inventario...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="text-orange-500" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Inventario</h2>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                {lowStockCount} con stock bajo
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar productos en inventario"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
                <button
                  onClick={() => refetch()}
                  className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Actualizar
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Producto</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Stock</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Accion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.nombre}</td>
                    <td className={`px-6 py-4 text-sm ${item.stock <= limit ? 'text-orange-600 font-medium' : 'text-gray-900'}`}>
                      {item.stock}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleRestock(item.id, 5)}
                        disabled={processing}
                        className="bg-slate-700 text-white px-3 py-1 rounded text-xs hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center space-x-1"
                      >
                        <Truck size={12} />
                        <span>Recepcionar +5</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? 'No se encontraron productos' : 'No hay productos registrados'}
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
            <Package className="text-slate-700" size={22} />
            <h3 className="text-xl font-bold text-gray-900">Recepcion</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ID producto</label>
              <input
                type="text"
                value={restockId}
                onChange={(e) => setRestockId(e.target.value)}
                placeholder="P001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
              <input
                type="number"
                min="1"
                value={restockQty}
                onChange={(e) => setRestockQty(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => handleRestock(restockId, restockQty)}
              disabled={processing}
              className="w-full bg-slate-700 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {processing ? 'Procesando...' : 'Registrar recepcion'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
