import React, { useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { useApi, useApiMutation } from '../hooks/useApi';
import apiService from '../services/api';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState({
    id: '',
    nombre: '',
    codigoBarras: '',
    precio: '',
    categoria: '',
    stock: ''
  });

  const { data: products, loading, refetch } = useApi('/catalogo');
  const { mutate, loading: creating } = useApiMutation();

  const filteredProducts = products?.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.codigoBarras.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = async () => {
    if (!newProduct.id || !newProduct.nombre || !newProduct.codigoBarras) {
      return;
    }

    try {
      await mutate(() => apiService.createProduct({
        id: newProduct.id.trim(),
        nombre: newProduct.nombre.trim(),
        codigoBarras: newProduct.codigoBarras.trim(),
        precio: parseFloat(newProduct.precio || 0),
        categoria: newProduct.categoria.trim(),
        stock: parseInt(newProduct.stock || 0, 10)
      }));

      setNewProduct({
        id: '',
        nombre: '',
        codigoBarras: '',
        precio: '',
        categoria: '',
        stock: ''
      });
      refetch();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Eliminar este producto del catalogo?')) {
      return;
    }

    try {
      await mutate(() => apiService.deleteProduct(productId));
      refetch();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Catalogo</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por ID, nombre o codigo"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Producto</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Codigo</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Precio</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Stock</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts?.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{product.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.codigoBarras}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${product.precio.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.stock}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                      >
                        <Trash2 size={14} />
                        <span>Eliminar</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProducts?.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No hay productos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="w-80 bg-white shadow-lg border-l border-gray-200">
        <div className="p-6 h-full overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Nuevo producto</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ID</label>
              <input
                type="text"
                placeholder="P001"
                value={newProduct.id}
                onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                placeholder="Arroz"
                value={newProduct.nombre}
                onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Codigo de barras</label>
              <input
                type="text"
                placeholder="123456789"
                value={newProduct.codigoBarras}
                onChange={(e) => setNewProduct({ ...newProduct, codigoBarras: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <input
                type="text"
                placeholder="Granos"
                value={newProduct.categoria}
                onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
              <input
                type="number"
                step="0.01"
                placeholder="2.50"
                value={newProduct.precio}
                onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
              <input
                type="number"
                placeholder="10"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleAddProduct}
              disabled={creating}
              className="w-full bg-slate-700 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {creating ? 'Agregando...' : 'Agregar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
