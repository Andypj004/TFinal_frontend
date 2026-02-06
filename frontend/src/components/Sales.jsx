import React, { useMemo, useState } from 'react';
import { Search, Minus, Plus, DollarSign, Calculator } from 'lucide-react';
import { useApi, useApiMutation } from '../hooks/useApi';
import apiService from '../services/api';

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [customerId, setCustomerId] = useState('');

  const { data: products, loading, refetch: refetchProducts } = useApi('/catalogo');
  const { mutate, loading: processing } = useApiMutation();

  const filteredProducts = products?.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.codigoBarras.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      setOrderItems(orderItems.filter(item => item.id !== id));
    } else {
      setOrderItems(orderItems.map(item =>
        item.id === id ? { ...item, cantidad: newQuantity } : item
      ));
    }
  };

  const addToOrder = (product) => {
    if (product.stock <= 0) {
      alert('Producto sin stock disponible');
      return;
    }

    const existingItem = orderItems.find(item => item.product_id === product.id);
    if (existingItem) {
      if (existingItem.cantidad >= product.stock) {
        alert('No hay suficiente stock disponible');
        return;
      }
      updateQuantity(existingItem.id, existingItem.cantidad + 1);
    } else {
      const newItem = {
        id: Date.now().toString(),
        product_id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: 1,
        stock_disponible: product.stock
      };
      setOrderItems([...orderItems, newItem]);
    }
  };

  const totalAmount = useMemo(
    () => orderItems.reduce((total, item) => total + (item.precio * item.cantidad), 0),
    [orderItems]
  );

  const paymentAmountNum = parseFloat(paymentAmount) || 0;
  const changeAmount = paymentAmountNum - totalAmount;

  const handleShowPayment = () => {
    if (orderItems.length === 0) {
      alert('Agregue productos a la venta');
      return;
    }
    if (!customerId) {
      alert('Ingrese el ID del cliente');
      return;
    }
    setShowPayment(true);
    setPaymentAmount(totalAmount.toFixed(2));
  };

  const handleConfirmSale = async () => {
    if (orderItems.length === 0 || !customerId) return;

    if (paymentAmountNum < totalAmount) {
      alert('El monto pagado es insuficiente');
      return;
    }

    try {
      const items = orderItems.map(item => ({
        id: item.product_id,
        cantidad: item.cantidad
      }));

      await mutate(() => apiService.createSale(customerId, items));

      setOrderItems([]);
      setPaymentAmount('');
      setShowPayment(false);
      setCustomerId('');

      refetchProducts();

      if (changeAmount > 0) {
        alert(`Venta registrada exitosamente. Cambio: $${changeAmount.toFixed(2)}`);
      } else {
        alert('Venta registrada exitosamente');
      }
    } catch (error) {
      console.error('Error creating sale:', error);
      alert(`Error al registrar la venta: ${error.message || 'Error desconocido'}`);
    }
  };

  const cancelPayment = () => {
    setShowPayment(false);
    setPaymentAmount('');
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
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Productos</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar producto por nombre, ID o codigo"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Producto</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Precio</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts?.map((product) => (
                  <tr
                    key={product.id}
                    className={`cursor-pointer transition-colors ${
                      product.stock <= 0
                        ? 'bg-red-50 hover:bg-red-100 text-red-600'
                        : product.stock <= 5
                          ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-800'
                          : 'hover:bg-gray-50'
                    }`}
                    onClick={() => addToOrder(product)}
                  >
                    <td className="px-6 py-4 text-sm font-medium">{product.id}</td>
                    <td className="px-6 py-4 text-sm">{product.nombre}</td>
                    <td className="px-6 py-4 text-sm font-medium">${product.precio.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-medium ${
                        product.stock <= 0 ? 'text-red-600' :
                        product.stock <= 5 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="w-96 bg-white shadow-lg border-l border-gray-200">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center space-x-2 mb-6">
            <Calculator className="text-slate-700" size={24} />
            <h3 className="text-xl font-bold text-gray-900">Caja Registradora</h3>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cliente ID</label>
            <input
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="0102030405"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div className="flex-1 overflow-y-auto mb-6">
            <div className="space-y-3">
              {orderItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{item.nombre}</div>
                    <div className="text-sm text-gray-600">${item.precio.toFixed(2)} c/u</div>
                    <div className="text-xs text-gray-500">Stock: {item.stock_disponible}</div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                      className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center hover:bg-slate-800 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.cantidad}</span>
                    <button
                      onClick={() => {
                        if (item.cantidad >= item.stock_disponible) {
                          alert('No hay suficiente stock');
                          return;
                        }
                        updateQuantity(item.id, item.cantidad + 1);
                      }}
                      className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center hover:bg-slate-800 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {orderItems.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Seleccione productos para agregar a la venta
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 flex-shrink-0">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-slate-700">${totalAmount.toFixed(2)}</span>
              </div>

              {showPayment && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monto Recibido
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="number"
                        step="0.01"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-lg font-medium"
                        placeholder="0.00"
                        autoFocus
                      />
                    </div>
                  </div>

                  {paymentAmountNum > 0 && (
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-medium">Cambio:</span>
                      <span className={`font-bold ${changeAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${changeAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={cancelPayment}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirmSale}
                      disabled={processing || paymentAmountNum < totalAmount}
                      className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? 'Procesando...' : 'Confirmar Venta'}
                    </button>
                  </div>
                </>
              )}

              {!showPayment && (
                <button
                  onClick={handleShowPayment}
                  disabled={orderItems.length === 0}
                  className="w-full bg-slate-700 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <DollarSign size={20} />
                  <span>Procesar Pago</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
